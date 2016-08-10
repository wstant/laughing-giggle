
// ---------- SCRIPTS ------------

var nomadApp = {};
nomadApp.apiUrl = 'https://nomadlist.com/api/v2/list/cities';

// User Input --------------------------------------------
var userPrice;
var userClimate;
var userActivity;

nomadApp.userInput = function() {
	$('#nomadForm').on('submit', function(e) {
		e.preventDefault();
		userPrice = $('.costInput').val();
		userClimate = $('.climateInput').val();
		userActivity = $('.activityInput').val();
		nomadApp.getCities();
	})
}


// API CALL --------------------------------------------

nomadApp.getCities = function() {
	  $.ajax({
		url: nomadApp.apiUrl,
		method: 'GET',
		dataType: 'json'
	}).then(function(nomadCities) {
		nomadApp.cities = nomadCities.result;
		// console.log(nomadApp.cities);
		return nomadApp.cities;
	})
	// PRICE FILTER -----------------------------------------
	.then(function(data) {
		var filterDataByCost;
		filterDataByCost = data.filter(function(currentCity) {
			if (userPrice === "cheap") {
				return currentCity.cost.nomad.USD <= 2490;
			}
			else if (userPrice === "affordable") {
				return currentCity.cost.nomad.USD <= 4624 && currentCity.cost.nomad.USD >= 2491;
			}
			else if (userPrice === "expensive") {
				return currentCity.cost.nomad.USD > 4624;
			}
		});
		return filterDataByCost;
	})
	// CLIMATE FILTER ---------------------------------------
	.then(function(data) {
		var filterDataByClimate;
		filterDataByClimate = data.filter(function(currentCity) {
			if (userClimate === "cold") {
				return currentCity.info.weather.temperature.celsius <= 16;
			}
			else if (userClimate === "warm") {
				return currentCity.info.weather.temperature.celsius > 16 && currentCity.info.weather.temperature.celsius < 23;
			}
			else if (userClimate === "hot") {
				return currentCity.info.weather.temperature.celsius >= 23;
			}
		});
		return filterDataByClimate;
	})

	// ACTIVITY FILTER --------------------------------------
	// .then

	// DISPLAY DATA -----------------------------------------
	// .then
	
	.fail(function(error){
		console.log(error);
	});	
};

// LAZY LOAD CITIES ------------------------------------


// INITIALIZE -------------------------------------------
nomadApp.init = function(){
	// nomadApp.getCities();
	nomadApp.userInput();
};

// DOCUMENT READY ---------------------------------------
$(function() {
	nomadApp.init();
});