
// ---------- SCRIPTS ------------

var nomadApp = {};
nomadApp.apiUrl = 'https://nomadlist.com/api/v2/list/cities';

// User Input --------------------------------------------


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
	// .then

	// ACTIVITY FILTER --------------------------------------
	.then(function(data){
		var orderDataByActivity = data;
		if(userActivty === 'partying'){
			orderDataByActivity.sort(function(a,b) {
				return  b.scores.nightlife - a.scores.nightlife;
			});
		} 
		else if(userActivty === 'working') {
			orderDataByActivity.sort(function(a,b){
				return b.scores.places_to_work - a.scores.places_to_work;
			});
		}
		else if(userActivty === 'relaxing') {
			orderDataByActivity.sort(function(a,b){
				return b.scores.leisure - a.scores.leisure;
			});
		}
		console.log('if statement finished');
		
		})// End Activity Filter

	// DISPLAY DATA -----------------------------------------
	// .then 
	
	.fail(function(error){
		console.log(error);
	});	
};

// LAZY LOAD CITIES ------------------------------------


// INITIALIZE -------------------------------------------
nomadApp.init = function(){
	nomadApp.getCities();
};

// DOCUMENT READY ---------------------------------------
$(function() {
	nomadApp.init();
});