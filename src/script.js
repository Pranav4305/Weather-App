// Aurora Color Palettes based on Weather Condition
const auroraPalettes = {
  Clear: { c1: "#ff7e5f", c2: "#feb47b", c3: "#ff9966" }, // Warm Sunrise/Sunset vibes
  Clouds: { c1: "#5c6bc0", c2: "#3949ab", c3: "#9fa8da" }, // Moody Blues
  Rain: { c1: "#141e30", c2: "#243b55", c3: "#0d47a1" }, // Deep Stormy Blues
  Snow: { c1: "#83a4d4", c2: "#b6fbff", c3: "#ffffff" }, // Icy Cyans
  Thunderstorm: { c1: "#23074d", c2: "#cc5333", c3: "#1a0033" }, // Purple & Orange flashes
  Drizzle: { c1: "#89f7fe", c2: "#66a6ff", c3: "#4facfe" }, // Light watery blues
  Mist: { c1: "#757f9a", c2: "#d7dde8", c3: "#606c88" }, // Foggy Grays
  Default: { c1: "#1a2a6c", c2: "#b21f1f", c3: "#fdbb2d" } // Classic Aurora
};

const weather = {
  apiKey: "aba6ff9d6de967d5eac6fd79114693cc",
  
  fetchWeather: async function (city) {
    this.showLoading();
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${this.apiKey}`
      );
      
      if (!response.ok) {
        throw new Error("No weather found.");
      }
      
      const data = await response.json();
      this.displayWeather(data);
    } catch (error) {
      this.showError();
    }
  },

  fetchWeatherByCoords: async function (lat, lon) {
    this.showLoading();
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`
      );
      
      if (!response.ok) {
        throw new Error("No weather found for coordinates.");
      }
      
      const data = await response.json();
      this.displayWeather(data);
    } catch (error) {
      this.fetchWeather("Manipal"); // Fallback
    }
  },

  displayWeather: function (data) {
    const { name } = data;
    const { icon, description, main: weatherMain } = data.weather[0];
    const { temp, humidity, feels_like, pressure } = data.main;
    const { speed } = data.wind;

    // Populate Data
    document.querySelector(".city").innerText = name;
    document.querySelector(".weather-icon").src = `https://openweathermap.org/img/wn/${icon}@4x.png`;
    document.querySelector(".description").innerText = description;
    document.querySelector(".temp").innerText = `${Math.round(temp)}°`;
    
    // Bento Metrics
    document.querySelector(".feels-like").innerText = `${Math.round(feels_like)}°`;
    document.querySelector(".humidity-text").innerText = `${humidity}%`;
    document.querySelector(".wind-text").innerText = `${Math.round(speed * 3.6)} km/h`;
    document.querySelector(".pressure").innerText = `${pressure} hPa`;
    
    // Update Aurora Gradient Colors
    const palette = auroraPalettes[weatherMain] || auroraPalettes.Default;
    document.documentElement.style.setProperty('--aurora-1', palette.c1);
    document.documentElement.style.setProperty('--aurora-2', palette.c2);
    document.documentElement.style.setProperty('--aurora-3', palette.c3);

    // Hide errors and loading state
    document.getElementById("error-message").classList.remove("show");
    document.getElementById("weather-content").classList.remove("loading");
  },

  search: function () {
    const searchBar = document.querySelector(".search-bar");
    const city = searchBar.value.trim();
    if (city) {
      this.fetchWeather(city);
      searchBar.value = ""; 
    }
  },

  showLoading: function() {
    document.getElementById("weather-content").classList.add("loading");
    document.getElementById("error-message").classList.remove("show");
  },

  showError: function() {
    document.getElementById("weather-content").classList.add("loading");
    document.getElementById("error-message").classList.add("show");
  }
};

const geocode = {
  getLocation: function() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          weather.fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
        },
        () => {
          weather.fetchWeather("Manipal"); // Fallback
        }
      );
    } else {
      weather.fetchWeather("Manipal");
    }
  }
};

document.querySelector(".search-button").addEventListener("click", function () {
  weather.search();
});

document.querySelector(".search-bar").addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    weather.search();
  }
});

geocode.getLocation();