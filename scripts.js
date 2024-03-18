const apiKey = '6a73dd074c9b3fdf8ee3d8542f54e431';
let isCelsius = true; 

document.getElementById('search-btn').addEventListener('click', () => {
    const city = document.getElementById('city-input').value.trim();
    if (city) {
        getWeather(city);
        getForecast(city);
    } else {
        document.getElementById('error-message').textContent = 'Please enter a city name.';
        document.getElementById('weather-info').innerHTML = '';
        document.getElementById('forecast').innerHTML = '';
    }
});

document.getElementById('toggle-unit-btn').addEventListener('click', () => {
    isCelsius = !isCelsius; 
    const city = document.getElementById('city-input').value.trim();
    if (city) {
        getWeather(city);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    } else {
        console.error('Geolocation is not supported by your browser');
    }
});

function successCallback(position) {
    const { latitude, longitude } = position.coords;
    getWeatherByCoordinates(latitude, longitude);
    getForecastByCoordinates(latitude, longitude);
}

function errorCallback(error) {
    console.error('Error getting geolocation:', error.message);
}

async function getWeatherByCoordinates(latitude, longitude) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`);
        if (!response.ok) {
            throw new Error('Unable to fetch weather data');
        }
        const data = await response.json();
        displayWeather(data);
        document.getElementById('error-message').textContent = '';
        document.getElementById('toggle-unit-btn').classList.add('show'); 
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
        document.getElementById('weather-info').innerHTML = '';
        document.getElementById('error-message').textContent = error.message;
        document.getElementById('toggle-unit-btn').classList.remove('show'); 
    }
}

async function getWeather(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        if (!response.ok) {
            throw new Error('City not found');
        }
        const data = await response.json();
        displayWeather(data);
        document.getElementById('error-message').textContent = '';
        document.getElementById('toggle-unit-btn').classList.add('show'); 
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
        document.getElementById('weather-info').innerHTML = '';
        document.getElementById('error-message').textContent = error.message;
        document.getElementById('toggle-unit-btn').classList.remove('show'); 
    }
}

async function getForecast(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
        if (!response.ok) {
            throw new Error('Unable to fetch forecast data');
        }
        const data = await response.json();
        displayForecast(data);
    } catch (error) {
        console.error('Error fetching forecast data:', error.message);
        document.getElementById('forecast').innerHTML = '';
    }
}

async function getForecastByCoordinates(latitude, longitude) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`);
        if (!response.ok) {
            throw new Error('Unable to fetch forecast data');
        }
        const data = await response.json();
        displayForecast(data);
    } catch (error) {
        console.error('Error fetching forecast data:', error.message);
        document.getElementById('forecast').innerHTML = '';
    }
}

function displayWeather(data) {
    const weatherInfo = document.getElementById('weather-info');
    const iconCode = data.weather[0].icon;
    const iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;
    const temperature = isCelsius ? data.main.temp : celsiusToFahrenheit(data.main.temp);
    const feelsLike = isCelsius ? data.main.feels_like : celsiusToFahrenheit(data.main.feels_like);

    weatherInfo.innerHTML = `
        <h2>${data.name}</h2>
        <img src="${iconUrl}" alt="${data.weather[0].description}">
        <p>${data.weather[0].description}</p>
        <p>Temperature: ${temperature} ${isCelsius ? '°C' : '°F'}</p>
        <p>Feels like: ${feelsLike} ${isCelsius ? '°C' : '°F'}</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
    `;
    document.getElementById('toggle-unit-btn').textContent = isCelsius ? 'Switch to Fahrenheit' : 'Switch to Celsius';
}

function displayForecast(data) {
    const forecastDiv = document.getElementById('forecast');
    forecastDiv.innerHTML = '<h2>Forecast</h2>';

    
    const forecastData = data.list.filter((item, index) => index % 8 === 0).slice(1, 6);

    forecastData.forEach(day => {
        const date = new Date(day.dt * 1000);
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
        const iconCode = day.weather[0].icon;
        const iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;

        const forecastDayHTML = `
            <div class="forecast-day">
                <div>${dayOfWeek}</div>
                <div>
                    <img src="${iconUrl}" alt="${day.weather[0].description}">
                    ${day.main.temp} °C
                </div>
            </div>
        `;
        forecastDiv.innerHTML += forecastDayHTML;
    });
}

function celsiusToFahrenheit(celsius) {
    return (celsius * 9 / 5) + 32;
}

const storedColor = localStorage.getItem('backgroundColor');

if (storedColor) {
if (storedColor.startsWith('linear-gradient')) {
    document.body.style.background = storedColor;
} else {
    document.body.style.backgroundColor = storedColor;
}
}


function saveToHistory(city) {
    const searchDate = new Date().toLocaleString(); 
    let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    history.unshift({ city, date: searchDate }); 
    localStorage.setItem('searchHistory', JSON.stringify(history));
}

// Function to display search history
function displayHistory() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = ''; 

    const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    history.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.city} - ${item.date}`; 
        historyList.appendChild(li);
    });
}


document.getElementById('search-btn').addEventListener('click', () => {
    const city = document.getElementById('city-input').value.trim();
    if (city) {
        getWeather(city);
        getForecast(city);
        saveToHistory(city); 
        displayHistory(); 
    } else {
        // Display error message or handle empty input
    }
});


window.addEventListener('load', displayHistory);



// Function to clear search history with animation
document.getElementById('clear-history-btn').addEventListener('click', () => {
    const historyList = document.getElementById('history-list');
    if (historyList.childNodes.length > 0) { 
        historyList.style.transition = 'opacity 0.5s ease';
        historyList.style.opacity = 0;

        setTimeout(() => {
            localStorage.removeItem('searchHistory'); 
            displayHistory(); 
            historyList.style.opacity = 1; 
        }, 500); 
    } else {
        localStorage.removeItem('searchHistory'); 
        displayHistory(); 
    }
});

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('warning-message').style.display = 'block';
});