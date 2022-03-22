import View from './View.js';
import { incCategories, expCategories } from '../config.js';

class SettingView extends View {
  _containerEl = document.querySelector('.setting');
  _overlay = document.querySelector('.overlay');
  _parentEl = '';
  _headerParentEl = '';
  _closeBtn = document.querySelector('.setting-close-btn');
  _settingSaveBtn = document.querySelector('.category-save-btn');
  _changeStatus = document.querySelector('.change-status');

  _addForms = document.querySelectorAll('.add-category');

  _addCategoryBtns = document.querySelectorAll('.fa-circle-plus');

  _addIncBtn = document.querySelector('.add-inc-cat');
  _addExpBtn = document.querySelector('.add-exp-cat');
  _addIncForm = document.querySelector('.add-category-inc');
  _addExpForm = document.querySelector('.add-category-exp');

  _incCategory = document.querySelector('.drag-container-inc');
  _expCategory = document.querySelector('.drag-container-exp');

  openSetting() {
    this._containerEl.classList.remove('hidden');
    this._overlay.classList.remove('hidden');
  }
  closeSetting() {
    this._containerEl.classList.add('hidden');
    this._overlay.classList.add('hidden');
  }

  _generateMarkup(type) {
    if (type === 'income') {
      return incCategories
        .map((cat) => this._generageIncCatMarkup(cat))
        .join('');
    } else {
      return expCategories
        .map((cat) => this._generageExpCatMarkup(cat))
        .join('');
    }
  }

  renderCategories() {
    this._incCategory.innerHTML = this._expCategory.innerHTML = '';
    const markupInc = this._generateMarkup('income');
    const markupExp = this._generateMarkup('expense');
    this._incCategory.insertAdjacentHTML('afterbegin', markupInc);
    this._expCategory.insertAdjacentHTML('afterbegin', markupExp);
  }
  _generageIncCatMarkup(cat) {
    return `
      <li class="draggable draggable-inc" data-type="income">
        <div class="cat-names">
          <i class="fa-solid fa-trash-can"></i>
          <span class="cat-category-icon-inc">${cat.icon}</span>
          <span class="cat-category-name-inc">${cat.name}</span>
        </div>
        <i class="fa-solid fa-grip-lines" draggable="true"></i>
      </li>
    `;
  }

  _generageExpCatMarkup(cat) {
    return `
      <li class="draggable draggable-exp" data-type="expense">
        <div class="cat-names">
          <i class="fa-solid fa-trash-can"></i>
          <span class="cat-category-icon-exp">${cat.icon}</span>
          <span class="cat-category-name-exp">${cat.name}</span>
        </div>
        <i class="fa-solid fa-grip-lines" draggable="true"></i>
      </li>
    `;
  }

  draggablesIncSetting() {
    document.querySelectorAll('.draggable-inc').forEach((draggableInc) => {
      draggableInc.addEventListener('dragstart', () => {
        draggableInc.classList.add('dragging-inc');
      });
      draggableInc.addEventListener('dragend', () => {
        draggableInc.classList.remove('dragging-inc');
      });
    });
  }
  draggablesExpSetting() {
    document.querySelectorAll('.draggable-exp').forEach((draggableExp) => {
      draggableExp.addEventListener('dragstart', () => {
        draggableExp.classList.add('dragging-exp');
      });
      draggableExp.addEventListener('dragend', () => {
        draggableExp.classList.remove('dragging-exp');
      });
    });
  }

  _getDragAfterElement(container, y, type) {
    const draggableElements = [
      ...container.querySelectorAll(
        `.draggable-${type}:not(.dragging-${type})`
      ),
    ];
    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  }

  dragHandler(handler) {
    this._incCategory.addEventListener(
      'dragover',
      function (e) {
        e.preventDefault();
        const afterElement = this._getDragAfterElement(
          this._incCategory,
          e.clientY,
          'inc'
        );
        const draggableInc = document.querySelector('.dragging-inc');
        if (afterElement === null) {
          this._incCategory.appendChild(draggableInc);
        } else {
          this._incCategory.insertBefore(draggableInc, afterElement);
        }
      }.bind(this)
    );

    this._expCategory.addEventListener(
      'dragover',
      function (e) {
        e.preventDefault();
        const afterElement = this._getDragAfterElement(
          this._expCategory,
          e.clientY,
          'exp'
        );
        const draggableExp = document.querySelector('.dragging-exp');
        if (afterElement === null) {
          this._expCategory.appendChild(draggableExp);
        } else {
          this._expCategory.insertBefore(draggableExp, afterElement);
        }
      }.bind(this)
    );

    this._addCategoryBtns.forEach((btn) =>
      btn.addEventListener(
        'click',
        function (e) {
          if (e.target.classList.contains('add-inc-cat')) {
            btn.classList.add('add-clicked');
            this._addIncForm.classList.remove('hidden');
          } else {
            btn.classList.add('add-clicked');
            this._addExpForm.classList.remove('hidden');
          }
        }.bind(this)
      )
    );

    this._addForms.forEach((form) => {
      form.addEventListener(
        'click',
        function (e) {
          const form = e.target.closest('form');
          const type = form.dataset.type;
          const container =
            type === 'income' ? this._incCategory : this._expCategory;
          const addBtnOpacity =
            type === 'income' ? this._addIncBtn : this._addExpBtn;
          const inputs = form.querySelectorAll('input');
          const saveBtn = e.target.closest('.add-category-save-btn');
          const cancelBtn = e.target.closest('.add-category-cancel-btn');
          if (!saveBtn && !cancelBtn) return;
          if (saveBtn) {
            const item = [];
            inputs.forEach((input) =>
              input.value
                ? item.push(input.value.trim())
                : console.log('no input')
            );
            if (item.length === 2) {
              // prettier-ignore
              let newItem = `
                <li class="draggable draggable-${type.slice(0, 3)}" data-type="${type}">
                  <div class="cat-names">
                    <i class="fa-solid fa-trash-can"></i>
                    <span class="cat-category-icon-${type.slice(0, 3)}">${item[0]}</span>
                    <span class="cat-category-name-${type.slice(0, 3)}">${item[1]}</span>
                  </div>
                  <i class="fa-solid fa-grip-lines" draggable="true"></i>
                </li>
              `;
              container.insertAdjacentHTML('beforeend', newItem);
              inputs.forEach((input) => (input.value = ''));
              addBtnOpacity.classList.remove('add-clicked');
              form.classList.add('hidden');
              this.draggablesIncSetting();
              this.draggablesExpSetting();
            }
          }
          if (cancelBtn) {
            inputs.forEach((input) => (input.value = ''));
            addBtnOpacity.classList.remove('add-clicked');
            form.classList.add('hidden');
          }
        }.bind(this)
      );
    });

    this._settingSaveBtn.addEventListener(
      'click',
      function (e) {
        e.preventDefault();
      }.bind(this)
    );
  }

  settingHandler(handler) {
    this._closeBtn.addEventListener('click', function (e) {
      const closeBtn = e.target.closest('.setting-close-btn');
      if (!closeBtn) return;
      handler();
    });
  }
}
export default new SettingView();
