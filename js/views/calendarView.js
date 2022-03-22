import View from './View.js';
import { formatDate, formatAmt, months } from '../helper.js';

class CalendarView extends View {
  _container = document.querySelector('.calendar-container');
  _parentEl = document.querySelector('.calendar-dates');
  _headerParentEl = document.querySelector('.calendar-month');

  _generateHeaderMarkup() {
    return `${months[this._data.date.curDate[1]]}, ${
      this._data.date.curDate[0]
    }`;
  }

  _generateMarkup() {
    let markup = '';
    const prevMonthLast = this._data.date.lastDays.prevMonthlastDate;
    const curMonthLast = this._data.date.lastDays.curMonthlastDate;
    if (prevMonthLast.getDay() < 6) {
      for (let x = prevMonthLast.getDay(); x >= 0; x--) {
        // prettier-ignore
        markup += `<li class="dates prev-dates">${prevMonthLast.getDate() - x}</li>`;
      }
    }
    for (let i = 1; i <= curMonthLast.getDate(); i++) {
      let date = new Date(
        this._data.date.curDate[0],
        this._data.date.curDate[1],
        i
      );
      if (formatDate(date) === formatDate(new Date())) {
        // prettier-ignore
        markup += `
          <li class="dates cur-dates today" data-date="${formatDate(date)}">${i}
            <div class="detail-in-calendar" data-date="${formatDate(date)}"></div>
          </li>
        `;
      } else {
        // prettier-ignore
        markup += `
          <li class="dates cur-dates" data-date="${formatDate(date)}">${i}
            <div class="detail-in-calendar" data-date="${formatDate(date)}"></div
          </li>
        `;
      }
    }
    for (let y = 1; y < 7 - curMonthLast.getDay(); y++) {
      markup += `<li class="dates next-dates">${y}</li>`;
    }
    return markup;
  }

  renderSelected(select) {
    document.querySelectorAll('.cur-dates').forEach((date) => {
      date.classList.remove('selected');
      if (select === date.dataset.date) date.classList.add('selected');
    });
  }
  _generateDailyDetail(date) {
    let markup = ``;
    if (!this._data.movements[date]) return markup;
    if (this._data.movements[date].dailyInc > 0)
      markup += `<div class="calendar-detail-income">${formatAmt(
        this._data.movements[date].dailyInc
      )}</div>`;
    if (this._data.movements[date].dailyExp > 0)
      markup += `<div class="calendar-detail-expense">${formatAmt(
        this._data.movements[date].dailyExp
      )}</div>`;
    return markup;
  }

  renderDailyDetail() {
    document.querySelectorAll('.detail-in-calendar').forEach((date) => {
      const markup = this._generateDailyDetail(date.dataset.date);
      date.innerHTML = '';
      date.insertAdjacentHTML('beforeend', markup);
    });
  }

  updateDailyDetail(date) {
    const selected = document
      .querySelector('.selected')
      .querySelector('.detail-in-calendar');
    const markup = this._generateDailyDetail(date);
    selected.innerHTML = '';
    selected.insertAdjacentHTML('beforeend', markup);
  }

  calendarClickHandler(handler) {
    this._container.addEventListener('click', function (e) {
      e.preventDefault();
      const leftArrow = e.target.closest('.fa-angle-left');
      const rightArrow = e.target.closest('.fa-angle-right');
      const clickedPrev = e.target.closest('.prev-dates');
      const clickedNext = e.target.closest('.next-dates');
      const selected = e.target.closest('.cur-dates');
      if (
        !leftArrow &&
        !rightArrow &&
        !clickedPrev &&
        !clickedNext &&
        !selected
      )
        return;
      if (leftArrow || clickedPrev) {
        handler(-1);
      } else if (rightArrow || clickedNext) {
        handler(+1);
      } else if (selected) {
        handler(selected.dataset.date);
      }
    });
  }

  loadCanlenderHandler(handler) {
    window.addEventListener('load', function (e) {
      e.preventDefault();
      handler();
    });
  }
}
export default new CalendarView();
