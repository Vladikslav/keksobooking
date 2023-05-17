import { formAdvert } from './form.js';
import { showAlert } from './util.js';
import { getData } from './api.js';
const formAdvertAdress = formAdvert.querySelector('#address');
const mapContainer = document.querySelector('#map-canvas');
const mapFilters = document.querySelector('.map__filters');
const advertTemplate = document.querySelector('#card').content.querySelector('.popup');
const typesEngToRus = {
  flat: 'Квартира',
  bungalow: 'Бунгало',
  house: 'Дом',
  palace: 'Дворец',
  hotel: 'Отель'
};
const createDescript = (element, description) => {
  const descriptionElement = element.querySelector('.popup__description');
  if (description && description.length) {
    descriptionElement.textContent = description;
  }
  else {
    descriptionElement.remove();
  }
};
const createGallery = (elements, photos, title) => {
  const photoList = elements.querySelector('.popup__photos');
  if (photos && photos.length) {
    photoList.innerHTML = '';
    photos.forEach((element) => {
      const advert = document.createElement('img');
      advert.classList.add('popup__photo');
      advert.setAttribute('src', element);
      advert.setAttribute('alt', title);
      advert.style.width = '45px';
      advert.style.height = '40px';
      photoList.append(advert);
    });
  }
  else {
    photoList.remove();
  }
};
const setDisabledForm = (value) => {
  value.classList.add('ad-form--disabled');
  for (const iterator of value.children) {
    iterator.setAttribute('disabled', true);
  }
};
const removeDisabledForm = (value) => {
  value.classList.remove('ad-form--disabled');
  for (const iterator of value.children) {
    iterator.removeAttribute('disabled');
  }
};
setDisabledForm(mapFilters);
setDisabledForm(formAdvert);
const map = L.map(mapContainer).on('load', () => {
  getData((advert) => {
    removeDisabledForm(mapFilters);
    renderAdvert(advert.slice().sort(() => Math.random() - 0.5).slice(0, 10));
  },
  () => {
    showAlert();
  }
  );
  removeDisabledForm(formAdvert);
})
  .setView({
    lat: 35.68328,
    lng: 139.7727,
  }, 13);
L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
).addTo(map);
const mainPinIcon = L.icon({
  iconUrl: './img/main-pin.svg',
  iconSize: [52, 52],
  iconAnchor: [26, 52],
});
const setValueAddress = ({ lat, lng }) => {
  formAdvertAdress.value = `${lat.toFixed(5)} ${lng.toFixed(5)}`;
  return formAdvertAdress.value;
};

const mainPinMarker = L.marker(
  {
    lat: 35.68328,
    lng: 139.7727,
  },
  {
    icon: mainPinIcon,
    draggable: true,
  }
);
mainPinMarker.addTo(map);
mainPinMarker.on('moveend', (evt) => {
  setValueAddress(evt.target.getLatLng());
});
const icon = L.icon({
  iconUrl: './img/pin.svg',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});
const createCustomPoint = ({ author, offer }) => {
  const advertELement = advertTemplate.cloneNode(true);
  advertELement.querySelector('.popup__avatar').src = author.avatar;
  advertELement.querySelector('.popup__title').textContent = offer.tittle;
  advertELement.querySelector('.popup__text--address').textContent = offer.address;
  advertELement.querySelector('.popup__text--price > [data-price]').textContent = `${offer.price}`;
  advertELement.querySelector('.popup__type').textContent = typesEngToRus[offer.type];
  advertELement.querySelector('.popup__text--capacity').textContent = `${offer.rooms} комнаты для ${offer.guests} гостей`;
  advertELement.querySelector('.popup__text--time').textContent = `Заезд после ${offer.checkin} выезд до ${offer.checkout}`;
  advertELement.querySelector('.popup__features').textContent = offer.features;
  createDescript(advertELement, offer.description);
  createGallery(advertELement, offer.photos, offer.tittle);
  return advertELement;
};
function renderAdvert(similarAdvert) {
  similarAdvert.forEach((item) => {
    const { lat, lng } = item.location;
    const marker = L.marker(
      {
        lat,
        lng,
      },
      {
        icon,
      },
    );
    marker
      .addTo(map)
      .bindPopup(createCustomPoint(item));
  });
}
const addressValue = setValueAddress(map.getCenter());
export { addressValue };
