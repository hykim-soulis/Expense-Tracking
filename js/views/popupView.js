import View from './View.js';
import { formatAmt, formatDate } from '../helper.js';
import { categories } from '../config.js';

class PopupView extends View {
  _container = document.querySelector('.popupContainer');
  _parentEl = document.querySelector('.popup-date');
  _headerParentEl = '';

  _typeEl = document.querySelector('.select-type');
  _inputAmtEl = document.querySelector('.input-amt-value');
  _categoryEl = document.querySelector('.input-category-container');
  _memoEl = document.querySelector('.input-memo');
  _saveEl = document.querySelector('.input-save-btn');
  _clearBtn = document.querySelector('.clear-btn');

  _movement = {
    type: '',
    mov: {},
    typeFromCat: '',
  };

  _generateMarkup() {
    return `${this._data}`;
  }

  _generateCategoryMarkup(type, cat) {
    const typeShort = type.slice(0, 3);
    const name = cat.name.split(' ').join('-').toLowerCase();
    return `
      <li class="category-item category-${typeShort}">
        <div
          class="category-item-icon category-${typeShort}-icon"
          id="category-${typeShort}-${name}"
          data-category="${name}"
          >
          ${cat.icon}
        </div>
        <div class="category-item-name category-${typeShort}-name">${cat.name}</div>
      </li>
    `;
  }

  _openCategory(type, array) {
    const markup = array
      .map((cat) => this._generateCategoryMarkup(type, cat))
      .join('');
    document.querySelector(`.input-category-${type}`).innerHTML = '';
    document
      .querySelector(`.input-category-${type}`)
      .insertAdjacentHTML('afterbegin', markup);
  }

  _clearPopup() {
    this._inputAmtEl.value = this._memoEl.value = '';
    this._typeEl.classList.remove('caution');
    this._inputAmtEl.classList.remove('caution');

    document.querySelectorAll('.select-type-btn').forEach((btn) => {
      btn.classList.remove('type-not-selected');
    });
    document.querySelectorAll('.input-category').forEach((cat) => {
      cat.classList.add('hidden');
    });
    this._movement = {
      type: '',
      mov: {},
      typeFromCat: '',
    };
  }
  openPopup() {
    this._container.classList.remove('hidden');
  }
  closePopup() {
    this._container.classList.add('hidden');
  }

  popupMovHandler(handler) {
    // 1) Select movement type
    this._typeEl.addEventListener(
      'click',
      function (e) {
        e.preventDefault();
        this._typeEl.classList.remove('caution');
        const type = e.target.closest('.select-type-btn');
        if (!type) return;
        this._movement.type = type.dataset.type;
        document.querySelectorAll('.select-type-btn').forEach((btn) => {
          btn.classList.remove('type-not-selected');
          if (btn.dataset.type !== this._movement.type)
            btn.classList.add('type-not-selected');
        });
        document.querySelectorAll('.input-category').forEach((cat) => {
          cat.classList.add('hidden');
          if (cat.dataset.type === this._movement.type)
            cat.classList.remove('hidden');
        });
        const category =
          this._movement.type === 'income'
            ? categories.incomeCategory
            : categories.expenseCategory;

        this._openCategory(this._movement.type, category);
      }.bind(this)
    );

    // 2) Select movement category
    this._categoryEl.addEventListener(
      'click',
      function (e) {
        e.preventDefault();
        const category = e.target.closest('.category-item');
        if (!category) return;

        this._movement.mov.category = category.querySelector(
          '.category-item-icon'
        ).dataset.category;
        this._movement.mov.categoryIcon = category
          .querySelector('.category-item-icon')
          .textContent.trim();
        this._movement.typeFromCat =
          category.closest('.input-category').dataset.type;
        document
          .querySelectorAll('.input-category')
          .forEach((cat) => cat.classList.remove('caution'));
        document.querySelectorAll('.category-item-icon').forEach((cat) => {
          cat.classList.remove('category-inc-icon-selected');
          cat.classList.remove('category-exp-icon-selected');

          category
            .querySelector('.category-item-icon')
            .classList.add(
              `category-${this._movement.type.slice(0, 3)}-icon-selected`
            );
        });
      }.bind(this)
    );

    // 3) Format input amount
    this._inputAmtEl.addEventListener(
      'focusout',
      function () {
        const decimals = this._inputAmtEl.value.split('.')[1]?.length;
        if (
          Number(this._inputAmtEl.value.replaceAll(',', '')) > 0 &&
          (!decimals || decimals <= 2)
        ) {
          this._inputAmtEl.value = formatAmt(
            Number(this._inputAmtEl.value.replaceAll(',', ''))
          );
          this._inputAmtEl.classList.remove('caution');
        } else {
          this._inputAmtEl.classList.add('caution');
        }
      }.bind(this)
    );

    // 4) Save movement
    this._saveEl.addEventListener(
      'click',
      function (e) {
        e.preventDefault();
        this._movement.mov.amount = Number(
          this._inputAmtEl.value.replaceAll(',', '')
        );
        this._movement.mov.memo = this._memoEl.value;

        if (!this._movement.type) this._typeEl.classList.add('caution');
        if (
          !this._movement.mov.category ||
          this._movement.type !== this._movement.typeFromCat
        )
          document
            .querySelectorAll('.input-category')
            .forEach((cat) => cat.classList.add('caution'));
        if (this._movement.mov.amount <= 0)
          this._inputAmtEl.classList.add('caution');
        if (
          document.querySelectorAll('.caution').length === 0 &&
          this._movement.type &&
          this._movement.mov.category &&
          this._movement.type === this._movement.typeFromCat &&
          this._movement.mov.amount > 0
        ) {
          handler(this._movement);
          this._clearPopup();
        }
      }.bind(this)
    );

    // 5) Reset popup inputs
    this._clearBtn.addEventListener('click', this._clearPopup.bind(this));
  }
}
export default new PopupView();
