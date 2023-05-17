import { sendData } from './api.js';
import { isEscapeKey } from './util.js';
const MAX_PRICE = 100000;
const FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
const roomsToGuests = {
  1: ['1'],
  2: ['1', '2'],
  3: ['1', '2', '3'],
  100: ['0']
};

const guestsRooms = {
  0: ['100'],
  1: ['1', '2', '3'],
  2: ['2', '3'],
  3: ['3']
};

const typeHouse = {
  'bungalow': 0,
  'flat': 1000,
  'hotel': 3000,
  'house': 5000,
  'palace': 10000
};
const formAdvert = document.querySelector('.ad-form');
const formAdvertTitle = formAdvert.querySelector('#title');
const formAdvertPrice = formAdvert.querySelector('#price');
const formAdvertRoomCount = formAdvert.querySelector('#room_number');
const formAdvertCapacityCount = formAdvert.querySelector('#capacity');
const formAdvertTypeHouse = formAdvert.querySelector('#type');
const formAdvertTimeIn = formAdvert.querySelector('#timein');
const foramAdvertTimeOut = formAdvert.querySelector('#timeout');
const formAdvertSubmit = formAdvert.querySelector('.ad-form__submit');
const formAdvertAvatar = formAdvert.querySelector('#avatar');
const formAdvertPreviewAvatar = formAdvert.querySelector('.ad-form-header__preview > img');
const formAdvertImages = formAdvert.querySelector('#images');
const formAdvertPhoto = formAdvert.querySelector('.ad-form__photo');
const formAdvertReset = formAdvert.querySelector('.ad-form__reset');
const formModalSuccessTemplate = document.querySelector('#success').content.querySelector('.success');
const formModalSuccess = formModalSuccessTemplate.cloneNode(true);
const formModalErrorTemplate = document.querySelector('#error').content.querySelector('.error');
const formModalError = formModalErrorTemplate.cloneNode(true);
let formAdvertPreviewAvatarDefault = '';
const pristine = new Pristine(formAdvert, {
  classTo: 'ad-form__element',
  errorClass: 'ad-form__element--invalid',
  errorTextParent: 'ad-form__element'
}, true);
formAdvertAvatar.addEventListener('change', () => {
  const file = formAdvertAvatar.files[0];
  const fileName = file.name.toLowerCase();
  const matches = FILE_TYPES.some((it) => fileName.endsWith(it));
  if (matches) {
    formAdvertPreviewAvatarDefault = formAdvertPreviewAvatar.src;
    formAdvertPreviewAvatar.src = URL.createObjectURL(file);
  }
});
formAdvertReset.addEventListener('click', () => {
  formAdvertPreviewAvatar.src = formAdvertPreviewAvatarDefault;
  document.querySelector('.ad-form__photo > img').remove();
});
formAdvertImages.addEventListener('change', () => {
  const file = formAdvertImages.files[0];
  const fileName = file.name.toLowerCase();
  const matches = FILE_TYPES.some((it) => fileName.endsWith(it));
  if (matches) {
    const imgPhoto = document.createElement('img');
    imgPhoto.setAttribute('src', URL.createObjectURL(file));
    formAdvertPhoto.appendChild(imgPhoto);
  }
});
const validateCapacity = () => roomsToGuests[formAdvertRoomCount.value].includes(formAdvertCapacityCount.value);
const getCapacityErrorMessage = () => `Указанное кол-во комнат вмещает ${roomsToGuests[formAdvertRoomCount.value].join(' или ')} гостей`;
const getRoomNumberErrorMessage = () => `Для указанного кол-ва гостей требуется ${guestsRooms[formAdvertCapacityCount.value].join(' или ')} комнаты`;
const getHouseErrorMessage = () => `Минимальная цена за ночь ${typeHouse[formAdvertTypeHouse.value]}`;
const validateFormTitle = (value) => value.length >= 30 && value.length <= 100;
const validateFormPrice = (value) => +value <= MAX_PRICE;
const validateHousePrice = () => typeHouse[formAdvertTypeHouse.value] <= formAdvertPrice.value;
pristine.addValidator(formAdvertTitle, validateFormTitle, 'От 30 - до 100 символов');
pristine.addValidator(formAdvertPrice, validateFormPrice, 'Максимальная цена 100 000');
pristine.addValidator(formAdvertRoomCount, validateCapacity, getRoomNumberErrorMessage);
pristine.addValidator(formAdvertCapacityCount, validateCapacity, getCapacityErrorMessage);
pristine.addValidator(formAdvertTypeHouse, validateHousePrice, getHouseErrorMessage);
const onCapacityNumberChange = () => {
  pristine.validate(formAdvertCapacityCount);
  pristine.validate(formAdvertRoomCount);
};
const onRoomNumberChange = () => {
  pristine.validate(formAdvertCapacityCount);
  pristine.validate(formAdvertRoomCount);
};
const onTypeHouseChange = () => {
  pristine.validate(formAdvertTypeHouse);
  formAdvertPrice.setAttribute('placeholder', typeHouse[formAdvertTypeHouse.value]);
};
const onTimeInChange = () => { foramAdvertTimeOut.value = formAdvertTimeIn.value; };
const onTimeOutChange = () => { formAdvertTimeIn.value = foramAdvertTimeOut.value; };
const blockSubmitButton = () => {
  formAdvertSubmit.disabled = true;
  formAdvertSubmit.textContent = 'Публикуется...';
};

const unblockSubmitButton = () => {
  formAdvertSubmit.disabled = false;
  formAdvertSubmit.textContent = 'Опубликовать';
};
const removeModalForm = (evt) => {
  if (isEscapeKey(evt) || evt.target.closest('.formModal')) {
    document.removeEventListener('keydown', removeModalForm);
    document.removeEventListener('click', removeModalForm);
    document.querySelector('.formModal').remove();
  }
};
const createModalForm = (modalWindow) => {
  document.querySelector('body').appendChild(modalWindow);
  modalWindow.classList.add('formModal');
  document.addEventListener('keydown', removeModalForm);
  document.addEventListener('click', removeModalForm);
};
const submitFomAdvert = (successFormAdvert) => {
  pristine.addValidator();
  formAdvert.addEventListener('submit', (evt) => {
    evt.preventDefault();
    if (pristine.validate()) {
      blockSubmitButton();
      sendData(
        () => { successFormAdvert(); unblockSubmitButton(); createModalForm(formModalSuccess); formAdvertPreviewAvatar.src = formAdvertPreviewAvatarDefault; document.querySelector('.ad-form__photo > img').remove(); },
        () => { unblockSubmitButton(); createModalForm(formModalError); },
        new FormData(evt.target)
      );
    }
  });
};
formAdvertRoomCount.addEventListener('change', onCapacityNumberChange);
formAdvertRoomCount.addEventListener('change', onRoomNumberChange);
formAdvertTypeHouse.addEventListener('change', onTypeHouseChange);
formAdvertTimeIn.addEventListener('change', onTimeInChange);
foramAdvertTimeOut.addEventListener('change', onTimeOutChange);
export { formAdvert, submitFomAdvert };
