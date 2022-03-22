import View from './View.js';
class NavView extends View {
  _homeBtn = document.querySelector('.nav-home');
  _budgetBtn = document.querySelector('.nav-budget');
  _statBtn = document.querySelector('.nav-stat');
  _settingBtn = document.querySelector('.nav-setting');

  navSettingHandler(handler) {
    this._settingBtn.addEventListener(
      'click',
      function (e) {
        const setting = e.target.closest('.nav-setting');
        if (!setting) return;
        handler();
      }.bind(this)
    );
  }
}

export default new NavView();
