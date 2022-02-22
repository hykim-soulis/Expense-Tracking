'use strict';

const expCategories = [
  { icon: '🌽', name: 'Grocery' },
  { icon: '🍜', name: 'Meal' },
  { icon: '💰', name: 'Interest' },
  { icon: '📽️', name: 'Entertainments' },
  { icon: '💡', name: 'Utility bills' },
  { icon: '🛖️', name: 'Rent' },
  { icon: '✈️', name: 'Traveling' },
  { icon: '🛒', name: 'Household supplies' },
  { icon: '🛹', name: 'Exercise' },
  { icon: '📱', name: 'Phone bill' },
  { icon: '🚗', name: 'Vehicle' },
  { icon: '💄', name: 'Beauty' },
  { icon: '🚌', name: 'Transportation' },
  { icon: '💊', name: 'Medical' },
  { icon: '📤', name: 'Carry-over' },
  { icon: '💵', name: 'Savings' },
  { icon: '👖', name: 'Clothing' },
  { icon: '🎓', name: 'Education' },
  { icon: '📚', name: 'Books' },
  { icon: '+', name: 'Add' },
];

const incCategories = [
  { icon: '💸', name: 'Salary' },
  { icon: '🪙', name: 'Asset Withdraw' },
  { icon: '💰', name: 'Interest' },
  { icon: '💵', name: 'Allowance' },
  { icon: '📥', name: 'Carry-over' },
  { icon: '+', name: 'Add' },
];

const formatCur = function (value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};

const formatDate = function (date) {
  return new Intl.DateTimeFormat('en-US').format(date);
};

class Finance {
  constructor(date, amount, category, memo) {
    this.date = date;
    this.amount = amount;
    this.category = category;
    this.memo = memo;
  }
}

class Expense extends Finance {
  type = 'expense';
  constructor(date, amount, category, memo) {
    super(date, amount, category, memo);
  }
}

class Income extends Finance {
  type = 'income';
  constructor(date, amount, category, memo) {
    super(date, amount, category, memo);
  }
}

// Calendar
const calendarMonth = document.querySelector('.calendar-month');
const calendarDatesContainer = document.querySelector('.calendar-dates');
const calendarDates = document.querySelectorAll('.dates');
const calendarPrevArrow = document.querySelector('.fa-angle-left');
const calendarNextArrow = document.querySelector('.fa-angle-right');
const summaryMonth = document.querySelector('.summary-title-month');
const dailyDate = document.querySelector('.daily-date');
const popupDate = document.querySelector('.date');

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const current = new Date();

let selectedYear = current.getFullYear();
let selectedMonth = current.getMonth();
let selectedDate = current.getDate();
let curYear;
let curMonth;
let curDate;

const selectCalDate = function (date) {
  date.classList.remove('selected');
  if (date.dataset.date === `${selectedYear}/${selectedMonth}/${selectedDate}`)
    date.classList.add('selected');
};

const selectDateDisplay = function () {
  popupDate.textContent = dailyDate.textContent = `${
    selectedMonth + 1
  }/${selectedDate}/${selectedYear}`;
};

const checkSelect = function () {
  document.querySelectorAll('.dates').forEach((date) => {
    selectCalDate(date);
  });
};

