
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

		// MONTHS TO VISIT 
		var goodMonths = eachCity.info.monthsToVisit.map(function(month) {
			if (month === 1) {
				month = 'January';
			}
			else if (month === 2) {
				month = 'February';
			}
			else if (month === 3) {
				month = 'March';
			} 
			else if (month === 4) {
				month = 'April';
			}
			else if (month === 5) {
				month = 'May';
			} 
			else if (month === 6) {
				month = 'June';
			}
			else if (month === 7) {
				month = 'July';
			}
			else if (month === 8) {
				month = 'August';
			}
			else if (month === 9) {
				month = 'September';
			}
			else if (month === 10) {
				month = 'October';
			}
			else if (month === 11) {
				month = 'November';
			}
			else if (month === 12) {
				month = 'December';
			}
			
		});

		// WIFI SCORE
		// wifi = (eachCity.scores.free_wifi_available * 100) + "%";
		// 	$('.wifi').css("width", wifi);
		Handlebars.registerHelper('percentage', function() {
			return eachCity.scores.free_wifi_available * 100;
		});

		var finalTemplate = template(eachCity);
		$("#result").append(finalTemplate);

		// FRIENDLY SCORE 

		// SAFETY SCORE
	});
};


// INITIALIZE -------------------------------------------
nomadApp.init = function(){
	nomadApp.userInput();
};

// DOCUMENT READY ---------------------------------------
$(function() {
	nomadApp.init();
	window.sr = ScrollReveal();
	sr.reveal('.city');
});