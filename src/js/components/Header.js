export default class Header {
  constructor(header, api) {
    this.header = header;
    this.mainApi = api;
    this.buttonLogIn = this.header.querySelector('.button-login');
    this.buttonLogOut = this.header.querySelector('.button-logout');
    this.buttonMobileLogIn = this.header.querySelector('.button_mobile-menu-login');
    this.buttonMobileLogOut = this.header.querySelector('.button_mobile-menu-logout');
    this.savedArticlesLink = this.header.querySelector('.menu__link_articles');
    this.savedArticlesLinkMobile = this.header.querySelector('.mobile-menu__link_articles');

    this.render = this.render.bind(this)
    this.logout = this.logout.bind(this)
    this.login = this.login.bind(this)
  }

 //отрисовка хэдера
  render(isLoggedIn, userName) {
    if (isLoggedIn) {
      this._showAuthorizedMenu(userName)
    } else {
      this._showNoAuthorizedMenu()
    }
  }

  logout() {
    localStorage.clear();
    this.render(false);
    window.location.reload();
  }

  login(){
    this.mainApi.getUserData(localStorage.token)
    .then((data) => {
      localStorage.setItem('name', data.name)
      this.render(true, data.name);
    })
  .catch ((err) => {
    console.log(err)
    })
  }

  //меню авторизованного пользователя
  _showAuthorizedMenu(userName) {
    //обычное
    this.buttonLogOut.addEventListener('click', this.logout)
    this.buttonLogIn.removeEventListener('click', this.login)
    this.buttonLogIn.style.display = 'none';
    this.buttonLogOut.style.display = 'block';
    this.buttonLogOut.classList.add('button_logout-img')
    this.buttonLogOut.textContent = userName;
    this.savedArticlesLink.style.display = 'inline';
    //мобильное
    this.buttonMobileLogOut.addEventListener('click', this.logout)
    this.buttonMobileLogIn.removeEventListener('click', this.login)
    this.buttonMobileLogIn.style.display = 'none';
    this.buttonMobileLogOut.style.display = 'block';
    this.buttonMobileLogOut.classList.add('button_logout-img');
    this.buttonMobileLogOut.textContent = userName;
    this.savedArticlesLinkMobile.style.display = 'inline';
  }

  //меню неавторизованного пользователя
  _showNoAuthorizedMenu() {
    this.buttonLogOut.addEventListener('click', this.login);
    this.buttonLogIn.removeEventListener('click', this.logout);
    this.buttonLogIn.style.display = 'block';
    this.buttonLogOut.style.display = 'none';
    this.savedArticlesLink.style.display = 'none';

    this.buttonLogIn.addEventListener('click', this.login)
    this.buttonLogOut.removeEventListener('click', this.logout)
    this.buttonMobileLogOut.style.display = 'none';
    this.buttonMobileLogIn.style.display = 'block';
    this.savedArticlesLinkMobile.style.display = 'none';
  }

}