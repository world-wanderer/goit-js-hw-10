import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

('use strict');

import { fetchCountries } from './fetchCountries';

const countryNameInput = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const onSearchCountry = evt => {
  evt.preventDefault();
  const nameCountry = evt.target.value.trim();
  if (!nameCountry) {
    countryList.innerHTML = ``;
    countryInfo.innerHTML = ``;
    return;
  }

  fetchCountries(nameCountry)
    .then(response => {
      countryList.innerHTML = ``;
      countryInfo.innerHTML = ``;

      if (response.length === 1) {
        countryList.insertAdjacentHTML(
          'beforeend',
          renderCountriesFlagAndName(response)
        );
        countryInfo.insertAdjacentHTML(
          'beforeend',
          renderCountryAllInfo(response)
        );
      } else if (response.length > 10) {
        errorManyContries();
      } else {
        countryList.insertAdjacentHTML(
          'beforeend',
          renderCountriesFlagAndName(response)
        );
      }
    })
    .catch(error => {
      countryList.innerHTML = '';
      countryInfo.innerHTML = '';
      console.log(error);
      wrongName();
    });
};

countryNameInput.addEventListener(
  'input',
  debounce(onSearchCountry, DEBOUNCE_DELAY)
);

function renderCountriesFlagAndName(response) {
  const markup = response
    .map(({ name, flags }) => {
      return `
          <li class="country-flag-name">
          <img src="${flags.svg}" alt="Flag of ${name.official}">
            <h1 class="name-official"> ${name.official}</h1>
          </li>
                `;
    })
    .join('');
  return markup;
}

function renderCountryAllInfo(response) {
  const render = response
    .map(({ capital, population, languages }) => {
      return `
          <p class="name"> <span class="span-name">Capital: </span>${capital}</p>
          <p class="name"> <span class="span-name">Population: </span>${population}</p>
          <p class="name"> <span class="span-name">Languages: </span>${Object.values(
            languages
          )}</p>
      `;
    })
    .join('');
  return render;
}

function errorManyContries() {
  Notiflix.Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
}

function wrongName() {
  Notiflix.Notify.failure(
    `Oops, there is no country with that name "${countryNameInput.value}".`
  );
  return;
}
