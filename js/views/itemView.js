import View from './View.js';
import { formatAmt } from '../helper.js';
class ItemView extends View {
  _parentEl = document.querySelector('.item-container');
  _headerParentEl = '';

  openItem() {
    this._parentEl.classList.remove('hidden');
  }
  closeItem() {
    this._parentEl.classList.add('hidden');
  }

  _generateMarkup() {
    const categoryName = (
      this._data.category[0].toUpperCase() + this._data.category.slice(1)
    ).replace('-', ' ');
    const type = this._data.type;

    return `
      <div class="item-popup item-header">
        <div class="item-date">${this._data.date}</div>
        <button class="item-delete">Delete</button>
      </div>

      <div class="item-popup item-category-container item-category-${type}">
        <div
          class="item-category-icon item-category-icon-${type.slice(0, 3)}"
          data-cat="${this._data.category}"
        >
          ${this._data.categoryIcon}
        </div>
        <div class="item-category">${categoryName}</div>
      </div>

      <div class="item-popup item-type-amount">
        <div class="item-type item-${type}" data-type="${type}">
        ${type[0].toUpperCase() + type.slice(1)}
        </div>
        <label for="item-amt" class="item-currency">$</label>
        <input
          type="value"
          class="item-amt"
          id="item-amt"
          name="item-amt"
          required
        />
      </div>

      <textarea
        name=""
        id=""
        class="item-popup item-memo"
        cols="30"
        rows="10"
        maxlength="200"
        placeholder="Memo"
      ></textarea>
      <div class="item-popup item-btns">
        <button class="item-receipt">Receipt</button>
        <button class="item-recurring">Recurring</button>
        <button class="item-save-btn">Save</button>
      </div>
    `;
  }
  displayItemAmtMemo() {
    document.querySelector('.item-amt').value = formatAmt(this._data.amount);
    document.querySelector('.item-memo').value = this._data.memo;
  }

  itemUpdateHandler(handler) {
    this._parentEl.addEventListener(
      'click',
      function (e) {
        e.preventDefault();
        const deleteBtn = e.target.closest('.item-delete');
        const saveBtn = e.target.closest('.item-save-btn');
        if (!deleteBtn && !saveBtn) return;
        if (deleteBtn) {
          handler('delete');
        }
        if (saveBtn) {
          this._data.amount = Number(
            document.querySelector('.item-amt').value.replace(',', '')
          );
          this._data.memo = document.querySelector('.item-memo').value;
          handler(this._data);
        }
      }.bind(this)
    );
  }
}
export default new ItemView();
