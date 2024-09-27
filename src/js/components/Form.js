
export default class Form {
  constructor(form, errors) {
    this.form = form;
    this.errors = errors;
  }

//валидация инпута
  _validateInputElement(input, errorMessage) {
    if (input.validity.valueMissing) {
      errorMessage.classList.add('popup__error_active');
      errorMessage.textContent = this.errors.VALUE_MISSING;
      return;
    }
    if (input.validity.tooShort || input.validity.tooLong) {
      errorMessage.classList.add('popup__error_active');
      errorMessage.textContent = this.errors.TOO_SHORT;
      return;
    }
    if (input.validity.typeMismatch) {
      errorMessage.classList.add('popup__error_active');
      errorMessage.textContent = this.errors.TYPE_MISMATCH;
      return;
    }
    errorMessage.textContent = "";
  }
  //валидация формы
  _validateForm(form, button) {
    if (!form.checkValidity()) {
      button.setAttribute('disabled', true);
      return;
    }
    button.classList.add('popup__button_active');
    button.removeAttribute('disabled', true);
  }

  _clear() {
    this.form.reset();
  }

  //слушатели событий
  setEventListeners() {
    this._clear();
    this.button = this.form.querySelector('button[type="submit"]');
    this.form.addEventListener('input', (event) => {
      this._validateInputElement(event.target, event.target.nextElementSibling);
      this._validateForm(this.form, this.button);
    });
    this._validateForm(this.form, this.button);
  }

}