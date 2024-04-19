document.addEventListener("DOMContentLoaded", function () {
  // Inicializações e definições de variáveis
  let currCity = "Recife"
  let units = "metric"
  const searchForm = document.querySelector(".weather__searchform")

  // Definir e adicionar manipuladores de evento
  document.querySelector(".weather__search").addEventListener("submit", (e) => {
    e.preventDefault()
    currCity = searchForm.value
    getWeather()
    searchForm.value = ""
  })

  document
    .querySelector(".weather__unit_celsius")
    .addEventListener("click", () => {
      if (units !== "metric") {
        units = "metric"
        getWeather()
      }
    })

  document
    .querySelector(".weather__unit_farenheit")
    .addEventListener("click", () => {
      if (units !== "imperial") {
        units = "imperial"
        getWeather()
      }
    })

  // Chamada inicial da função para carregar dados
  getWeather()

  // Selectors
  let city = document.querySelector(".weather__city")
  let datetime = document.querySelector(".weather__datetime")
  let weather__forecast = document.querySelector(".weather__forecast")
  let weather__temperature = document.querySelector(".weather__temperature")
  let weather__icon = document.querySelector(".weather__icon")
  let weather__minmax = document.querySelector(".weather__minmax")
  let weather__realfeel = document.querySelector(".weather__realfeel")
  let weather__humidity = document.querySelector(".weather__humidity")
  let weather__wind = document.querySelector(".weather__wind")
  let weather__pressure = document.querySelector(".weather__pressure")

  function convertTimeStamp(timestamp, timezoneOffset) {
    // Criar uma data UTC com o timestamp fornecido
    const utcDate = new Date(timestamp * 1000)
    // Aplicar o offset do fuso horário (convertido para milissegundos)
    const localDate = new Date(utcDate.getTime() + timezoneOffset * 1000)

    // Configurar opções de formatação com o fuso horário local do usuário
    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC", // Usar UTC aqui para aplicar manualmente o offset
    }

    // Formatar a data para a localidade 'pt-BR'
    return localDate.toLocaleString("pt-BR", options)
  }

  // convert country code to name
  function convertCountryCode(country) {
    let regionNames = new Intl.DisplayNames(["pt-BR"], { type: "region" })
    return regionNames.of(country)
  }

  function getWeather() {
    const API_KEY = "64f60853740a1ee3ba20d0fb595c97d5"

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${currCity}&appid=${API_KEY}&units=${units}&lang=pt_br`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        city.innerHTML = `${data.name}, ${convertCountryCode(data.sys.country)}`
        datetime.innerHTML = convertTimeStamp(data.dt, data.timezone)
        weather__forecast.innerHTML = `<p>${data.weather[0].description}`
        weather__temperature.innerHTML = `${data.main.temp.toFixed()}&#176`
        weather__icon.innerHTML = `<img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" />`
        weather__minmax.innerHTML = `<p>Min: ${data.main.temp_min.toFixed()}&#176</p><p>Max: ${data.main.temp_max.toFixed()}&#176</p>`
        weather__realfeel.innerHTML = `${data.main.feels_like.toFixed()}&#176`
        weather__humidity.innerHTML = `${data.main.humidity}%`
        weather__wind.innerHTML = `${data.wind.speed} ${
          units === "imperial" ? "mph" : "m/s"
        }`
        weather__pressure.innerHTML = `${data.main.pressure} hPa`
      })
  }

})
