const apiKey = '18aa8798799a93c0a2393c731a767792'; 
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
const locationInput = document.getElementById('locationInput');
const searchButton = document.getElementById('searchButton');
const locationElement = document.getElementById('location');
const dateTimeElement = document.getElementById('dateTime');
const temperatureElement = document.getElementById('temperature');
const humidityElement = document.getElementById('humidity');
const windSpeedElement = document.getElementById('windSpeed');
const weatherIconElement = document.getElementById('weatherIcon');
const chartElement = document.getElementById('weatherChart');
const errorMessage = document.getElementById('errorMessage');

let weatherChart;

searchButton.addEventListener('click', () => {
    const location = locationInput.value.trim();
    if (location) {
        errorMessage.textContent = ''; 
        fetchWeather(location);
    } else {
        errorMessage.textContent = 'Please enter a city name.';
    }
});

function fetchWeather(location) {
    const url = `${apiUrl}?q=${location}&appid=${apiKey}&units=metric`;
    fetch(url)
        .then(response => {
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('City not found. Please try again.');
                } else {
                    throw new Error('An error occurred while fetching data.');
                }
            }
            return response.json();
        })
        .then(data => {
            locationElement.textContent = data.name;
            const dateTime = new Date(data.dt * 1000);
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
            dateTimeElement.textContent = dateTime.toLocaleString('en-IN', options).replace(/:\d{2}\b/g, '');
            temperatureElement.textContent = `Temperature: ${Math.round(data.main.temp)}°C`;
            humidityElement.textContent = `Humidity: ${data.main.humidity}%`;
            windSpeedElement.textContent = `Wind Speed: ${data.wind.speed} m/s`;
            weatherIconElement.className = `wi wi-owm-${data.weather[0].id}`;
            drawChart(data); 
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            errorMessage.textContent = error.message;
        });
}

function drawChart(data) {
    const labels = ['Today', 'Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6'];
    const temperatures = [Math.round(data.main.temp), 21, 22, 23, 24, 25, 26]; 
    const humidities = [data.main.humidity, 55, 60, 65, 70, 75, 80]; 
    const windSpeeds = [data.wind.speed, 6, 7, 8, 9, 10, 11]; 

    if (weatherChart) {
        weatherChart.destroy();
    }

    weatherChart = new Chart(chartElement, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Temperature (°C)',
                    data: temperatures,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    fill: false
                },
                {
                    label: 'Humidity (%)',
                    data: humidities,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    fill: false
                },
                {
                    label: 'Wind Speed (m/s)',
                    data: windSpeeds,
                    borderColor: 'rgba(255, 206, 86, 1)',
                    backgroundColor: 'rgba(255, 206, 86, 0.2)',
                    fill: false
                }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
