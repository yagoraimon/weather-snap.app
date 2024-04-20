document.addEventListener("DOMContentLoaded", function () {
  let currCity,
    units = "metric"
  const form = document.querySelector(".weather__search")
  const searchInput = form.querySelector("input[type='text']") // Seleciona o input de texto dentro do formulário
  const weatherCity = document.querySelector(".weather__city")
  const datetime = document.querySelector(".weather__datetime")
  const weatherForecast = document.querySelector(".weather__forecast")
  const weatherTemperature = document.querySelector(".weather__temperature")
  const weatherIcon = document.querySelector(".weather__icon")
  const weatherMinMax = document.querySelector(".weather__minmax")
  const weatherRealFeel = document.querySelector(".weather__realfeel")
  const weatherHumidity = document.querySelector(".weather__humidity")
  const weatherWind = document.querySelector(".weather__wind")
  const weatherPressure = document.querySelector(".weather__pressure")

  const celsiusButton = document.querySelector(".weather__unit_celsius")
  const fahrenheitButton = document.querySelector(".weather__unit_farenheit")


  // Geolocalização via hardware
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        // Convertendo a latitude e longitude em nome da cidade usando uma API OpenWeatherMap
        fetch(
          `https://api.openweathermap.org/geo/1.0/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&limit=1&appid=64f60853740a1ee3ba20d0fb595c97d5`
        )
          .then((res) => res.json())
          .then((data) => {
            currCity = data[0].name // Define o nome da cidade chamada
            getWeather()
          })
          .catch((error) =>
            console.error(
              "Erro ao converter geolocalização para cidade:",
              error
            )
          )
      },
      function (error) {
        // Chamada para carregar os dados de clima baseados na localização por IP
        fetch("https://ipapi.co/json/")
          .then((response) => response.json())
          .then((jsonData) => {
            currCity = jsonData.city
            getWeather()
          })
      }
    )
  } else {
    alert("Geolocalização não está disponível em seu navegador.")
    
  }

  // Event listener para o formulário de busca
  form.addEventListener("submit", (e) => {
    e.preventDefault()
    if (searchInput.value.trim()) {
      currCity = searchInput.value.trim() // Atualiza a cidade atual com a nova pesquisa
      getWeather()
      searchInput.value = "" // Limpa o campo de entrada após a submissão
    } else {
      alert("Por favor, insira um nome de cidade válido.")
    }
  })

  // Adiciona event listeners para a mudança de unidades
  document
    .querySelector(".weather__unit_celsius")
    .addEventListener("click", () => {
      if (units !== "metric") {
        units = "metric"
        getWeather()
        celsiusButton.classList.add("weather__unit_active")
        fahrenheitButton.classList.remove("weather__unit_active")
      }
    })

  document
    .querySelector(".weather__unit_farenheit")
    .addEventListener("click", () => {
      if (units !== "imperial") {
        units = "imperial"
        getWeather()
        fahrenheitButton.classList.add("weather__unit_active")
        celsiusButton.classList.remove("weather__unit_active")
      }
    })

  function getWeather() {
    if (!currCity) {
      alert("Nome da cidade não fornecido.")
      return
    }
    const API_KEY = "64f60853740a1ee3ba20d0fb595c97d5"
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${currCity}&appid=${API_KEY}&units=${units}&lang=pt_br`
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Erro HTTP: Status ${res.status}`)
        }
        return res.json()
      })
      .then((data) => {
        if (!data || !data.weather) {
          alert("Dados de clima não disponíveis para esta cidade.")
          return
        }
        updateWeatherDisplay(data)
      })
      .catch((error) => {
        console.error("Erro ao buscar os dados de clima: ", error)
        alert(`Erro ao buscar dados do clima. ${error.message}`)
      })
  }

  function updateWeatherDisplay(data) {
    weatherCity.innerHTML = `${data.name}, ${convertCountryCode(
      data.sys.country
    )}`
    datetime.innerHTML = convertTimeStamp(data.dt, data.timezone)
    weatherForecast.innerHTML = `<p>${data.weather[0].description}</p>`
    weatherTemperature.innerHTML = `${data.main.temp.toFixed()}${
      units === "imperial" ? "&#176F" : "&#176C"
    }`
    weatherIcon.innerHTML = `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" />`
    weatherMinMax.innerHTML = `<p>Min: ${data.main.temp_min.toFixed()}${
      units === "imperial" ? "&#176F" : "&#176C"
    }</p><p>Max: ${data.main.temp_max.toFixed()}${
      units === "imperial" ? "&#176F" : "&#176C"
    }</p>`
    weatherRealFeel.innerHTML = `${data.main.feels_like.toFixed()}${
      units === "imperial" ? "&#176F" : "&#176C"
    }`
    weatherHumidity.innerHTML = `${data.main.humidity}%`
    weatherWind.innerHTML = `${data.wind.speed} ${
      units === "imperial" ? "mph" : "m/s"
    }`
    weatherPressure.innerHTML = `${data.main.pressure} hPa`
  }

  // Função para converter o código de país em nome de país
  function convertCountryCode(countryCode) {
    const regionNames = new Intl.DisplayNames(["pt-BR"], { type: "region" })
    return regionNames.of(countryCode)
  }

  // Função para converter o timestamp UNIX em data local
  function convertTimeStamp(timestamp, timezoneOffset) {
    const utcDate = new Date(timestamp * 1000)
    const localDate = new Date(utcDate.getTime() + timezoneOffset * 1000)
    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    }
    return localDate.toLocaleString("pt-BR", options)
  }
})
