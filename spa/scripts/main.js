const api = new Api({
  baseUrl: 'http://95.216.175.5/cohort2',
  headers: {
    authorization: '2a5289af-b41b-41a4-8b1f-ca258824d071',
    'Content-Type': 'application/json'
  }
});

const cardsContainer = new CardList(document.querySelector('.places-list'));
const modalPopup = new Popup();
const infoButton = document.querySelector('.user-info__button');
const editButton = document.querySelector('.user-info__button_edit');
const closeContentPopupButton = document.querySelector('.popup__close_content');
const closeInfoPopupButton = document.querySelector('.popup__close_info');
const closeImagePopupButton = document.querySelector('.popup__close_image');
const closeAvatarPopupButton = document.querySelector('.popup__close_avatar');
const plusButton = document.querySelector('.popup__button_plus');
const saveButton = document.querySelector('.popup__button_save');
const editAvatarElement = document.querySelector('.user-info__photo');
const saveAvatarButton = document.getElementById('saveAvatarButton');

// ========================================================================================
//                          Functions 
// ========================================================================================

function refreshData(){
  api.getUserInfo()
    .then(res => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Ошибка ${res.status}`);
    })
    .then((result) => {
      api.userInfo = result;
      refreshUserInfo(api.userInfo);
    })
    .catch((err) => {
      console.log(err);
      alert(`Не получилось загрузить информацию о пользователе с сервера!\n${err}`);
    });
  api.getInitialCards()
    .then(res => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Ошибка ${res.status}`);
    })
    .then((result) => {
      if (result && result.length > 0){
        cardsContainer.cards = [];
        document.querySelector('.places-list').textContent = "";
        api.cardsArray = result;
      }
    })
    .catch((err) => {
      console.log(err);
      alert(`Не получилось загрузить карточки с сервера!\n${err}`);
    })
    .finally(() => {
      api.cardsArray.forEach(card => {
        cardsContainer.addCard(card);
      });
    })
}

function userIsCardOwner(card, user){
  return (user._id === card.owner._id);
}

function cardLikedBy(card, user){
  const allLiked = card.likes;
  const userId = user._id;
  const result = allLiked.reduce(function(res, currentUser){
    if (userId === currentUser._id) {
      res = true;
    }
    return res;
  }, false);
  return result;
}

function refreshUserInfo(userObj){
  document.querySelector('.user-info__name').textContent = userObj.name;
  document.querySelector('.user-info__job').textContent = userObj.about;
  editAvatarElement.setAttribute('style', `background-image: url(${userObj.avatar});`)
}

function validField(field, errMsg){
  let res = true;
  if (field.value.length === 0){
    res = false;
    errMsg.textContent = 'Обязательное поле';
  }else{
    if ((field.value.length > 30) || (field.value.length === 1)){
      res = false;
      errMsg.textContent = 'Должно быть от 2 до 30 символов';
    }else{
      errMsg.textContent = '';
    }
  }
  return res;
}

// ========================================================================================
//                          Event Listeners 
// ========================================================================================

function handleUserInfo(event){
  event.preventDefault();
  const userInfoForm = document.forms.userInfo;
  const inputName = userInfoForm.elements.name.value;
  const inputAbout = userInfoForm.elements.about.value;
  saveButton.textContent = 'Загрузка...';
  api.patchUserInfo(inputName, inputAbout)
    .then(res => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Ошибка ${res.status}`);
    })
    .then((result) => {
      api.userInfo = result;
      refreshUserInfo(api.userInfo);
    })
    .catch((err) => {
      console.log(err);
      alert(`Не получилось изменить данные о пользователе!\n${err}`);
    })
    .finally(() => {
      saveButton.textContent = 'Сохранить';
      saveButton.setAttribute('disabled', true);
      saveButton.classList.remove('popup__button_enabled');
      saveButton.classList.add('popup__button_disabled');
      userInfoForm.reset();
      modalPopup.close();
    })
}

function handleUserAvatar(event){
  event.preventDefault();
  const userAvatarForm = document.forms.avatar;
  const inputLink = userAvatarForm.elements.link.value;
  saveAvatarButton.textContent = 'Загрузка...';
  api.patchUserAvatar(inputLink)
    .then(res => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Ошибка ${res.status}`);
    })
    .then((result) => {
      editAvatarElement.setAttribute('style', `background-image: url(${result.avatar})`);
    })
    .catch((err) => {
      console.log(err);
      alert(`Не получилось изменить аватар!\n${err}`);
    })
    .finally(() => {
      saveAvatarButton.textContent = 'Сохранить';
      saveAvatarButton.setAttribute('disabled', true);
      saveAvatarButton.classList.remove('popup__button_enabled');
      saveAvatarButton.classList.add('popup__button_disabled');
      userAvatarForm.reset();
      modalPopup.close();
    })
}

