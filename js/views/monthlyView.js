import View from './View.js';
import { months, formatAmt } from '../helper.js';

class MonthlyView extends View {
  _headerParentEl = document.querySelector('.summary-title');
  _parentEl = document.querySelector('.summary-status');
  // _progressEl = document.querySelector('.summary-progress');
  _monthlyExp;
  _generateProgressMarkup() {
    return `
      <p class="summary-budget">
        Budget <span class="summary-budget-amt">$1,500.00</span>
      </p>
      <div class="summary-budget-progress">
        <span class="summary-expense-progress" style="width: ${
          (this._monthlyExp / 1500) * 100
        }%"></span>
      </div>
      <div class="progress-detail">
        <div class="progress-detail-expense">
          <p class="detail-expense">Expense</p>
          <p class="detail-expense detail-expense-amt">$ ${formatAmt(
            this._monthlyExp
          )}</p>
        </div>
        <div class="progress-detail-left">
          <p class="detail-left">Left</p>
          <p class="detail-left detail-left-amt">$${formatAmt(
            1500 - this._monthlyExp
          )}</p>
        </div>
    `;
  }
  // renderProgress() {
  //   const markup = this._generateProgressMarkup();
  //   this._progressEl.innerHTML = '';
  //   this._progressEl.insertAdjacentHTML('afterbegin', markup);
  // }
  _generateHeaderMarkup() {
    return `<span class="summary-title-month">${
      months[this._data.date.curDate[1]]
    }</span> Summary`;
  }

  _generateMarkup() {
    const monthlyIncMovements = [];
    const monthlyExpMovements = [];
    this._data.date.curMonthDates.forEach((date) => {
      if (this._data.movements.hasOwnProperty(date)) {
        monthlyIncMovements.push(this._data.movements[date].dailyInc);
        monthlyExpMovements.push(this._data.movements[date].dailyExp);
      }
    });

    const monthlyInc = monthlyIncMovements.reduce((a, b) => a + b, 0);
    const monthlyExp = monthlyExpMovements.reduce((a, b) => a + b, 0);
    this._monthlyExp = monthlyExp;
    const markup = `
      <li class="summary-status-income">Total Income</li>
      <li class="summary-status-income summary-amt summary-amt-income">
        $ ${formatAmt(monthlyInc)}
      </li>
      <li class="summary-status-expense">Total Expense</li>
      <li class="summary-status-expense summary-amt summary-amt-expense">
        -$ ${formatAmt(monthlyExp)}
      </li>
      <li class="summary-status-net">Net Amount</li>
      <li class="summary-status-net summary-amt summary-amt-net">
        $ ${formatAmt(monthlyInc - monthlyExp)}
      </li>
    `;
    return markup;
  }
}
export default new MonthlyView();
