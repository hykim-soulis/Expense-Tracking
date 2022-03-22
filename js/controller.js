import * as model from './model.js';
import calendarView from './views/calendarView.js';
import popupView from './views/popupView.js';
import dailyView from './views/dailyView.js';
import monthlyView from './views/monthlyView.js';
import itemView from './views/itemView.js';
import settingView from './views/settingView.js';
import navView from './views/navView.js';

const controlCalendar = function () {
  model.getLocalStorage();
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
  monthlyView.renderProgress();
};

const controlCalendarClick = function (data) {
  if (typeof data === 'number') {
    model.updateCalendarMonth(data);
    controlCalendar();
  } else {
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
  monthlyView.renderProgress();
  model.setLocalStorage();
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
  model.setLocalStorage();
  dailyView.render(model.state);
  dailyView.renderHeader();
  calendarView.updateDailyDetail(model.state.date.select);
  monthlyView.render(model.state);
  monthlyView.renderProgress();
  popupView.openPopup();
  itemView.closeItem();
};

const controlSettingOpen = function () {
  settingView.openSetting();
  settingView.renderCategories();
  settingView.draggablesIncSetting();
  settingView.draggablesExpSetting();
};

const controlDrag = function () {};
const controlSettingClose = function () {
  settingView.closeSetting();
};
const init = function () {
  calendarView.loadCanlenderHandler(controlCalendar);
  calendarView.calendarClickHandler(controlCalendarClick);
  popupView.popupMovHandler(controlPopup);
  dailyView.dailyItemHandler(controlItemClick);
  itemView.itemUpdateHandler(controlItemBtns);
  navView.navSettingHandler(controlSettingOpen);
  settingView.dragHandler(controlDrag);
  settingView.settingHandler(controlSettingClose);
};
init();
