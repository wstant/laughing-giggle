
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
		console.log(filterDataByCost);
		return filterDataByCost;
	})
	// CLIMATE FILTER ---------------------------------------
	.then

	// MONTH FILTER -----------------------------------------
	.then 

	// ACTIVITY FILTER --------------------------------------
	.then 

	// DISPLAY DATA -----------------------------------------
	.then 
	
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



// LAZY LOAD CITIES ------------------------------------


// INITIALIZE -------------------------------------------
nomadApp.init = function(){
	nomadApp.getCities();
};

// DOCUMENT READY ---------------------------------------
$(function() {
	nomadApp.init();
});