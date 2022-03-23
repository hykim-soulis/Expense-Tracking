import { formatDate } from './helper.js';

class Transaction {
  date = new Date();
  id = (Date.now() + '').slice(-10);
  constructor(date, type, amount, category, categoryIcon, memo) {
    this.date = date;
    this.type = type;
    this.amount = amount;
    this.category = category;
    this.categoryIcon = categoryIcon;
    this.memo = memo;
  }
}

export const state = {
  date: {
    current: new Date(),
    curDate: [],
    curMonthDates: [],
    lastDays: { prevMonthlastDate: '', curMonthlastDate: '' },
    selectDate: [],
    select: '',
  },
  movements: {
    // '3/20/2022': {
    //   dailyInc: 2500,
    //   dailyExp: 265.41,
    //   movs: [
    //     new Income('3/20/2022', 2500, 'salary', '💸', 'sample salary'),
    //     new Expense('3/20/2022', 190.14, 'grocery', '🌽', 'sample grocery'),
    //     new Expense('3/20/2022', 75.27, 'meal', '🍜', 'sample meal'),
    //   ],
    // },
    // '3/22/2022': {
    //   dailyInc: 310,
    //   dailyExp: 460.45,
    //   movs: [
    //     new Income('3/22/2022', 310, 'interest', '💰', 'sample interest'),
    //     new Expense('3/22/2022', 360.4, 'clothing', '👖', 'sample clothing'),
    //     new Expense('3/22/2022', 100.05, 'medical', '💊', 'sample medical'),
    //   ],
    // },
  },
  curIndex: '',
};

const createDefaultSelect = function () {
  state.date.selectDate = [
    state.date.current.getFullYear(),
    state.date.current.getMonth(),
    state.date.current.getDate(),
  ];
  state.date.select = formatDate(new Date(...state.date.selectDate));
};

const updatedailySum = function (data, select) {
  data.type === 'income'
    ? (state.movements[select].dailyInc += data.amount)
    : (state.movements[select].dailyExp += data.amount);
};

export const createCurDate = function () {
  state.date.curDate = [
    state.date.current.getFullYear(),
    state.date.current.getMonth(),
    state.date.current.getDate(),
  ];
  state.date.lastDays.prevMonthlastDate = new Date(
    state.date.curDate[0],
    state.date.curDate[1],
    0
  );
  state.date.lastDays.curMonthlastDate = new Date(
    state.date.curDate[0],
    state.date.curDate[1] + 1,
    0
  );
  state.date.curMonthDates = [];
  for (let i = 1; i <= state.date.lastDays.curMonthlastDate.getDate(); i++) {
    state.date.curMonthDates.push(
      formatDate(new Date(state.date.curDate[0], state.date.curDate[1], i))
    );
  }
};

export const updateCalendarMonth = function (data) {
  state.date.current.setMonth(state.date.curDate[1] + data);
};

export const selectCalendarDate = function (data) {
  const newSelect = data.split('/');
  state.date.selectDate[0] = Number(newSelect[2]);
  state.date.selectDate[1] = Number(newSelect[0]) - 1;
  state.date.selectDate[2] = Number(newSelect[1]);
  state.date.select = formatDate(new Date(...state.date.selectDate));
};

export const createMovement = function (data) {
  const mov = [
    data.type,
    data.mov.amount,
    data.mov.category,
    data.mov.categoryIcon,
    data.mov.memo,
  ];
  const select = state.date.select;
  const movement = new Transaction(select, ...mov);
  if (!state.movements.hasOwnProperty(select)) {
    state.movements[select] = { dailyInc: 0, dailyExp: 0, movs: [] };
    state.movements[select].movs = [movement];
    updatedailySum(movement, select);
  } else {
    state.movements[select].movs.push(movement);
    updatedailySum(movement, select);
  }
};

export const loadItem = function (id) {
  const selectArr = state.movements[state.date.select].movs;
  const item = selectArr.filter((el) => el.id === id);
  state.curIndex = selectArr.map((el) => el.id === id).indexOf(true);
  return item;
};

export const deleteItem = function () {
  const select = state.date.select;
  state.movements[select].movs[state.curIndex].type === 'income'
    ? (state.movements[select].dailyInc -=
        state.movements[select].movs[state.curIndex].amount)
    : (state.movements[select].dailyExp -=
        state.movements[select].movs[state.curIndex].amount);
  state.movements[select].movs.splice(state.curIndex, 1);
};
export const saveItem = function (obj) {
  const select = state.date.select;
  state.movements[select].movs[state.curIndex] = obj;
  state.movements[select].dailyInc = state.movements[select].dailyExp = 0;
  state.movements[select].movs.forEach((el) => updatedailySum(el, select));
};

const init = function () {
  createDefaultSelect();
};

init();
