
// ---------- SCRIPTS ------------

var nomadApp = {};
nomadApp.apiUrl = 'https://nomadlist.com/api/v2/list/cities';

// User Input --------------------------------------------
var userPrice = "expensive";


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
		console.log(filterDataByCost);
		return filterDataByCost;
		
	})
	.fail(function(error){
		console.log(error);
	});	
};


// .then(data => {
// 	return filterDataByCost(data, userCostFilterParams);
// })
// .then(data => {
// 	return filterDataByClimate(data, userClimateFilterParams);
// })
// .then(data => {
// 	return filterDataByMonths(data, userMonthsFilterParams);
// })
// .then(data => {
// 	return filterDataByActivity(data, userActivityFilterParams);
// })
// .then(data => {
// 	displayData(data);
// });


// PRICE FILTER -----------------------------------------





// nomadApp.price = function(citiesResult) {
//     var userPrice = ;
//     if ()
//     citiesResult.forEach(function(city){
//     	if( city < )
//     });

//     citiesByPrice =//whatever we've filtered}
// 	nomadApp.climate();
// }

// CLIMATE FILTER ---------------------------------------

nomadApp.climate = function(priceResult) {

}

// MONTH FILTER -----------------------------------------

nomadApp.month = function(climateResult) {

}

// ACTIVITY FILTER -------------------------------------

nomadApp.activity = function(monthResult) {

}

// DISPLAY CITIES --------------------------------------


// LAZY LOAD CITIES ------------------------------------


// INITIALIZE -------------------------------------------
nomadApp.init = function(){
	// $.when(nomadApp.getCities())
	// 	.then(function(nomadCities) {
	// 	nomadApp.cities = nomadCities;
		
	// 	.fail(function(error){
	// 		console.log(error);
	// 	})

	nomadApp.getCities();
	// var bunchacities = nomadApp.getCities();
	// console.log(nomadApp.cities);
};




// DOCUMENT READY ---------------------------------------
$(function() {
	nomadApp.init();
});