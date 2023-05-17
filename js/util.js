const ALERT_SHOW_TIME = 3000;
function getRandomPositiveInteger(a, b) {
  const lower = Math.ceil(Math.min(Math.abs(a), Math.abs(b)));
  const upper = Math.floor(Math.max(Math.abs(a), Math.abs(b)));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
}
function getRandomPositiveFloat(a, b, digits = 1) {
  const lower = Math.min(Math.abs(a), Math.abs(b));
  const upper = Math.max(Math.abs(a), Math.abs(b));
  const result = Math.random() * (upper - lower) + lower;

  return +result.toFixed(digits);
}
const getRandomArrayElement = (elements) => elements[getRandomPositiveInteger(0, elements.length - 1)];
const isEscapeKey = (evt) => evt.key === 'Escape';
const showAlert = () => {
  const modalInnerError = document.createElement('div');
  const modalTitleError = document.createElement('p');
  modalInnerError.classList.add('error');
  modalTitleError.classList.add('error__message');
  modalTitleError.textContent = 'Ошибка загрузки объявление';
  modalInnerError.appendChild(modalTitleError);
  document.querySelector('body').appendChild(modalInnerError);

  setTimeout(() => {
    modalInnerError.remove();
  }, ALERT_SHOW_TIME);
};
export { getRandomPositiveFloat, getRandomPositiveInteger, getRandomArrayElement, showAlert, isEscapeKey };

