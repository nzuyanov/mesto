export { Popup }

class Popup {
  open(type, event) {
    switch (type) {
      case 'content':
        document.querySelector('.popup').classList.add('popup_is-opened');
        document.querySelector('.popup__content').classList.add('popup__content_is-opened');
        break;
      case 'info':
        document.querySelector('.popup').classList.add('popup_is-opened');
        document.querySelector('.popup__info').classList.add('popup__info_is-opened');
        userInfo.elements.name.value = document.querySelector('.user-info__name').textContent;
        userInfo.elements.about.value = document.querySelector('.user-info__job').textContent;
        break;
      case 'image':
        const popupImageStyle = event.target.getAttribute('style');
        const imageUrl = popupImageStyle.substring(22, popupImageStyle.length - 1);
        document.querySelector('.popup').classList.add('popup_is-opened');
        document.querySelector('.popup__image').classList.add('popup__image_is-opened');
        document.querySelector('.popup__image_background').setAttribute('src', imageUrl);
        break;
      case 'avatar':
        document.querySelector('.popup').classList.add('popup_is-opened');
        document.querySelector('.popup__avatar').classList.add('popup__avatar_is-opened');
        break;
      default:
        console.log('Unexpected popup type');
        break;
    }
  }

  close() {
    document.querySelector('.popup').classList.remove('popup_is-opened');
    document.querySelector('.popup__content').classList.remove('popup__content_is-opened');
    document.querySelector('.popup__info').classList.remove('popup__info_is-opened');
    document.querySelector('.popup__image').classList.remove('popup__image_is-opened');
    document.querySelector('.popup__avatar').classList.remove('popup__avatar_is-opened');
  }
}