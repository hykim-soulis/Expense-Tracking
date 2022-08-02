import View from './View.js';
class NavView extends View {
  _homeBtn = document.querySelector('.nav-home');
  _budgetBtn = document.querySelector('.nav-budget');
  _statBtn = document.querySelector('.nav-stat');
  _settingBtn = document.querySelector('.nav-setting');
  _nav = document.querySelector('.nav-container');
  navSettingHandler(handler) {
    this._nav.addEventListener(
      'click',
      function (e) {
        const clicked = e.target
          .closest('.nav-items')
          .textContent.trim()
          .toLowerCase();
        if (!clicked) return;
        handler(clicked);
      }.bind(this)
    );
  }
}

export default new NavView();
