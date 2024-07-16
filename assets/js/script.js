const cityFormEl = document.querySelector('#city-form');
const cityButtonsEl = document.querySelector('#city-buttons');
const cityInputEl = document.querySelector('#city-input');
const cityContainerEl = document.querySelector('#city-container');
const fiveContainer = document.querySelector('#five-days');
const cityName = document.querySelector('#cityName');
const weatherDate = document.querySelector('#weatherDate');
const apiKey = 'edeb4ca36bc2cc213a04647b525557a5';

let cityArray = [];

function storeCity() {
    localStorage.setItem('cities', JSON.stringify(cityArray));
}

const showHistory = function () {
    cityButtonsEl.textContent = '';
    for (const city of cityArray) {
        const btnHistory = document.createElement('button');
        btnHistory.classList.add('btn', 'btn-primary', 'mb-3');
        btnHistory.textContent = city;
        btnHistory.setAttribute('data-city', city);
        cityButtonsEl.appendChild(btnHistory);
    }

};

const getCityWeather = function (city) {

    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    weatherDate.textContent = city;
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

const displayCities = function (citySt) {
    if (citySt.length === 0) {
        cityContainerEl.textContent = 'No weather found.';
        return;
    }
    console.log(citySt);



    for (let i = 0; i < citySt.list.length; i += 8) {
        if (i === 0) {
            const cardC = displayForecast(citySt, 0);
            cardC.classList = 'border-0';
            cityContainerEl.append(cardC);
        }
        else {
            let cardF = displayForecast(citySt, i);
            fiveContainer.append(cardF);

        }

    }

};


const displayForecast = function (cityData, index) {

    const card = document.createElement('div');
    card.classList = 'card col-lg-2 mx-1';
    const cardBody = document.createElement('div');
    cardBody.classList = 'card-body';

    const cityTime = document.createElement('h2');
    cityTime, classList = 'card-title';
    cityTime.textContent = `${dayjs(cityData.list[index].dt_txt).format('MMM-DD')}`;

    const weatherIcon = document.createElement('img');
    const iconName = `${cityData.list[index].weather[0].icon}`;
    const iconUrl = `https://openweathermap.org/img/wn/${iconName}.png`
    weatherIcon.setAttribute('src', iconUrl);


    const cityTemp = document.createElement('p');
    cityTemp.textContent = `Temp : ${cityData.list[index].main.temp}`;

    const cityWind = document.createElement('p');
    cityWind.textContent = `Wind : ${cityData.list[index].wind.speed}`;

    const cityhumidity = document.createElement('p');
    cityhumidity.textContent = `Humidity : ${cityData.list[index].main.humidity}`;

    cardBody.append(cityTime, weatherIcon, cityTemp, cityWind, cityhumidity);
    card.append(cardBody);
    return card;
}


const formSubmitHandler = function (event) {
    event.preventDefault();

    const city = cityInputEl.value.trim();

    if (city) {
        getCityWeather(city);
        cityArray.push(city);
        storeCity();
        showHistory();
        cityContainerEl.textContent = '';
        cityInputEl.value = '';
    } else {
        alert('Please enter a City name');
    }
};

const buttonClickHandler = function (event) {
    const city = event.target.getAttribute('data-city');

    if (city) {
        getCityWeather(city);
        cityContainerEl.textContent = '';
        fiveContainer.textContent = '';
    }
};

cityFormEl.addEventListener('submit', formSubmitHandler);
cityButtonsEl.addEventListener('click', buttonClickHandler);

window.onload = () => {
    const listCities = JSON.parse(localStorage.getItem('cities'));
    if (listCities !== null) {
        cityArray = listCities;
        console.log(cityArray);
    }
    showHistory();
};
