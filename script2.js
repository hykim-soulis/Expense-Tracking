'use strict';

let expCategories = [
  { icon: '🌽', name: 'Grocery' },
  { icon: '☕', name: 'Coffee' },
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
  { icon: '🟠', name: 'Others' },
];

let incCategories = [
  { icon: '💸', name: 'Salary' },
  { icon: '🪙', name: 'Asset Withdraw' },
  { icon: '💰', name: 'Interest' },
  { icon: '💵', name: 'Allowance' },
  { icon: '📥', name: 'Carry-over' },
  { icon: '🟢', name: 'Others' },
];

const formatCur = function (value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};

const formatAmt = function (value) {
  return new Intl.NumberFormat('en-US', {
    useGrouping: true,
    minimumFractionDigits: 2,
  }).format(value);
};

const formatDate = function (date) {
  return new Intl.DateTimeFormat('en-US').format(date);
};

class Finance {
  date = new Date();
  id = (Date.now() + '').slice(-10);
  constructor(date, amount, category, categoryIcon, memo) {
    this.date = date;
    this.amount = amount;
    this.category = category;
    this.categoryIcon = categoryIcon;
    this.memo = memo;
  }
}

class Expense extends Finance {
  type = 'expense';
  constructor(date, amount, category, categoryIcon, memo) {
    super(date, amount, category, categoryIcon, memo);
  }
}

class Income extends Finance {
  type = 'income';
  constructor(date, amount, category, categoryIcon, memo) {
    super(date, amount, category, categoryIcon, memo);
  }
}

const deleteAll = document.querySelector('#deleteAll');
const calendarMonth = document.querySelector('.calendar-month');
const calendarDatesContainer = document.querySelector('.calendar-dates');
const calendarDates = document.querySelectorAll('.dates');
const calendarPrevArrow = document.querySelector('.fa-angle-left');
const calendarNextArrow = document.querySelector('.fa-angle-right');
const summaryMonth = document.querySelector('.summary-title-month');
const summaryGraphExp = document.querySelector('.detail-expense-amt');
const summaryIncTotal = document.querySelector('.summary-amt-income');
const summaryExpTotal = document.querySelector('.summary-amt-expense');
const summaryNetTotal = document.querySelector('.summary-amt-net');
const dailyBody = document.querySelector('.daily-body-container');
const dailyDate = document.querySelector('.daily-date');
const popupDate = document.querySelector('.date');
const resetBtn = document.querySelector('.reset-btn');
const popupTypeBtns = document.querySelector('.select-type');
const inputCategories = document.querySelectorAll('.input-category');
const inputCategoryIncome = document.querySelector('.input-category-income');
const inputCategoryExpense = document.querySelector('.input-category-expense');
const inputCategoryAdd = document.querySelectorAll('.add');
const inputAmt = document.querySelector('.input-amt-value');
const inputMemo = document.querySelector('.input-memo');
const inputSaveBtn = document.querySelector('.input-save-btn');
const dailyBodyContainer = document.querySelector('.daily-body-container');
const dailySummaryInc = document.querySelector('.daily-summary-inc-amt');
const dailySummaryExp = document.querySelector('.daily-summary-exp-amt');

let type;
let category;
let categoryIcon;
let dailyMoves;
let movements = new Map();
let movementsObject;
// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

let current = new Date();
let curYear;
let curMonth;
let curDate;

let selectYear = current.getFullYear();
let selectMonth = current.getMonth();
let selectDate = current.getDate();
let select;

const setLocalStorage = function () {
  localStorage.setItem('movements', JSON.stringify(movementsObject));
};

const getLocalStorage = function () {
  const data = JSON.parse(localStorage.getItem('movements'));
  if (!data) return;
  Object.keys(data).forEach((key) => {
    movements.set(key, data[key]);
  });
  renderCalendar();
};

const movePrevMonth = function () {
  current.setMonth(current.getMonth() - 1);
  renderCalendar();
};
const moveNextMonth = function () {
  current.setMonth(current.getMonth() + 1);
  renderCalendar();
};

const calSelect = function () {
  select = formatDate(new Date(selectYear, selectMonth, selectDate));
  document.querySelectorAll('.dates').forEach((date) => {
    date.classList.remove('selected');
    if (date.dataset.date === select) date.classList.add('selected');
  });
  popupDate.textContent = dailyDate.textContent = select;
};

