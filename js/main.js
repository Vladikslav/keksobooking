import { addressValue } from './map.js';
import { formAdvert, submitFomAdvert } from './form.js';
const resetFormAdvert = () => {
  formAdvert.reset();
  formAdvert.querySelector('#address').value = addressValue;
};
submitFomAdvert(resetFormAdvert);
