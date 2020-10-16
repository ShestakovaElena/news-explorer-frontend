export default class MainApi {
  constructor(option) {
    this.option = option;
  }

//регистрация нового пользователя;
  signup(name, email, password) {
    return fetch(`${this.option.baseUrl}/signup`, {
      method: "POST",
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "name": name,
        "email": email,
        "password": password,
      }),
    }).then(res => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(new Error(`Не удалось получить данные. Ошибка:${res.status}`))
    })
    .catch((err) => {
      return Promise.reject(new Error(`${err.message}`))
    });
  }

//вход пользователя
  signin(email, password) {
    return fetch(`${this.option.baseUrl}/signin`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
    .then(res => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(new Error(`Не удалось получить данные. Ошибка:${res.status}`))
    })
    .catch((err) => {
      return Promise.reject(`${err}`)
    });
  }

//получение информации о пользователе
  getUserData(token) {
    return fetch(`${this.option.baseUrl}/users/me`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    .then(res => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(new Error(`Не удалось получить данные. Ошибка:${res.status}`))
    })
    .catch((err) => {
      return Promise.reject(new Error(`Ошибка:${err.message}`))
    });
  }

//получение статей
  getArticles(token){
    return fetch(`${this.option.baseUrl}/articles`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    .then(res => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(new Error(`Не удалось получить данные. Ошибка:${res.status}`))
    })
    .catch((err) => {
      return Promise.reject(err)
    });
  }

//создание статьи
  createArticle(data, token){
    return fetch(`${this.option.baseUrl}/articles`, {
      method: "POST",
      credentials: "include",
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(res => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(new Error(`Не удалось получить данные. Ошибка:${res.status}`))
    })
    .catch((err) => {
      return Promise.reject(new Error(`Ошибка:${err.message}`))
    });
  }

//удаление статьи
  removeArticle(cardId, token){
    return fetch(`${this.option.baseUrl}/articles/${cardId}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
      }
    })
    .then(res => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(new Error(`Не удалось получить данные. Ошибка:${res.status}`))
    })
    .catch((err) => {
      return Promise.reject(new Error(`Ошибка:${err.message}`))
    });
  }
}