const dailySuminCal = function () {
  let monthlyIncArr = [];
  let monthlyExpArr = [];
  document.querySelectorAll('.detail-in-calendar').forEach((date) => {
    let el = movements.get(date.dataset.date);
    if (!el) return;
    let elInc = el.filter((e) => e.type === 'income').map((e) => e.amount);
    let elExp = el.filter((e) => e.type === 'expense').map((e) => e.amount);
    let inCal = '';
    if (elInc.length > 0) {
      inCal += `<div class="calendar-detail-income">${formatCur(
        elInc.reduce((a, b) => a + b)
      )}</div>`;
      monthlyIncArr.push(...elInc);
    }
    if (elExp.length > 0) {
      inCal += `<div class="calendar-detail-expense">${formatCur(
        elExp.reduce((a, b) => a + b)
      )}</div>`;
      monthlyExpArr.push(...elExp);
    }
    date.innerHTML = inCal;
  });
  let monthlyIncSum =
    monthlyIncArr.length > 0 ? monthlyIncArr.reduce((a, b) => a + b) : 0;
  let monthlyExpSum =
    monthlyExpArr.length > 0 ? monthlyExpArr.reduce((a, b) => a + b) : 0;
  summaryIncTotal.textContent = formatCur(monthlyIncSum);
  summaryExpTotal.textContent = summaryGraphExp.textContent =
    formatCur(monthlyExpSum);
  summaryNetTotal.textContent = formatCur(monthlyIncSum - monthlyExpSum);
};

const displayDailyMovements = function () {
  dailyMoves = movements.get(select);

  if (!dailyMoves) {
    dailyBodyContainer.innerHTML = '';
    dailySummaryInc.textContent = dailySummaryExp.textContent = formatCur(0);
    return;
  }

  // Update daily table
  let row = '';
  for (const mov of dailyMoves) {
    let categoryName =
      mov.category[0].toUpperCase() + mov.category.replace('-', ' ').slice(1);
    // prettier-ignore
    row += `<tr class="daily-tbody" id="${mov.id}">
              <td class="daily-m-category">
                <span class="daily-m-category-icon" data="${mov.category}">${mov.categoryIcon}</span>${categoryName}</td>
              <td class="daily-m-amt daily-m-${mov.type === 'income' ? 'inc' : 'exp'}">${formatCur(mov.amount)}</td>
            </tr>`;
  }
  dailyBodyContainer.innerHTML = row;

  // Update daily summary totals

  const dailyIncomeTotal =
    dailyMovFilter(dailyMoves, 'income').length === 0
      ? 0
      : dailyMovFilter(dailyMoves, 'income').reduce((a, b) => a + b);

  const dailyExpenseTotal =
    dailyMovFilter(dailyMoves, 'expense').length === 0
      ? 0
      : dailyMovFilter(dailyMoves, 'expense').reduce((a, b) => a + b);

  dailySummaryInc.textContent = formatCur(dailyIncomeTotal);
  dailySummaryExp.textContent = formatCur(dailyExpenseTotal);
};

const dailyMovFilter = function (arr, t) {
  return arr.filter((mov) => mov.type === t).map((mov) => mov.amount);
};

const renderCalendar = function () {
  curYear = current.getFullYear();
  curMonth = current.getMonth();
  curDate = current.getDate();
  const prevMonthlastDate = new Date(curYear, curMonth, 0);
  const curMonthlastDate = new Date(curYear, curMonth + 1, 0);
  let cal = '';
  if (prevMonthlastDate.getDay() < 6) {
    for (let x = prevMonthlastDate.getDay(); x >= 0; x--) {
      // prettier-ignore
      cal += `<li class="dates prev-dates">${prevMonthlastDate.getDate() - x}</li>`;
    }
  }
  for (let i = 1; i <= curMonthlastDate.getDate(); i++) {
    let date = new Date(curYear, curMonth, i);
    if (formatDate(date) === formatDate(new Date())) {
      // prettier-ignore
      cal += `<li class="dates today" data-date="${formatDate(date)}">${i}<div class="detail-in-calendar" data-date="${formatDate(date)}"></div></li>`;
    } else {
      // prettier-ignore
      cal += `<li class="dates" data-date="${formatDate(date)}">${i}<div class="detail-in-calendar" data-date="${formatDate(date)}"></div</li>`;
    }
  }
  for (let y = 1; y < 7 - curMonthlastDate.getDay(); y++) {
    cal += `<li class="dates next-dates">${y}</li>`;
  }
  calendarDatesContainer.innerHTML = cal;
  calendarMonth.textContent = `${months[curMonth]}, ${curYear}`;
  summaryMonth.textContent = months[curMonth];
  calSelect();
  dailySuminCal();
  displayDailyMovements();
};

