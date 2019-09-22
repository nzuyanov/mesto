export { Card }
import { cardsContainer, api, modalPopup } from "../main.js";

class Card{
    constructor(name, link, likeNumber, ownerPerms){
      this.cardElement = this.create(name, link, likeNumber, ownerPerms);
      this.cardElement.querySelector('.place-card__like-icon').addEventListener('click', this.like);
      this.cardElement.querySelector('.place-card__image').addEventListener('click', this.zoom);
      if (ownerPerms){
        this.cardElement.querySelector('.place-card__delete-icon').addEventListener('click', this.remove);
      }
    }
  
    create(name, link, likeNumber, ownerPerms){
      const cardContainer = document.createElement('div');
      const cardImage = document.createElement('div');
      const cardDescription = document.createElement('div');
      const cardName = document.createElement('h3');
      const cardStatistics = document.createElement('div');
      const cardLikeButton = document.createElement('button');
      const cardLikeCounter = document.createElement('p');
  
      cardContainer.classList.add('place-card');
      cardImage.classList.add('place-card__image');
      cardDescription.classList.add('place-card__description');
      cardName.classList.add('place-card__name');
      cardStatistics.classList.add('place-card__description_statistics');
      cardLikeButton.classList.add('place-card__like-icon');
      cardLikeCounter.classList.add('place-card__like-count');
      cardLikeCounter.textContent = `${likeNumber}`;
  
      cardImage.setAttribute('style', `background-image: url(${link})`);
      cardName.textContent = name;
  
      cardDescription.appendChild(cardName);
      cardStatistics.appendChild(cardLikeButton);
      cardStatistics.appendChild(cardLikeCounter);
      cardDescription.appendChild(cardStatistics);
      cardContainer.appendChild(cardImage);
      cardContainer.appendChild(cardDescription);

      if (ownerPerms){
        const cardDeleteButton = document.createElement('button');
        cardDeleteButton.classList.add('place-card__delete-icon');
        cardImage.appendChild(cardDeleteButton);
      }

      return cardContainer;
    }
  
    like(event){
      const cardIndex = cardsContainer.cards.indexOf(event.target.parentNode.parentNode.parentNode);
      if (event.target.classList.contains('place-card__like-icon_liked')){
        event.target.classList.remove('place-card__like-icon_liked');
        api.deleteLike(cardIndex)
          .then(res => {
            if (res.ok) {
              return res.json();
            }
            return Promise.reject(`Ошибка ${res.status}`);
          })
          .then((card) => {
            api.cardsArray[cardIndex].likes = card.likes;
            cardsContainer.cards[cardIndex].querySelector('.place-card__like-count').textContent =
              `${card.likes.length}`;
          })
          .catch((err) => {
            console.log(err);
            alert(`Не получилось снять лайк!\n${err}`);
          })
      }
      else{
        event.target.classList.add('place-card__like-icon_liked');
        api.putLike(cardIndex)
          .then(res => {
            if (res.ok) {
              return res.json();
            }
            return Promise.reject(`Ошибка ${res.status}`);
          })
          .then((card) => {
            api.cardsArray[cardIndex].likes = card.likes;
            cardsContainer.cards[cardIndex].querySelector('.place-card__like-count').textContent =
              `${card.likes.length}`;
          })
          .catch((err) => {
            console.log(err);
            alert(`Не получилось поставить лайк!\n${err}`);
          })
      }
    }
  
    remove(event){
      if (window.confirm('Вы действительно хотите удалить эту карточку?')){
        const cardIndex = cardsContainer.cards.indexOf(event.target.parentNode.parentNode);
        api.deleteCard(cardIndex)
          .then(res => {
            if (res.ok) {
              return res.json();
            } 
            return Promise.reject(`Ошибка ${res.status}`);
          })
          .then((data) => {
            cardsContainer.container.removeChild(cardsContainer.cards[cardIndex].querySelector('.place-card__delete-icon').parentNode.parentNode);
            cardsContainer.cards.splice(cardIndex, 1);
            cardsContainer.render();
          })
          .catch((err) => {
            console.log(err);
            alert(`Не получилось удалить карточку!\n${err}`);
          })
      }
      event.stopPropagation();
    }
  
    zoom(event){
      modalPopup.open('image', event);
    }
}