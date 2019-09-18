class CardList{
    constructor(container){
      this.container = container;
      this.cards = [];
    }
  
    addCard(card){
      let ownerPerms = false;
      if (userIsCardOwner(card, api.userInfo)){
         ownerPerms = true;
      }
      const { cardElement } = new Card(card.name, card.link, card.likes.length, ownerPerms);
      this.cards.push(cardElement);
      if (cardLikedBy(card, api.userInfo)){
        cardElement.querySelector('.place-card__like-icon').classList.add('place-card__like-icon_liked');
      }
      this.render();
    }
  
    render(){
      for (let i = 0; i < this.cards.length; i++){
        this.container.appendChild(this.cards[i]);
      }; 
    }
  }