const renderCalendar = function () {
  curYear = current.getFullYear();
  curMonth = current.getMonth();
  curDate = current.getDate();
  const prevMonthlastDate = new Date(curYear, curMonth, 0);
  const curMonthlastDate = new Date(curYear, curMonth + 1, 0);

  // Add month and year to calendar header
  calendarMonth.textContent = `${months[curMonth]}, ${curYear}`;

  // Add dates to calendar
  let calDates = '';

  if (prevMonthlastDate.getDay() < 6) {
    for (let x = prevMonthlastDate.getDay(); x >= 0; x--) {
      calDates += `<li class="dates prev-dates">${
        prevMonthlastDate.getDate() - x
      }</li>`;
    }
  }

  for (let i = 1; i <= curMonthlastDate.getDate(); i++) {
    if (
      i === new Date().getDate() &&
      current.getMonth() === new Date().getMonth() &&
      current.getFullYear() === new Date().getFullYear()
    ) {
      calDates += `<li class="dates today" data-date="${curYear}/${curMonth}/${i}">${i}</li>`;
    } else {
      calDates += `<li class="dates" data-date="${curYear}/${curMonth}/${i}">${i}</li>`;
    }
  }

  for (let y = 1; y < 7 - curMonthlastDate.getDay(); y++) {
    calDates += `<li class="dates next-dates">${y}</li>`;
  }
  calendarDatesContainer.innerHTML = calDates;
  summaryMonth.textContent = months[current.getMonth()];
  checkSelect();
  selectDateDisplay();
};

// calendar clicked
const calendarClicked = (e) => {
  const previous = e.target.closest('.prev-dates');
  const next = e.target.closest('.next-dates');
  if (!previous && !next) {
    selectedDate = Number(e.target.innerHTML);
    selectedYear = current.getFullYear();
    selectedMonth = current.getMonth();
    checkSelect();
    selectDateDisplay();
  }
  if (previous) goPrevMonth();
  if (next) goNextMonth();
};

// Move to prev or next month
const goPrevMonth = function () {
  current.setMonth(current.getMonth() - 1);
  renderCalendar();
};

const goNextMonth = function () {
  current.setMonth(current.getMonth() + 1);
  renderCalendar();
};

// Event Listeners

calendarPrevArrow.addEventListener('click', goPrevMonth);
calendarNextArrow.addEventListener('click', goNextMonth);
calendarDatesContainer.addEventListener('click', calendarClicked);

renderCalendar();

//popup
// type - not - selected;
const popupIncomeBtn = document.querySelector('.select-income');
const popupExpenseBtn = document.querySelector('.select-expense');
const popupTypeBtns = document.querySelector('.select-type');
const inputCategoryIncome = document.querySelector('.input-category-income');
const inputCategoryExpense = document.querySelector('.input-category-expense');
const inputSaveBtn = document.querySelector('.input-save-btn');
const inputAmt = document.querySelector('.input-amt-value');
const inputMemo = document.querySelector('.input-memo');
const dailyBodyContainer = document.querySelector('.daily-body-container');
const inputCategories = document.querySelectorAll('.input-category');
const dayilySummaryInc = document.querySelector('.daily-summary-inc-amt');
const dayilySummaryExp = document.querySelector('.daily-summary-exp-amt');

let type;
let movement;
let amount;
let memo;
let date;
let category;
let icon;

let categoryExpList = '';

expCategories.forEach((exp) => {
  let catId = exp.name.split(' ').join('-').toLowerCase();
  categoryExpList += `<li class="category-item category-exp">
  <div
  class="category-item-icon category-exp-icon"
  id="category-exp-${catId}"
  data-category="${catId}"
  >${exp.icon}</div>
  <div class="category-item-name category-exp-name">${exp.name}</div>`;
});
inputCategoryExpense.innerHTML = categoryExpList;

let categoryIncList = '';

incCategories.forEach((inc) => {
  let catId = inc.name.split(' ').join('-').toLowerCase();
  categoryIncList += `<li class="category-item category-inc">
  <div
  class="category-item-icon category-inc-icon"
  id="category-inc-${catId}"
  data-category="${catId}"
  >${inc.icon}</div>
  <div class="category-item-name category-inc-name">${inc.name}</div>`;
});
inputCategoryIncome.innerHTML = categoryIncList;

const inputTypeSelect = function (e) {
  const clicked = e.target.closest('.select-type-btn');
  if (!clicked) return;
  for (const btn of popupTypeBtns.children) {
    btn.classList.add('type-not-selected');
  }
  clicked.classList.remove('type-not-selected');
  type = clicked.dataset.type;
  inputCategories.forEach((cat) => cat.classList.add('hidden'));
  document.querySelector(`.input-category-${type}`).classList.remove('hidden');
};

