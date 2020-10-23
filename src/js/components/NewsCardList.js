import { dateFormat } from "../utils/date";

export default class CardList {
  constructor(container, newsApi, func, preloader, noResults) {
    this.container = container;
    this.newsApi = newsApi;
    this.func = func;
    this.button = this.container.nextElementSibling;
    this.preloader = preloader;
    this.noResults = noResults;
    this.start = 0;
    this.newsPerPage = 3;
    this.news = [];
  }

  //рендер статей с newsApi
  renderResults(keyword) {
    this.clearResults();
    this.renderLoader();
    this.newsApi.getNews(keyword)
    .then(res => {
      this.news = res.articles;
      if ( res.articles.length === 0 ) {
        this.nothingToShow();
        this.renderLoader();
      } else {
        this.renderLoader();
        this.addToResults(this.news, keyword);
        this.container.previousElementSibling.style.display = 'block';
        this.button.style.display = 'block';
      }
      this.showMore(this.news, keyword)
    })
    .catch (err => {
      //блок с ошибкой
      this.renderLoader();
      this.noResults.nextElementSibling.style.display = 'flex';
      console.log(err);
    })
  }

  //рендер сохраненных статей с mainApi
  renderSavedArticles(data) {
    const arrayCards = document.querySelectorAll('.article');
    arrayCards.forEach((item) => {
      this.container.removeChild(item);
    });
    const cards = data;
    for (const card of cards) {
      this.addCard(card.image, card.date, card.link, card.title, card.text, card.source, card.keyword, card._id);
    }
    this.container.parentElement.style.display = 'block';


  }

  //добавить 3 статьи в контейнер
  addToResults(news, keyword) {
    const cards = news.slice(this.start, (this.start + this.newsPerPage));
    if (cards.length === 0 ) {
      console.log('nothing to show')
    } else {
      for (const card of cards) {
        this.addCard(card.urlToImage, dateFormat(card.publishedAt), card.url, card.title, card.description, card.source.name, keyword, card.id);
      }
    }
  }

  //создать и добавить карточку в контейнер
  addCard(image, date, link, heading, text, source, keyword, id) {
    this.container.appendChild(this.func().create(image, date, link, heading, text, source, keyword, id));
  }

  //слушатель на кнопку showMore
  showMore(news, keyword){
    this.button.addEventListener('click', () => {
      this.start += 3;
      this.addToResults(news, keyword);
    })
  }

  //если ничего не найдено
  nothingToShow() {
    this.noResults.classList.add('no-results_active');
  }

  //загрузка прелоудера
  renderLoader() {
    this.preloader.classList.toggle('preloader_active')
  }

  //очистить контейнер перед новым поиском
  clearResults() {
    const arrayCards = document.querySelectorAll('.article');
    arrayCards.forEach((item) => {
      this.container.removeChild(item);
    });
    this.noResults.classList.remove('no-results_active');
    this.container.previousElementSibling.style.display = 'none';
    this.container.nextElementSibling.style.display = 'none';
    this.noResults.nextElementSibling.style.display = 'none';
  }

}




