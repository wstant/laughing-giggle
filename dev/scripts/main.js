
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
	.then(function(data){
		var orderDataByActivity = data;
		if(userActivity === 'partying'){
			orderDataByActivity = data.filter(function(currentCity) {
				return currentCity.scores.nightlife >= 0.5;
			});
			orderDataByActivity.sort(function(a,b) {
				return  b.scores.nightlife - a.scores.nightlife;
			});
		}
		else if(userActivity === 'working') {
			orderDataByActivity = data.filter(function(currentCity) {
				return currentCity.scores.places_to_work >= 0.5;
			});
			orderDataByActivity.sort(function(a,b){
				return b.scores.places_to_work - a.scores.places_to_work;
			});
		}
		else if(userActivity === 'relaxing') {
			orderDataByActivity = data.filter(function(currentCity) {
				return currentCity.scores.leisure >= 0.5;
			});
			orderDataByActivity.sort(function(a,b){
				return b.scores.leisure - a.scores.leisure;
			});
		}
		return orderDataByActivity;
	})// End Activity Filter

	// DISPLAY DATA -----------------------------------------
	.then(function(data) {
		nomadApp.displayData(data);
	})
	
	.fail(function(error){
		console.log(error);
	});	
};

// DISPLAY DATA FUNCTION ------------------------------------
nomadApp.displayData = function(finalResult) {
	$('#result').empty();
	var myTemplate = $("#myTemplate").html();
	var template = Handlebars.compile(myTemplate);
	var wifi;
	finalResult.forEach(function(eachCity) {

		// WIFI SCORE
		wifi = (eachCity.scores.free_wifi_available * 100) + "%";
		console.log(wifi);
			$('.wifi').css("width", wifi);


		var finalTemplate = template(eachCity);
		$("#result").append(finalTemplate);

		wifi = null;

		// FRIENDLY SCORE 

		// SAFETY SCORE

		// var imageUrl = 'url(https://nomadlist.com' + eachCity.media.image['500'] + ')';

		// $('.cityOverlay').css('background-image', 'url(' + imageUrl + ')');
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