const calendarClicked = function (e) {
  const previous = e.target.closest('.prev-dates');
  const next = e.target.closest('.next-dates');
  if (previous) movePrevMonth();
  if (next) moveNextMonth();
  if (!previous && !next) {
    const clicked = e.target.closest('.dates');
    [selectMonth, selectDate, selectYear] = clicked.dataset.date.split('/');
    selectMonth--;

    calSelect();
    displayDailyMovements();
  }
};

getLocalStorage();
renderCalendar();

const reset = function () {
  localStorage.removeItem('movements');
  movements = new Map();
  renderCalendar();
  console.log('delete all');
};

const categoryList = function (array, type) {
  let list = '';
  let typeShort = type.slice(0, 3);
  for (const item of array) {
    let cat = item.name.split(' ').join('-').toLowerCase();
    list += `<li class="category-item category-${typeShort}">
    <div
      class="category-item-icon category-${typeShort}-icon"
      id="category-${typeShort}-${cat}"
      data-category="${cat}"
    >
      ${item.icon}
    </div>
    <div class="category-item-name category-${typeShort}-name">${item.name}</div>
  </li>`;
  }
  return list;
};

let checkTypefromCat;

const selectType = function (e) {
  const clicked = e.target.closest('.select-type-btn');
  if (!clicked) return;
  popupTypeBtns.classList.remove('caution');
  inputCategories.forEach((el) => el.classList.remove('caution'));

  for (const btn of popupTypeBtns.children) {
    btn.classList.add('type-not-selected');
  }
  clicked.classList.remove('type-not-selected');
  type = clicked.dataset.type;
  if (type === 'income') {
    inputCategoryIncome.innerHTML = categoryList(incCategories, type);
    inputCategoryIncome.classList.remove('hidden');
    inputCategoryExpense.classList.add('hidden');
  }
  if (type === 'expense') {
    inputCategoryExpense.innerHTML = categoryList(expCategories, type);
    inputCategoryExpense.classList.remove('hidden');
    inputCategoryIncome.classList.add('hidden');
  }
};

const selectCategory = function (e) {
  const clicked = e.target.closest('.category-item-icon');
  if (!clicked) return;
  document.querySelectorAll('.category-item-icon').forEach((item) => {
    item.classList.remove(`category-${type.slice(0, 3)}-icon-selected`);
  });
  checkTypefromCat = e.target.closest('.input-category').dataset.type;
  inputCategories.forEach((el) => el.classList.remove('caution'));
  clicked.classList.add(`category-${type.slice(0, 3)}-icon-selected`);
  category = clicked.dataset.category;
  categoryIcon = clicked.textContent.trim();
};

const addCategory = function () {
  if (type === 'income') {
    incCategories.push(`{icon: ${'icon!'}, name ${'name'}},`);
  } else if (type === 'expense') {
    expCategories.push(`{icon: ${'icon!'}, name ${'name'}},`);
  }
};
const clearPopup = function () {
  inputAmt.value = inputMemo.value = '';

  inputCategories.forEach((cat) => cat.classList.add('hidden'));
  for (const btn of popupTypeBtns.children) {
    btn.classList.remove('type-not-selected');
  }
};

const saveMovement = function () {
  let date = select;
  let amount = Number(inputAmt.value.replace(',', ''));
  let memo = inputMemo.value.trim();

  if (!type) popupTypeBtns.classList.add('caution');
  if (!category || type !== checkTypefromCat)
    inputCategories.forEach((el) => el.classList.add('caution'));
  if (amount === NaN || amount <= 0) inputAmt.classList.add('caution');

  if (type && category && type === checkTypefromCat && amount > 0) {
    inputAmt.classList.remove('caution');
    let mov =
      type === 'income'
        ? new Income(date, amount, category, categoryIcon, memo)
        : new Expense(date, amount, category, categoryIcon, memo);
    if (!movements.has(select)) {
      movements.set(select, [mov]);
    } else {
      movements.get(select).push(mov);
    }
    clearPopup();
    dailySuminCal();
    displayDailyMovements();
    type = category = checkTypefromCat = undefined;
  }
  movementsObject = Object.fromEntries(movements);
  setLocalStorage();
};

