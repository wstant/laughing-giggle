
// ---------- SCRIPTS ------------

var nomadApp = {};
nomadApp.apiUrl = 'https://nomadlist.com/api/v2/list/cities';

// API CALL --------------------------------------------

nomadApp.getCities = function() {
	  $.ajax({
		url: nomadApp.apiUrl,
		method: 'GET',
		dataType: 'json'
	}).then(function(nomadCities) {
		nomadApp.cities = nomadCities;
		
	})
		.fail(function(error){
			console.log(error);
		});	
};

// PRICE FILTER -----------------------------------------

nomadApp.price = function(citiesResult) {
    var userPrice = ;
    if ()
    citiesResult.forEach(function(city){
    	if( city < )
    });

    citiesByPrice =//whatever we've filtered}
	nomadApp.climate();
}

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