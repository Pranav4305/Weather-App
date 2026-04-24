// Mapping common weather conditions to high-quality Unsplash images
const weatherBackgrounds = {
  Clear: "https://images.unsplash.com/photo-1601297183305-6df142704ea2?auto=format&fit=crop&q=80&w=1920&h=1080", // Clear sky
  Clouds: "https://images.unsplash.com/photo-1534088568595-a066f410cbda?auto=format&fit=crop&q=80&w=1920&h=1080", // Clouds
  Rain: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&q=80&w=1920&h=1080", // Rain
  Snow: "https://images.unsplash.com/photo-1491002052546-bf38f186af56?auto=format&fit=crop&q=80&w=1920&h=1080", // Snow
  Thunderstorm: "https://images.unsplash.com/photo-1605727216801-e27ce1d0ce49?auto=format&fit=crop&q=80&w=1920&h=1080", // Thunderstorm
  Drizzle: "https://images.unsplash.com/photo-1556485689-33e55ab56127?auto=format&fit=crop&q=80&w=1920&h=1080", // Drizzle
  Mist: "https://images.unsplash.com/photo-1543968996-ee822b8176ba?auto=format&fit=crop&q=80&w=1920&h=1080", // Mist/Fog
  Smoke: "https://images.unsplash.com/photo-1522881451255-f59ad836fdfb?auto=format&fit=crop&q=80&w=1920&h=1080", // Smoke
  Haze: "https://images.unsplash.com/photo-1522881451255-f59ad836fdfb?auto=format&fit=crop&q=80&w=1920&h=1080", // Haze
  Dust: "https://images.unsplash.com/photo-1545134969-8debd725b733?auto=format&fit=crop&q=80&w=1920&h=1080", // Dust
  Fog: "https://images.unsplash.com/photo-1543968996-ee822b8176ba?auto=format&fit=crop&q=80&w=1920&h=1080", // Fog
  Sand: "https://images.unsplash.com/photo-1545134969-8debd725b733?auto=format&fit=crop&q=80&w=1920&h=1080", // Sand
  Ash: "https://images.unsplash.com/photo-1522881451255-f59ad836fdfb?auto=format&fit=crop&q=80&w=1920&h=1080", // Ash
  Squall: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&q=80&w=1920&h=1080", // Squall
  Tornado: "https://images.unsplash.com/photo-1527482797697-8795b05a13fe?auto=format&fit=crop&q=80&w=1920&h=1080", // Tornado
  Default: "https://images.unsplash.com/photo-1504608524841-42ce6c20b004?auto=format&fit=crop&q=80&w=1920&h=1080" // Default/Nature
};

const weather = {
  apiKey: "aba6ff9d6de967d5eac6fd79114693cc",
  
  // Fetch weather by city name
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
      console.error("Error fetching weather:", error);
    }
  },

  // Fetch weather by coordinates (Geolocation)
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
      console.error("Error fetching weather by coords:", error);
    }
  },

  displayWeather: function (data) {
    const { name } = data;
    const { icon, description, main } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;

    document.querySelector(".city").innerText = `Weather in ${name}`;
    document.querySelector(".icon").src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    document.querySelector(".description").innerText = description;
    document.querySelector(".temp").innerText = `${Math.round(temp)}°C`;
    document.querySelector(".humidity-text").innerText = `Humidity: ${humidity}%`;
    document.querySelector(".wind-text").innerText = `Wind speed: ${speed} km/h`;
    
    // Hide errors and loading state
    document.querySelector(".error-message").classList.remove("show");
    document.querySelector(".weather").classList.remove("loading");
    
    // Set background image based on weather condition
    const backgroundUrl = weatherBackgrounds[main] || weatherBackgrounds.Default;
    document.body.style.backgroundImage = `url('${backgroundUrl}')`;
  },

  search: function () {
    const searchBar = document.querySelector(".search-bar");
    const city = searchBar.value.trim();
    if (city) {
      this.fetchWeather(city);
      searchBar.value = ""; // Clear input after search
    }
  },

  showLoading: function() {
    document.querySelector(".weather").classList.add("loading");
    document.querySelector(".error-message").classList.remove("show");
  },

  showError: function() {
    document.querySelector(".weather").classList.add("loading");
    document.querySelector(".error-message").classList.add("show");
  }
};

// Geolocation Logic
const geocode = {
  getLocation: function() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          weather.fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.warn("Geolocation blocked or failed. Using fallback.", error);
          weather.fetchWeather("Manipal"); // Fallback city
        }
      );
    } else {
      weather.fetchWeather("Manipal");
    }
  }
};

// Event Listeners
document.querySelector(".search-button").addEventListener("click", function () {
  weather.search();
});

document.querySelector(".search-bar").addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    weather.search();
  }
});

// Initial load
geocode.getLocation();