const checkInputAmt = function () {
  if (Number(inputAmt.value.replace(',', '')) > 0) {
    inputAmt.value = formatAmt(Number(inputAmt.value.replace(',', '')));
    inputAmt.classList.remove('caution');
  } else {
    inputAmt.classList.add('caution');
  }
};
const checkItemAmt = function () {
  if (Number(itemAmt.value.replace(',', '')) > 0) {
    itemAmt.value = formatAmt(Number(itemAmt.value.replace(',', '')));
    itemAmt.classList.remove('caution');
  } else {
    itemAmt.classList.add('caution');
  }
};

const itemContainer = document.querySelector('.item-container');
const itemDate = document.querySelector('.item-date');
const itemCategoryContainer = document.querySelector(
  '.item-category-container'
);
const itemCategoryIcon = document.querySelector('.item-category-icon');
const itemCategory = document.querySelector('.item-category');
const itemType = document.querySelector('.item-type');
const popupContainer = document.querySelector('.popupContainer');
const itemSaveBtn = document.querySelector('.item-save-btn');
const itemAmt = document.querySelector('.item-amt');
const itemMemo = document.querySelector('.item-memo');
const itemDeleteBtn = document.querySelector('.item-delete');

let id;
let targetArr;
let targetIndex;
let targetItem;
let itemDateSelect;

const showItem = function (e) {
  popupContainer.style.display = 'none';
  itemContainer.style.display = 'flex';
  id = e.target.closest('.daily-tbody').id;
  targetArr = movements.get(select);
  targetIndex = targetArr.map((el) => el.id).indexOf(id);
  targetItem = targetArr[targetIndex];
  let targetType = targetItem.type;
  itemDateSelect = select;

  itemDate.textContent = targetItem.date;
  itemCategoryIcon.textContent = targetItem.categoryIcon;
  itemCategoryIcon.dataset.cat = targetArr.category;
  itemCategory.textContent =
    targetItem.category[0].toUpperCase() +
    targetItem.category.replace('-', ' ').slice(1);
  itemType.textContent = targetType[0].toUpperCase() + targetType.slice(1);
  itemAmt.value = formatAmt(targetItem.amount);
  itemMemo.value = targetItem.memo;

  if (targetType === 'income') {
    itemCategoryContainer.classList.remove('item-category-expense');
    itemCategoryContainer.classList.add('item-category-income');
    itemCategoryIcon.classList.remove('item-category-icon-exp');
    itemCategoryIcon.classList.add('item-category-icon-inc');
    itemType.classList.remove('item-expense');
    itemType.classList.add('item-income');
    itemType.dataset.type = targetType;
  }
  if (targetType === 'expense') {
    itemCategoryContainer.classList.add('item-category-expense');
    itemCategoryContainer.classList.remove('item-category-income');
    itemCategoryIcon.classList.add('item-category-icon-exp');
    itemCategoryIcon.classList.remove('item-category-icon-inc');
    itemType.classList.add('item-expense');
    itemType.classList.remove('item-income');
    itemType.dataset.type = targetType;
  }
};

const saveItemChange = function () {
  popupContainer.style.display = 'flex';
  movements.get(itemDateSelect)[targetIndex].amount = Number(
    itemAmt.value.replace(',', '')
  );
  movements.get(itemDateSelect)[targetIndex].memo = itemMemo.value;
  movementsObject = Object.fromEntries(movements);
  setLocalStorage();
  dailySuminCal();
  displayDailyMovements();
  itemContainer.style.display = 'none';
};

const deleteItem = function () {
  popupContainer.style.display = 'flex';
  movements.get(itemDateSelect).splice(targetIndex, 1);
  movementsObject = Object.fromEntries(movements);
  setLocalStorage();
  dailySuminCal();
  displayDailyMovements();
  itemContainer.style.display = 'none';
};

