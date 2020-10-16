import '../css/style.css';

import Popup from './components/Popup';
import Form from './components/Form';
import NewsApi from './api/NewsApi';
import MainApi from './api/MainApi'
import NewsCardList from './components/NewsCardList';
import NewsCard from './components/NewsCard'
import NEWS_API_PARAMETERS from './constants/NEWS_API_PARAMETERS'
import MAIN_API_PARAMETERS from "./constants/MAIN_API_PARAMETERS";
import Header from './components/Header'
import ERRORS from "./constants/ERRORS";

const articlesSection = document.querySelector('.articles');
const articlesList = document.querySelector('.articles__container');
const mainHeader = document.querySelector('header');
const preloader = document.querySelector('.preloader');
const noResults = document.querySelector('.no-results');
const searchError = document.querySelector('.search-error');

const popupSignIn = document.querySelector('.popup_signin');
const popupRegister = document.querySelector('.popup_register');
const popupSigned = document.querySelector('.popup_signed');

const buttonSignIn = document.querySelector('.button-login');
const buttonSuccess = document.querySelector('.popup__link_new-user');
const buttonRegister = document.querySelector('.popup_btn_register');
const buttonEnter = document.querySelector('.popup_btn_signin')

const mobileMenuCheckbox = document.querySelector('.mobile-menu__checkbox');
const mobileMenuBtn = document.querySelector('.button_mobile-menu-login');

const newsApi = new NewsApi(NEWS_API_PARAMETERS)
const mainApi = new MainApi(MAIN_API_PARAMETERS)

const signInPopup = new Popup(popupSignIn);
const registerPopup = new Popup(popupRegister);
const signedPopup = new Popup(popupSigned);

const formSignin = document.forms.signin;
const formSignup = document.forms.signup;
const formSearch = document.forms.search;

const validatorFormSignin = new Form(formSignin, ERRORS);
const validatorFormSearch = new Form(formSearch, ERRORS);
const validatorFormSignup = new Form(formSignup, ERRORS);

const newsCard = () => new NewsCard();
const newsCardList = new NewsCardList(articlesList, newsApi, newsCard, preloader, noResults);
const header = new Header(mainHeader, mainApi, signInPopup);

//проверка логина при загрузке
function logIn(){
  if(localStorage.getItem('token')) {
    mainApi.getUserData(localStorage.token)
    .then((data) => {
      localStorage.setItem('name', data.name)
      header.render(true, data.name);
      mobileMenuCheckbox.checked = false;
    })
    .catch((err) => {
      console.log(err)
    })
  }
};
logIn();

//аутентификация пользователя
formSignin.addEventListener('submit', (event) => {
  event.preventDefault();
  const userName = formSignin.elements.email;
  const userPassword = formSignin.elements.password;
  mainApi.signin(userName.value, userPassword.value)
  .then((res) => {
    localStorage.setItem('token', res.token);

    //получение данных о пользователе
    mainApi.getUserData(res.token)
    .then((data) => {
      localStorage.setItem('name', data.name)
      header.render(true, data.name);
      signInPopup.close();

      //меняем иконки, если пользователь авторизовался
      const cards = document.querySelectorAll('.article');
      const searchText = document.querySelector('.search__input');
      if (cards.length > 0) {
        cards.forEach((card) => {
          const tooltip = card.querySelector('.article__tooltip');
          const bookmark = card.querySelector('.article__bookmark');
          bookmark.classList.add('article__bookmark-image_active');
          bookmark.classList.add('not-saved');
          bookmark.classList.remove('not-login');
          tooltip.textContent = searchText.value;
        })
      }
    })
    .catch((err) => {
      console.log(err)
    })
  })
  .catch((err) => {
    if (err === 'Error: Не удалось получить данные. Ошибка:401') {
      const popupError = formSignin.querySelector('.popup__error_server');
      popupError.textContent = ERRORS.SERVER_ERROR_401;
    }
      console.log(err)
  })
});


//регистрация пользователя
formSignup.addEventListener('submit', (event) => {
  event.preventDefault();
  const userName = formSignup.elements.name;
  const userPassword = formSignup.elements.password;
  const userEmail = formSignup.elements.email;
  mainApi.signup(userName.value, userEmail.value, userPassword.value)
  .then((res) => {
    registerPopup.close();
    signedPopup.open();
  })
  .catch((err) => {
    const popupError = formSignup.querySelector('.popup__error_server');
    if (err.message === 'Не удалось получить данные. Ошибка:409') {
      popupError.textContent = ERRORS.SERVER_ERROR_409;
    } else if (err.message === 'Не удалось получить данные. Ошибка:400') {
      popupError.textContent = ERRORS.SERVER_ERROR_400;
    }
    else {
      console.log(err)
    }
  })
})

//слушатели на формы
validatorFormSignup.setEventListeners();
validatorFormSearch.setEventListeners();
validatorFormSignin.setEventListeners();



// слушатели на кнопки для открытия попапов
buttonSuccess.addEventListener('click', () => {
  signInPopup.open();
  signedPopup.close();
});

buttonEnter.addEventListener('click', () => {
  registerPopup.close();
  signInPopup.open();
});

mobileMenuBtn.addEventListener('click', () => {
  signInPopup.open();
  mobileMenuCheckbox.checked = false;
});

buttonSignIn.addEventListener('click', signInPopup.open);

buttonRegister.addEventListener('click', () => {
  signInPopup.close();
  registerPopup.open();
});



//поиск статей
formSearch.addEventListener('submit', (event) => {
  event.preventDefault();
  const searchText = document.querySelector('.search__input');
  articlesSection.classList.add('articles_active');
  newsCardList.renderResults(searchText.value);
})

//сохранение карточки
const saveArticle = (event) => {
  if (event.target.closest('.not-saved')) {
    const icon = event.target.closest('.not-saved');
    const card = event.target.closest('.article');
    icon.classList.add('article__bookmark-image_saved');
    icon.classList.remove('article__bookmark-image_active');
    const article = {};
    article.keyword = card.querySelector('.article__tooltip').textContent;
    article.title = card.querySelector('.article__title').textContent,
    article.text = card.querySelector('.article__text').textContent,
    article.date = card.querySelector('.article__date').textContent,
    article.source = card.querySelector('.article__source').textContent,
    article.link = card.querySelector('.article__link').href,
    article.image = card.querySelector('.article__photo').src,

    mainApi.createArticle(article, localStorage.token)
      .then((res) => {
        card.setAttribute('id', res.data._id);
        article.articleID = res.data._id;
        icon.classList.remove('not-saved');
        icon.classList.add('saved');
      })
      .catch((err) => {
        console.log(`Ошибка: ${err.message}`);
      });
  }
};
articlesList.addEventListener('click', saveArticle);

//удаление карточки
const deleteArticle = (event) => {
  if (event.target.closest('.saved')) {
    const icon = event.target.closest('.saved');
    const card = event.target.closest('.article');
    icon.classList.remove('article__bookmark-image_saved');
    icon.classList.add('article__bookmark-image_active');
    const articleId = card.getAttribute('id');

    mainApi.removeArticle(articleId, localStorage.token)
      .then((res) => {
        icon.classList.add('not-saved');
        icon.classList.remove('saved');
      })
      .catch((err) => {
        console.log(`Ошибка: ${err.message}`);
      });
  }
};
articlesList.addEventListener('click', deleteArticle);