function handleAddCard(event){
  event.preventDefault();
  const addingForm = document.forms.new;
  const inputName = addingForm.elements.name.value;
  const inputLink = addingForm.elements.link.value;
  plusButton.textContent = 'Загрузка...';
  api.postNewCard(inputName, inputLink, cardsContainer)
    .then(res => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Ошибка ${res.status}`);
    })
    .then((card) => {
      api.cardsArray.push(card);
      cardsContainer.addCard(card);
    })
    .catch((err) => {
      console.log(err);
      alert(`Не получилось загрузить карточку!\n${err}`);
    })
    .finally(() => {
      plusButton.textContent = 'Сохранить';
      plusButton.setAttribute('disabled', true);
      plusButton.classList.remove('popup__button_enabled');
      plusButton.classList.add('popup__button_disabled');
      addingForm.reset();
      modalPopup.close();
    })
}

function handlePlusButtonToggle(event){
  const addingForm = document.forms.new;
  const name = addingForm.elements.name;
  const link = addingForm.elements.link;
  
  if (name.value.length === 0 || link.value.length === 0){
    plusButton.setAttribute('disabled', true);
    plusButton.classList.remove('popup__button_enabled');
    plusButton.classList.add('popup__button_disabled');
  }
  else{
    plusButton.removeAttribute('disabled');
    plusButton.classList.remove('popup__button_disabled');
    plusButton.classList.add('popup__button_enabled');
  }
}

function handleUserInfoInput(event){
  const renamingForm = document.forms.userInfo;
  const name = renamingForm.elements.name;
  const about = renamingForm.elements.about;
  const errorMsgUserName = document.querySelector('.error__user-info_name');
  const errorMsgUserAbout = document.querySelector('.error__user-info_about');

  const validFirst = validField(name, errorMsgUserName);
  const validSecond = validField(about, errorMsgUserAbout);
 

  if (validFirst && validSecond){
    saveButton.removeAttribute('disabled');
    saveButton.classList.remove('popup__button_disabled');
    saveButton.classList.add('popup__button_enabled');
  }else{
    saveButton.setAttribute('disabled', true);
    saveButton.classList.remove('popup__button_enabled');
    saveButton.classList.add('popup__button_disabled');
  }

}

function handleUserAvatarInput(event){
  const avatarForm = document.forms.avatar;
  const link = avatarForm.elements.link;
  
  if (link.value.length === 0){
    saveAvatarButton.setAttribute('disabled', true);
    saveAvatarButton.classList.remove('popup__button_enabled');
    saveAvatarButton.classList.add('popup__button_disabled');
  }
  else{
    saveAvatarButton.removeAttribute('disabled');
    saveAvatarButton.classList.remove('popup__button_disabled');
    saveAvatarButton.classList.add('popup__button_enabled');
  }
}

// ========================================================================================
//                          Startup Logic 
// ========================================================================================

infoButton.addEventListener('click', function(event){
  modalPopup.open('content');
});

editButton.addEventListener('click', function(event){
  modalPopup.open('info');
});

editAvatarElement.addEventListener('click', function(event){
  modalPopup.open('avatar');
})

closeContentPopupButton.addEventListener('click', modalPopup.close);
closeInfoPopupButton.addEventListener('click', modalPopup.close);
closeImagePopupButton.addEventListener('click', modalPopup.close);
closeAvatarPopupButton.addEventListener('click', modalPopup.close);

document.forms.new.addEventListener('submit', handleAddCard);
document.forms.new.addEventListener('input', handlePlusButtonToggle);
document.forms.userInfo.addEventListener('submit', handleUserInfo);
document.forms.userInfo.addEventListener('input', handleUserInfoInput);
document.forms.avatar.addEventListener('submit', handleUserAvatar);
document.forms.avatar.addEventListener('input', handleUserAvatarInput);

refreshData();
let keepAlive = setInterval(refreshData, 5000);