calendarPrevArrow.addEventListener('click', movePrevMonth);
calendarNextArrow.addEventListener('click', moveNextMonth);
calendarDatesContainer.addEventListener('click', calendarClicked);
resetBtn.addEventListener('click', clearPopup);
popupTypeBtns.addEventListener('click', selectType);
inputCategories.forEach((cat) => cat.addEventListener('click', selectCategory));
inputCategoryAdd.forEach((add) => add.addEventListener('click', addCategory));
inputSaveBtn.addEventListener('click', saveMovement);
deleteAll.addEventListener('click', reset);
inputAmt.addEventListener('focusout', checkInputAmt);
itemAmt.addEventListener('focusout', checkItemAmt);
dailyBody.addEventListener('click', showItem);
itemSaveBtn.addEventListener('click', saveItemChange);
itemDeleteBtn.addEventListener('click', deleteItem);

// Setting Script
const settingNav = document.querySelector('.nav-setting');
const settingContainer = document.querySelector('#setting');
const catSettingSaveBtn = document.querySelector('.category-save-btn');
const dragContainer = document.querySelectorAll('.drag-container');
const dragIncContainer = document.querySelector('.drag-container-inc');
const dragExpContainer = document.querySelector('.drag-container-exp');
const overlay = document.querySelector('#overlay');
const settingCloseBtn = document.querySelector('.setting-close-btn');
const addBtns = document.querySelectorAll('.fa-circle-plus');
const addIncCat = document.querySelector('.add-inc-cat');
const addExpCat = document.querySelector('.add-exp-cat');
const addForms = document.querySelectorAll('.add-category');
const addIncForm = document.querySelector('.add-category-inc');
const addExpForm = document.querySelector('.add-category-exp');
const addIncSaveBtn = document.querySelector('.add-inc-cat-save-btn');
const addExpSaveBtn = document.querySelector('.add-exp-cat-save-btn');
const addIncCancelBtn = document.querySelector('.add-inc-cat-cancel-btn');
const addExpCancelBtn = document.querySelector('.add-exp-cat-cancel-btn');
const addIncNewIcon = document.querySelector('#new-inc-icon');
const addIncNewName = document.querySelector('#new-inc-name');
const addExpNewIcon = document.querySelector('#new-exp-icon');
const addExpNewName = document.querySelector('#new-exp-name');

let draggablesInc = document.querySelectorAll('.draggable-inc');
let draggablesExp = document.querySelectorAll('.draggable-exp');

const openSetting = function () {
  settingContainer.style.display = 'block';
  overlay.classList.add('active');
};

const closeSetting = function () {
  settingContainer.style.display = 'none';
  overlay.classList.remove('active');
};

const catSettingDisplay = function () {
  let incList = '';
  incCategories.forEach((cat) => {
    incList += `<li class="draggable draggable-inc" data-type="income">
      <div class="cat-names">
        <span class="cat-category-icon-inc">${cat.icon}</span>
        <span class="cat-category-name-inc">${cat.name}</span>
        <i class="fa-solid fa-trash-can"></i>
      </div>
      <i class="fa-solid fa-grip-lines" draggable="true"></i>
    </li>
    `;
  });
  dragIncContainer.innerHTML = incList;
  let expList = '';
  expCategories.forEach((cat) => {
    expList += `<li class="draggable draggable-exp" data-type="expense">
      <div class="cat-names">
        <span class="cat-category-icon-exp">${cat.icon}</span>
        <span class="cat-category-name-exp">${cat.name}</span>
        <i class="fa-solid fa-trash-can"></i>
      </div>
      <i class="fa-solid fa-grip-lines" draggable="true"></i>
    </li>
    `;
  });
  dragExpContainer.innerHTML = expList;
};

const draggablesIncSetting = function () {
  draggablesInc = document.querySelectorAll('.draggable-inc');
  draggablesInc.forEach((draggableInc) => {
    draggableInc.addEventListener('dragstart', () => {
      draggableInc.classList.add('dragging-inc');
    });
    draggableInc.addEventListener('dragend', () => {
      draggableInc.classList.remove('dragging-inc');
    });
  });
};
const draggablesExpSetting = function () {
  draggablesExp = document.querySelectorAll('.draggable-exp');
  draggablesExp.forEach((draggableExp) => {
    draggableExp.addEventListener('dragstart', () => {
      draggableExp.classList.add('dragging-exp');
    });
    draggableExp.addEventListener('dragend', () => {
      draggableExp.classList.remove('dragging-exp');
    });
  });
};

