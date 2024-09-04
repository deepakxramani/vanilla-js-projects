const cityInput =  document.querySelector('.city-input');
const searchBtn = document.querySelector('.search-btn');

const weatherInfoSection = document.querySelector('.weather-info')
const notFoundSection = document.querySelector('.not-found');
const searchCitySection = document.querySelector('.search-city');

const countryTxt = document.querySelector('.country-text');
const currentDateTxt = document.querySelector('.current-date-txt');
const tempTxt = document.querySelector('.temp-txt');
const conditionTxt = document.querySelector('.condition-txt');
const humiditValueTxt = document.querySelector('.humidity-value-txt')
const windValueTxt = document.querySelector('.wind-value-txt');
const weatherSummaryImg = document.querySelector('.weather-summary-img');

const mainContainer = document.querySelector('.main-container');

const forecastItemsContainer = document.querySelector('.forecast-items-container');

const apiKey = 'b36e16584bb15169251c37c0fa4104bf'

searchBtn.addEventListener('click', () => {
    if(cityInput.value.trim() != ''){
        updateWeatherInfo(cityInput.value)
        cityInput.value = ''
        cityInput.blur()
    }
})

cityInput.addEventListener('keydown', (event) => {
    if(event.key == 'Enter' && 
        cityInput.value.trim() != ''
    ) {
        updateWeatherInfo(cityInput.value)
        cityInput.value = ''
        cityInput.blur()
    }
})

async function getFetchedData(endPoint, city) {
    const apiURL = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(apiURL);
    return response.json();
}

function getWeatherIcon(id) {
    if (id <= 232) {
        return 'thunderstorm.svg'
    }
    if (id <= 321) {
        return 'drizzle.svg'
    } 
    if (id <= 531) {
        return 'rain.svg'  
    } 
    if (id <= 622) {
        return 'snow.svg'
    } 
    if (id <= 781) {
        return 'atmosphere.svg'
    } 
    if (id == 800) {
        return 'clear.svg'
    }
    if (id <= 804) {
        return 'clouds.svg'
    }
    else {
        return 'clouds.svg'
    }
}

function setWeatherBackground(id) {
    if (id <= 232) {
        mainContainer.style.backgroundImage = `url(assets/thunderstorm.jpg)`;
    }
    else if (id <= 321) {
        mainContainer.style.backgroundImage = `url(assets/others.jpg)`;
    } 
    else if (id <= 531) {
        mainContainer.style.backgroundImage = `url(assets/rain.jpg)`;  
    } 
    else if (id <= 622) {
        mainContainer.style.backgroundImage = `url(assets/snow.jpg)`;
    } 
    else if (id <= 781) {
        mainContainer.style.backgroundImage = `url(assets/atmosphere.jpg)`;
    } 
    else if (id <= 800) {
        mainContainer.style.backgroundImage = `url(assets/clear.jpg)`;
    }
    else if (id <= 804) {
        mainContainer.style.backgroundImage = `url(assets/clouds.jpg)`;
    }
    else {
        mainContainer.style.backgroundImage = `url(assets/others.jpg)`;
    }
    
}

function getCurrentDate() {
    const currentDate = new Date();
    const options = {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    } 
    return currentDate.toLocaleDateString('en-GB', options);
}

async function updateWeatherInfo(city) {
    const weatherData = await getFetchedData('weather', city);

    if(weatherData.cod != 200){
        showDisplaySection(notFoundSection)
        return
    }
    // console.log(weatherData)

    const {
        name: country,
        main: { temp, humidity },
        weather: [{ id, main }],
        wind: {speed},
    } = weatherData;

    countryTxt.innerHTML = country;
    tempTxt.textContent = Math.round(temp) + ' °C';
    conditionTxt.textContent = main;
    humiditValueTxt.textContent = humidity + '%';
    windValueTxt.textContent = speed + " M/s"

    currentDateTxt.textContent = getCurrentDate()
    weatherSummaryImg.src = `assets/weather/${getWeatherIcon(id)}`

    await updateForecastInfo(city)
    setWeatherBackground(id);
    showDisplaySection(weatherInfoSection);
}

async function updateForecastInfo(city) {
    const forecastData = await getFetchedData('forecast', city)
    
    const timeTaken = '12:00:00'
    const todayDate = new Date().toISOString().split('T')[0]
    
    forecastItemsContainer.innerHTML = ''
    forecastData.list.forEach(forecastWeather => {
        if (forecastWeather.dt_txt.includes(timeTaken) && 
            !forecastWeather.dt_txt.includes(todayDate)){
            updateForecastItems(forecastWeather)
        }
        
    })
}

function updateForecastItems(weatherData) {
    console.log(weatherData)
    const {
        dt_txt: date,
        weather: [{ id }],
        main: { temp }
    } = weatherData

    const dateTaken = new Date(date)
    const dateOption = {
        day: '2-digit',
        month: 'short'
    }

    const dateResult = dateTaken.toLocaleDateString('en-US', dateOption)

    const forecastItem = `
        <div class="forecast-item">
            <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
            <img src="assets/weather/${getWeatherIcon(id)}" class="forecast-item-img">
            <h5 class="forecast-item-temp">${Math.round(temp)} °C</h5>
        </div>
    `

    forecastItemsContainer.insertAdjacentHTML('beforeend', forecastItem)
}

function showDisplaySection(section) {
    [weatherInfoSection, searchCitySection, notFoundSection]
    .forEach(section => section.style.display = 'none')

    section.style.display = 'flex'

}