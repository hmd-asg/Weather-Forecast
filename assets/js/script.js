const cityFormEl = document.querySelector('#city-form');
const cityButtonsEl = document.querySelector('#city-buttons');
const cityInputEl = document.querySelector('#city-input');
const cityContainerEl = document.querySelector('#city-container');
const apiKey = 'edeb4ca36bc2cc213a04647b525557a5';

function getCities() {
    return JSON.parse(localStorage.getItem('cities')) || [];
}

const formSubmitHandler = function (event) {
    event.preventDefault();

    const city = cityInputEl.value.trim();

    if (city) {
        getCityWeather(city);
        showHistory(city);
        //storeCity(city);
        cityContainerEl.textContent = '';
        cityInputEl.value = '';
    } else {
        alert('Please enter a City name');
    }
};

const buttonClickHandler = function (event) {
    const cityWeater = event.target.getAttribute('data-city');

    if (cityWeater) {
        getCityWeather(cityWeater);
        cityContainerEl.textContent = '';
    }
};

const showHistory = function (cityInput) {
    const btnHistory = document.createElement('button');
    btnHistory.classList.add('btn', 'btn-primary', 'mb-3');
    btnHistory.textContent = cityInput;
    btnHistory.setAttribute('data-city', cityInput);
    cityButtonsEl.appendChild(btnHistory);
};

const getCityWeather = function (city) {
    // https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    displayCities(data);
                });
            } else {
                alert(`Error:${response.statusText}`);
            }
        })
        .catch(function (error) {
            alert('Unable to connect to openweather');
        });
};

const displayCities = function (cityData) {
    if (cityData.length === 0) {
        cityContainerEl.textContent = 'No weather found.';
        return;
    }
    console.log(cityData);


    const cityEl = document.createElement('div');
    cityEl.classList = 'border border-primary p-4 text-center';
    const now = dayjs();
    const cityName = document.createElement('h1');
    cityName.textContent = `${cityData.name} : ${dayjs(now).format('MM-DD-YYYY hh-mm')}`;

    const weatherIcon = document.createElement('img');
    const iconName = `${cityData.weather[0].icon}`;
    const iconUrl = `https://openweathermap.org/img/wn/${iconName}.png`
    weatherIcon.setAttribute('src', iconUrl);


    const cityTemp = document.createElement('p');
    cityTemp.textContent = `Temp : ${cityData.main.temp}`;

    const cityWind = document.createElement('p');
    cityWind.textContent = `Wind : ${cityData.wind.speed}`;

    const cityhumidity = document.createElement('p');
    cityhumidity.textContent = `Humidity : ${cityData.main.humidity}`;

    cityEl.append(cityName, weatherIcon, cityTemp, cityWind, cityhumidity);
    cityContainerEl.append(cityEl);
};

function storeCity(cityIn) {
    const listCity = getCities();
    listCity.push(cityIn);
    localStorage.setItem('cities', JSON.stringify(listCity));
}

cityFormEl.addEventListener('submit', formSubmitHandler);
cityButtonsEl.addEventListener('click', buttonClickHandler);