const saveCatSettingChanges = function () {
  const incIcons = document.querySelectorAll('.cat-category-icon-inc');
  const incNames = document.querySelectorAll('.cat-category-name-inc');
  const expIcons = document.querySelectorAll('.cat-category-icon-exp');
  const expNames = document.querySelectorAll('.cat-category-name-exp');
  incCategories = [];
  expCategories = [];
  for (let i = 0; i < incIcons.length; i++) {
    let obj = { icon: incIcons[i].textContent, name: incNames[i].textContent };
    incCategories.push(obj);
  }
  for (let j = 0; j < expIcons.length; j++) {
    let obj = { icon: expIcons[j].textContent, name: expNames[j].textContent };
    expCategories.push(obj);
  }
};

const addClick = function (e) {
  if (e.target.classList.contains('add-inc-cat')) {
    addIncCat.classList.add('add-clicked');
    addIncForm.classList.remove('add-form-hidden');
  } else {
    addExpCat.classList.add('add-clicked');
    addExpForm.classList.remove('add-form-hidden');
  }
};

const formClick = function (e) {
  const form = e.target.closest('form');
  const type = form.dataset.type;
  const container = type === 'income' ? dragIncContainer : dragExpContainer;
  const addBtnOpacity = type === 'income' ? addIncCat : addExpCat;
  const inputs = form.querySelectorAll('input');
  const saveBtn = e.target.closest('.add-category-save-btn');
  const cancelBtn = e.target.closest('.add-category-cancel-btn');
  if (!saveBtn && !cancelBtn) return;
  if (saveBtn) {
    const item = [];
    inputs.forEach((input) =>
      input.value ? item.push(input.value.trim()) : console.log('no input')
    );
    if (item.length === 2) {
      let newItem = `
      <li class="draggable draggable-${type.slice(0, 3)}" data-type="${type}">
        <div class="cat-names">
          <span class="cat-category-icon-${type.slice(0, 3)}">${item[0]}</span>
          <span class="cat-category-name-${type.slice(0, 3)}">${item[1]}</span>
          <i class="fa-solid fa-trash-can"></i>
        </div>
        <i class="fa-solid fa-grip-lines" draggable="true"></i>
      </li>
    `;
      container.insertAdjacentHTML('beforeend', newItem);
      inputs.forEach((input) => (input.value = ''));
      addBtnOpacity.classList.remove('add-clicked');
      form.classList.add('add-form-hidden');
      draggablesIncSetting();
      draggablesExpSetting();
    }
  }
  if (cancelBtn) {
    inputs.forEach((input) => (input.value = ''));
    addBtnOpacity.classList.remove('add-clicked');
    form.classList.add('add-form-hidden');
  }
};

const getDragAfterElement = function (container, y, type) {
  const draggableElements = [
    ...container.querySelectorAll(`.draggable-${type}:not(.dragging-${type})`),
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
};

const dragIncs = function (e) {
  e.preventDefault();
  const afterElement = getDragAfterElement(dragIncContainer, e.clientY, 'inc');
  const draggableInc = document.querySelector('.dragging-inc');
  if (afterElement === null) {
    dragIncContainer.appendChild(draggableInc);
  } else {
    dragIncContainer.insertBefore(draggableInc, afterElement);
  }
};
const dragExps = function (e) {
  e.preventDefault();
  const afterElement = getDragAfterElement(dragExpContainer, e.clientY, 'exp');
  const draggableExp = document.querySelector('.dragging-exp');
  if (afterElement === null) {
    dragExpContainer.appendChild(draggableExp);
  } else {
    dragExpContainer.insertBefore(draggableExp, afterElement);
  }
};

const catDelete = function (e) {
  const clicked = e.target.closest('.fa-trash-can');
  if (!clicked) return;
  const list = e.target.closest('li');
  const item = [];
  list.querySelectorAll('span').forEach((el) => item.push(el.textContent));
  console.log(item);
  // item.remove();
};

catSettingDisplay();
draggablesIncSetting();
draggablesExpSetting();

settingContainer.style.display = 'block';
settingNav.addEventListener('click', openSetting);
settingCloseBtn.addEventListener('click', closeSetting);
catSettingSaveBtn.addEventListener('click', saveCatSettingChanges);
addBtns.forEach((add) => add.addEventListener('click', addClick));
addForms.forEach((form) => form.addEventListener('click', formClick));
dragContainer.forEach((con) => con.addEventListener('click', catDelete));
dragIncContainer.addEventListener('dragover', dragIncs);
dragExpContainer.addEventListener('dragover', dragExps);

console.log(movements);
