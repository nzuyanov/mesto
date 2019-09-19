export { Api }

class Api {
  constructor({baseUrl, headers}) {
    this.url = baseUrl;
    this.headers = headers;
  }

  getInitialCards() { 
    return fetch(`${this.url}/cards`, {
      headers: {
        authorization: this.headers.authorization
      }
    });
  }

  getUserInfo() {
    return fetch(`${this.url}/users/me`, {
      headers: {
        authorization: this.headers.authorization,
      }
    })
  }

  patchUserInfo(name, about) {
    return fetch(`${this.url}/users/me`, {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify({
        name: name,
        about: about
      })
    });
  }

  postNewCard(name, link) {
    console.log(this);
    return fetch(`${this.url}/cards`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        name: name,
        link: link
      })
    });
  }

  putLike(cardIndex) {
    const cardId = this.cardsArray[cardIndex]._id;
    return fetch(`${this.url}/cards/like/${cardId}`, {
      method: 'PUT',
      headers: {
        authorization: this.headers.authorization
      }
    });
  }

  deleteLike(cardIndex) {
    const cardId = this.cardsArray[cardIndex]._id;
    return fetch(`${this.url}/cards/like/${cardId}`, {
      method: 'DELETE',
      headers: {
        authorization: this.headers.authorization
      }
    });
  }

  deleteCard(cardIndex) {
    const cardId = this.cardsArray[cardIndex]._id;
    return fetch(`${this.url}/cards/${cardId}`, {
      method: 'DELETE',
      headers: {
        authorization: this.headers.authorization
      }
    });
  }

  patchUserAvatar(link) {
    return fetch(`${this.url}/users/me/avatar`, {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify({
        avatar: link,
      })
    });
  }
}