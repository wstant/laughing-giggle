
// ---------- SCRIPTS ------------

var nomadApp = {};
nomadApp.apiUrl = 'https://nomadlist.com/api/v2/list/cities';

nomadApp.months = {
	'1': ' January',
	'2': ' February',
	'3': ' March',
	'4': ' April',
	'5': ' May',
	'6': ' June',
	'7': ' July',
	'8': ' August',
	'9': ' September',
	'10': ' October',
	'11': ' November',
	'12': ' December'
}

// User Input --------------------------------------------

var userPrice;
var userClimate;
var userActivity;

nomadApp.userInput = function() {
	$('#nomadForm').on('submit', function(e) {
		e.preventDefault();
		$('#result').empty();
		userPrice = $('.costInput').val();
		userClimate = $('.climateInput').val();
		userActivity = $('.activityInput').val();
		nomadApp.getCities();
		// Loading Screen appears
    	$('.loading-screen').fadeIn(0);
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

		// Loading Screen fades out
		$('.loading-screen').fadeOut(10000, function(){
			$.smoothScroll({
				scrollTarget:"#result-container"
			});
		});
      

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
	
	var myTemplate = $("#myTemplate").html();
	var template = Handlebars.compile(myTemplate);
	var wifi;


	// Displays first 10 objects in array
	nomadApp.splicedData = finalResult.splice(0,10);
	nomadApp.currentData = finalResult;


	nomadApp.splicedData.forEach(function(eachCity) {



		// MONTHS TO VISIT 

		var goodMonths = eachCity.info.monthsToVisit.map(function(month) {
			return nomadApp.months[month];
		});

		Handlebars.registerHelper('months', function() {
			return goodMonths;
		});




		// WIFI SCORE

		Handlebars.registerHelper('percentage', function() {
			return eachCity.scores.free_wifi_available * 100;
		});

		// FRIENDLY SCORE
		Handlebars.registerHelper('friendly', function() {
			return eachCity.scores.friendly_to_foreigners * 100;
		}); 

		// SAFETY SCORE
		Handlebars.registerHelper('safety', function() {
			return eachCity.scores.safety * 100;
		}); 
		
		var finalTemplate = template(eachCity);
		$("#result").append(finalTemplate);
	});

};


$('.see_more').on('click', function() {
	nomadApp.displayData(nomadApp.currentData);
});


// INITIALIZE -------------------------------------------
nomadApp.init = function(){
	nomadApp.userInput();
};

// DOCUMENT READY ---------------------------------------
$(function() {
	nomadApp.init();
});