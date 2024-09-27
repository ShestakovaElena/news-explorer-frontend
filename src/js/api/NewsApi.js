import { dateMax, dateMin } from "../utils/date";

export default class NewsApi {
  constructor(parameters) {
    this.apiKey = parameters.apiKey;
    this.url = parameters.url;
    this.endpoint = parameters.endpoint;
    this.sortBy = parameters.sortBy;
    this.pageSize = parameters.pageSize;
  }

  getNews(keyword) {
    return fetch(
      `${this.url}everything?q=${keyword}&from=${dateMin}&to=${dateMax}&sortBy=${this.sortBy}&pageSize=${this.pageSize}&apiKey=${this.apiKey}`,
      )
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

