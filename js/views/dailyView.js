import View from './View.js';
import { months, formatAmt } from '../helper.js';
class DailyView extends View {
  _container = document.querySelector('.daily-container');
  _headerParentEl = document.querySelector('.daily-thead');
  _parentEl = document.querySelector('.daily-body-container');

  _generateHeaderMarkup() {
    const check =
      !this._data.movements[this._data.date.select] ||
      this._data.movements[this._data.date.select].movs.length === 0;
    const date = `${months[this._data.date.selectDate[1]].slice(0, 3)} ${
      this._data.date.selectDate[2]
    }, ${this._data.date.selectDate[0]}
    `;

    return `
      <th class="daily-date">${date}</th>
      <th class="daily-summary">
        <table class="daily-summary-tb">
          <tr class="daily-summary-row daily-summary-inc">
            <td>Total Income</td>
            <td class="daily-summary-inc-amt">$ ${
              !check
                ? formatAmt(
                    this._data.movements[this._data.date.select].dailyInc
                  )
                : '0.00'
            }</td>
          </tr>
          <tr class="daily-summary-row daily-summary-exp">
            <td>Total Expense</td>
            <td class="daily-summary-exp-amt">$ ${
              !check
                ? formatAmt(
                    this._data.movements[this._data.date.select].dailyExp
                  )
                : '0.00'
            }</td>
          </tr>
        </table>
      </th>
    `;
  }

  _generateMovMarkup(m) {
    const categoryName = (
      m.category[0].toUpperCase() + m.category.slice(1)
    ).replace('-', ' ');
    return `
    <tr class="daily-tbody" id="${m.id}">
      <td class="daily-m-category">
        <span class="daily-m-category-icon" data="${m.category}">${
      m.categoryIcon
    }</span
        >${categoryName}
      </td>
      <td class="daily-m-amt daily-m-${m.type.slice(0, 3)}">$ ${formatAmt(
      m.amount
    )}</td>
    </tr>
  `;
  }
  _generateMarkup() {
    if (
      !this._data.movements[this._data.date.select] ||
      this._data.movements[this._data.date.select].movs.length === 0
    )
      return '';
    return this._data.movements[this._data.date.select].movs
      .map((m) => this._generateMovMarkup(m))
      .join('');
  }

  dailyItemHandler(handler) {
    this._parentEl.addEventListener('click', function (e) {
      e.preventDefault();
      const clicked = e.target.closest('.daily-tbody');
      if (!clicked) return;

      const id = clicked.id;
      handler(id);
    });
  }
}
export default new DailyView();