const inputCategorySelectInc = function (e) {
  const clicked = e.target.closest('.category-item-icon');
  if (!clicked) return;

  clearCategory();

  clicked.classList.add('category-inc-icon-selected');
  category = clicked.dataset.category;
  icon = clicked.textContent;
};

const inputCategorySelectExp = function (e) {
  const clicked = e.target.closest('.category-item-icon');
  if (!clicked) return;

  clearCategory();
  clicked.classList.add('category-exp-icon-selected');
  category = clicked.dataset.category;
  icon = clicked.textContent;
};

let movements = [];

const displayDayilyMovements = function () {
  amount = Number(inputAmt.value);
  memo = inputMemo.value;
  date = popupDate.textContent;
  category;
  icon;
  let el = document.createElement('tr');
  el.classList.add('daily-tbody');
  dailyBodyContainer.appendChild(el);

  if (type === 'income') {
    movement = new Income(date, amount, category, memo);
    el.innerHTML = `<td class="daily-m-category">
    <span class="daily-m-category-icon" data-category="${category}">${icon}</span
    >${category[0].toUpperCase() + category.slice(1).split('-').join(' ')}
    </td>
    <td class="daily-m-amt daily-m-inc">${formatCur(amount)}</td>`;
  } else if (type === 'expense') {
    movement = new Expense(date, amount, category, memo);
    el.innerHTML = `<td class="daily-m-category">
    <span class="daily-m-category-icon" data-category="${category}">${icon}</span
    >${category[0].toUpperCase() + category.slice(1).split('-').join(' ')}
    </td>
    <td class="daily-m-amt daily-m-exp">${formatCur(amount)}</td>`;
  }

  movements.push(movement);
  console.log(movements);
  dailySum(movements);
  clearInput();
};

const dailySum = function (arr) {
  const newArr = arr.filter((mov) => mov.date === dailyDate.textContent);
  let dailyExpTotal;
  let dailyIncTotal;
  if (newArr.length === 0) {
    dailyExpTotal = 0;
    dailyIncTotal = 0;
  } else if (newArr.length === 1) {
    dailyExpTotal = newArr
      .filter((mov) => mov.type === 'expense')
      .map((mov) => mov.amount);
    dailyIncTotal = newArr
      .filter((mov) => mov.type === 'income')
      .map((mov) => mov.amount);
  } else {
    dailyExpTotal = newArr
      .filter((mov) => mov.type === 'expense')
      .map((mov) => mov.amount)
      .reduce((acc, cur) => acc + cur);

    dailyIncTotal = newArr
      .filter((mov) => mov.type === 'income')
      .map((mov) => mov.amount)
      .reduce((acc, cur) => acc + cur);
  }
  dayilySummaryInc.textContent = formatCur(dailyIncTotal);
  dayilySummaryExp.textContent = formatCur(dailyExpTotal);
};

const clearInput = function () {
  popupIncomeBtn.classList.remove('type-not-selected');
  popupExpenseBtn.classList.remove('type-not-selected');
  inputAmt.value = inputMemo.value = '';
  inputCategories.forEach((cat) => cat.classList.add('hidden'));
  clearCategory();
};

const clearCategory = function () {
  const incomeIcons = document.querySelectorAll('.category-inc-icon');
  const expenseIcons = document.querySelectorAll('.category-exp-icon');
  expenseIcons.forEach((ic) =>
    ic.classList.remove('category-exp-icon-selected')
  );
  incomeIcons.forEach((ic) =>
    ic.classList.remove('category-inc-icon-selected')
  );
};

popupTypeBtns.addEventListener('click', inputTypeSelect);
inputCategoryIncome.addEventListener('click', inputCategorySelectInc);
inputCategoryExpense.addEventListener('click', inputCategorySelectExp);
inputSaveBtn.addEventListener('click', displayDayilyMovements);
