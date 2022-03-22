export default class View {
  _data;

  render(data) {
    this._data = data;
    const markup = this._generateMarkup();
    this._parentEl.innerHTML = '';
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  renderHeader() {
    const markup = this._generateHeaderMarkup();
    this._headerParentEl.innerHTML = '';
    this._headerParentEl.insertAdjacentHTML('afterbegin', markup);
  }
}
