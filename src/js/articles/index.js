import '../../css/articles.css';

import NewsApi from '../api/NewsApi';
import MainApi from '../api/MainApi'
import NewsCardList from '../components/NewsCardList';
import NewsCard from '../components/NewsCard'
import NEWS_API_PARAMETERS from '../constants/NEWS_API_PARAMETERS'
import MAIN_API_PARAMETERS from "../constants/MAIN_API_PARAMETERS";
import Header from '../components/Header';
import renderKeywords from '../utils/keywords'
import ERRORS from "../constants/ERRORS";

const articlesSection = document.querySelector('.articles');
const articlesList = document.querySelector('.articles__container');
const mainHeader = document.querySelector('header');
const preloader = document.querySelector('.preloader');
const noResults = document.querySelector('.no-results');
const articlesCount = document.querySelector('.section-title');
const articlesKeywords = document.querySelector('.saved__accent');

const showMoreBtn = document.querySelector('.button_type_articles');
const mobileMenuCheckbox = document.querySelector('.mobile-menu__checkbox');

const newsApi = new NewsApi(NEWS_API_PARAMETERS)
const mainApi = new MainApi(MAIN_API_PARAMETERS)
const header = new Header(mainHeader, mainApi);
const newsCard = () => new NewsCard();
const newsCardList = new NewsCardList(articlesList, newsApi, newsCard, showMoreBtn, preloader, noResults);

//отрисовка страницы
function renderPage(){
  if(localStorage.getItem('name')) {
    header.render(true, localStorage.name)
    mobileMenuCheckbox.checked = false;
    renderSavedCards(localStorage.token)

  } else {
    localStorage.clear();
    window.location.href = '/';
  }
}

//получение карточек с сервера
function renderSavedCards(token) {
  articlesCount.style.display = 'block';
  mainApi.getArticles(token)
    .then(res => {
      articlesCount.textContent = `${localStorage.name}, у вас ${res.length} сохраненных статей`;
      newsCardList.renderSavedArticles(res);
      articlesKeywords.textContent = renderKeywords(res);
    })
  .catch (err => {
    if (err.message === 'Не удалось получить данные. Ошибка:404') {
      articlesCount.textContent = ERRORS.SERVER_ERROR_404;
      articlesCount.nextElementSibling.style.display = 'none';
    }
    console.log(err)
  })
}

//удаление карточки
const deleteArticle = (event) => {
  if (event.target.closest('.saved')) {
    const card = event.target.closest('.article');
    const cardId = card.getAttribute('id');
    const confirm = window.confirm('Вы уверены, что хотите удалить статью?')
    if (confirm === true) {
      mainApi.removeArticle(cardId, localStorage.token)
        .then((res) => {
          articlesList.removeChild(card);
          renderSavedCards(localStorage.token)
          })

        .catch((err) => {
          console.log(`Ошибка: ${err.message}`);
        });
    }
  }
};

articlesList.addEventListener('click', deleteArticle);

renderPage();

