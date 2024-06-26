const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

const apiErrorImg = document.querySelector("[data-notFoundImg]");
const apiErrorMessage = document.querySelector("[data-apiErrorText]");
const apiErrorContainer = document.querySelector(".api-error-container");
// const apiErrorBtn = document.querySelector("[data-apiErrorBtn]");

let currentTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
currentTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(clickedTab){
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab"); 
        
        if(!searchForm.classList.contains("active")){
            searchForm.classList.add("active");
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
        }
        else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");

            getfromSessionStorage();
        }
    }
}

userTab.addEventListener('click', () => {
    switchTab(userTab);
})

searchTab.addEventListener('click', () => {
    switchTab(searchTab);
})

function showError(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        messageText.innerText = "You denied the request for Geolocation.";
        break;
      case error.POSITION_UNAVAILABLE:
        messageText.innerText = "Location information is unavailable.";
        break;
      case error.TIMEOUT:
        messageText.innerText = "The request to get user location timed out.";
        break;
      case error.UNKNOWN_ERROR:
        messageText.innerText = "An unknown error occurred.";
        break;
    }
}

function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");

    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat, lon} = coordinates;
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");

    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();

        loadingScreen.classList.remove("active");
        renderWeatherInfo(data);
        userInfoContainer.classList.add("active");

    }
    catch(error){
        console.log('Error Found');
        // HW
        loadingScreen.classList.remove("active");
        apiErrorContainer.classList.add("active");
        // apiErrorImg.style.display = "none";
        apiErrorMessage.innerText = `Error: ${error?.message}`;
        // apiErrorBtn.addEventListener("click", fetchUserWeatherInfo);
    }
}

function renderWeatherInfo(weatherInfo){
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText =  weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText =  weatherInfo?.main?.temp + ' °C';
    windspeed.innerText = weatherInfo?.wind?.speed + 'm/s';
    humidity.innerText = weatherInfo?.main?.humidity + '%';
    cloudiness.innerText = weatherInfo?.clouds?.all + '%';
    // userInfoContainer.classList.add("active");
}

// const grantAccessButton  = document.querySelector("[data-grantAccess]");

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition); 
    }
    else{
        grantAccessButton.style.display = 'none';
    }
}

function showPosition(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener('click', getLocation);
 
const searchInput = document.querySelector("[data-searchInput]");
// const submitBtn = document.querySelector

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    // let cityName = searchInput.value;

    if(searchInput.value === ""){
        return;
    }
    
    fetchSearchWeatherInfo(searchInput.value);
    searchInput.value = "";
    
})

async function fetchSearchWeatherInfo(city){
    // let city = searchInput.value;
    // console.log("working");
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response = await
        fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        if (!data.sys) {
            throw data;
        }
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(error){
        // console.log('Error Found');
        //HW
        loadingScreen.classList.remove("active");
        apiErrorContainer.classList.add("active");
        apiErrorMessage.innerText = `${error?.message}`;
        apiErrorBtn.style.display = "none";
    }
}

















