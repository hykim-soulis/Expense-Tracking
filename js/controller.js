import { setLocalStorage, getLocalStorage } from './helper.js';
import { categories } from './config.js';
import * as model from './model.js';
import calendarView from './views/calendarView.js';
import popupView from './views/popupView.js';
import dailyView from './views/dailyView.js';
import monthlyView from './views/monthlyView.js';
import itemView from './views/itemView.js';
import settingView from './views/settingView.js';
// import budgetView from './views/budgetView.js';
import navView from './views/navView.js';

const controlCalendar = function () {
  if (getLocalStorage('income-categories')) {
    categories.incomeCategory = getLocalStorage('income-categories');
    categories.expenseCategory = getLocalStorage('expense-categories');
  } else {
    setLocalStorage('income-categories', categories.incomeCategory);
    setLocalStorage('expense-categories', categories.expenseCategory);
  }

  if (getLocalStorage('movements')) {
    model.state.movements = getLocalStorage('movements');
  } else {
    setLocalStorage('movements', model.state.movements);
  }

  model.createCurDate();
  calendarView.render(model.state);
  calendarView.renderHeader();
  calendarView.renderSelected(model.state.date.select);
  calendarView.renderDailyDetail();
  popupView.render(model.state.date.select);
  dailyView.render(model.state);
  dailyView.renderHeader();
  monthlyView.render(model.state);
  monthlyView.renderHeader();
  // monthlyView.renderProgress();
};

const controlCalendarClick = function (data) {
  if (typeof data === 'number') {
    model.updateCalendarMonth(data);
    controlCalendar();
  } else {
    categories.incomeCategory = getLocalStorage('income-categories');
    categories.expenseCategory = getLocalStorage('expense-categories');
    model.selectCalendarDate(data);
    calendarView.renderSelected(model.state.date.select);
    popupView.openPopup();
    itemView.closeItem();
    popupView.render(model.state.date.select);
    dailyView.render(model.state);
    dailyView.renderHeader();
  }
};

const controlPopup = function (data) {
  model.createMovement(data);
  dailyView.render(model.state);
  dailyView.renderHeader();
  calendarView.updateDailyDetail(model.state.date.select);
  monthlyView.render(model.state);
  // monthlyView.renderProgress();
  setLocalStorage('movements', model.state.movements);
};

const controlItemClick = function (id) {
  popupView.closePopup();
  itemView.openItem();
  const obj = model.loadItem(id);
  itemView.render(obj[0]);
  itemView.displayItemAmtMemo();
};

const controlItemBtns = function (btn) {
  btn === 'delete' ? model.deleteItem() : model.saveItem(btn);
  setLocalStorage('movements', model.state.movements);
  dailyView.render(model.state);
  dailyView.renderHeader();
  calendarView.updateDailyDetail(model.state.date.select);
  monthlyView.render(model.state);
  // monthlyView.renderProgress();
  popupView.openPopup();
  itemView.closeItem();
};

const controlNavOpen = function (clicked) {
  if (clicked === 'setting') {
    settingView.openSetting();
    settingView.renderCategories();
    settingView.draggablesIncSetting();
    settingView.draggablesExpSetting();
  } else if (clicked === 'budget') {
    budgetView.openBudget();
  }
};

const controlDrag = function (incCategories, expCategories) {
  categories.incomeCategory = incCategories;
  categories.expenseCategory = expCategories;
  setLocalStorage('income-categories', categories.incomeCategory);
  setLocalStorage('expense-categories', categories.expenseCategory);
};
const controlSettingClose = function () {
  settingView.closeSetting();
};
const controlBudgetClose = function () {
  budgetView.closeBudget();
};

const init = function () {
  calendarView.loadCanlenderHandler(controlCalendar);
  calendarView.calendarClickHandler(controlCalendarClick);
  popupView.popupMovHandler(controlPopup);
  dailyView.dailyItemHandler(controlItemClick);
  itemView.itemUpdateHandler(controlItemBtns);
  navView.navSettingHandler(controlNavOpen);
  settingView.dragHandler(controlDrag);
  settingView.settingHandler(controlSettingClose);
  // budgetView.budgetHandler(controlBudgetClose);
};
init();
