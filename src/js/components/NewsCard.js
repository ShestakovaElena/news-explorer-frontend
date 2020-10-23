
export default class NewsCard {
  constructor() {
    this.myCard = document.createElement("div");

    // показать/убрать тэг
    this.myCard.addEventListener('mouseover', (event) => this.showTag(event))
    this.myCard.addEventListener('mouseout', (event) => this.hideTag(event))
  }

  create(image, date, link, heading, text, source, keyword, id) {
    this.myCard.classList.add("article");
    this.myCard.setAttribute('id', id)

    this.myCard.insertAdjacentHTML(
    "beforeend",
      `<a href="${link}" class="article__link" target="_blank">
        <img src="${image}" alt="article picture" class="article__photo">
          <div class="article__content">
            <p class="article__date">${date}</p>
            <h4 class="article__title">${heading}</h4>
            <p class="article__text">${text.slice(0, 250)}...</p>
            <p class="article__source">${source}</p>
          </div>
        </a>
      `
    )
    this._renderIcon(keyword);
    return this.myCard;
  }

  _renderIcon(keyword) {
    if (!localStorage.name) {
      const iconLogOut = `<button class="button article__tooltip">Войдите, чтобы сохранять статьи</button>
      <button class="button article__bookmark article__bookmark-image not-login"></button>`;
      this.myCard.insertAdjacentHTML("beforeend", iconLogOut)
    } else if (localStorage.getItem('token') !== null && document.URL.includes('index.html')) {
      const iconLogedIn = `<button class="button article__tooltip ">${keyword}</button>
      <button class="button article__bookmark article__bookmark-image_active not-saved"></button>`;
      this.myCard.insertAdjacentHTML("beforeend", iconLogedIn)
    } else if (localStorage.getItem('token') !== null && document.URL.includes('articles.html')) {
      const iconDelete = `<div class="article__tag"><p class="article__tag-text">${keyword}</p></div>
      <button class="button article__tooltip article__tooltip_disabled">Убрать из сохранённых</button>
      <button class="button article__bookmark article__trash-image saved"></button>`;
      this.myCard.insertAdjacentHTML("beforeend", iconDelete)
    }

  }

  //показать тэг
  showTag(event){
    if (event.target.closest('.saved') || event.target.closest('.not-login')) {
      const card = event.target.closest('.article');
      const tooltip = card.querySelector('.article__tooltip')
      tooltip.style.display = 'block';
    }
  }
  //спрятать тэг
  hideTag(event) {
    if (event.target.closest('.saved') || event.target.closest('.not-login')) {
      const card = event.target.closest('.article');
      const tooltip = card.querySelector('.article__tooltip')
      tooltip.style.display = 'none';
    }
  }

}


