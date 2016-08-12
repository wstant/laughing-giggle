
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
    	$('.loading-screen').show();


		$('#loading-container').lazylinepainter('paint');

    	// Results container appears
		$('#result-container').fadeIn(0);

		userPrice = $('.costInput').val();
		userClimate = $('.climateInput').val();
		userActivity = $('.activityInput').val();
		nomadApp.getCities();

		// Loading Screen appears

	});
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
		$('.loading-screen').fadeOut(1000, function(){
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

	$('#loading-container').lazylinepainter({
		"svgData": pathObj,
		"strokeWidth": 2,
		"strokeColor": "white"
	})
};

// DOCUMENT READY ---------------------------------------
$(function() {
	nomadApp.init();
});



// --------- LOADING PAGE JS -----------
/* 
 * Lazy Line Painter - Path Object 
 * Generated using 'SVG to Lazy Line Converter'
 * 
 * http://lazylinepainter.info 
 * Copyright 2013, Cam O'Connell  
 *  
 */ 
 
var pathObj = {
    "loading-container": {
        "strokepath": [
            {
                "path": "M95.471,10.63c-3.25,0.343-5.307,4.639-3.593,7.381l7.362,12.534C16.069,81.703-11.826,190.553,37.116,275.707   c32.517,56.654,90.876,88.932,151.622,90.473v60.09h-62.466c-8.555,0-15.575,7.035-15.575,15.621   c-0.171,2.576,2.228,4.979,4.792,4.979s4.792-2.406,4.792-4.979c0-3.434,2.569-6.004,5.991-6.004h134.339   c3.422,0,6.164,2.576,6.164,6.004c-0.172,2.576,2.221,4.979,4.785,4.979c2.57,0,4.793-2.406,4.793-4.979   c0-8.578-7.014-15.621-15.742-15.621h-62.289v-60.09c27.553-0.678,55.447-7.895,81.287-21.805l7.189,12.705   c1.193,2.23,4.449,3.09,6.672,1.713c2.227-1.199,3.084-4.461,1.713-6.695l-8.555-14.762c-0.174-3.438-4.965-5.666-7.699-3.607   c-81.809,47.387-186.195,19.232-233.258-62.838C-1.563,188.649,26.332,83.931,108.132,36.55c2.742-1.555,3.257-5.845,1.028-7.901   l-8.898-15.453c-0.856-1.542-2.563-2.742-4.449-2.57C95.641,10.63,95.471,10.63,95.471,10.63L95.471,10.63z M189.937,47.37   c-4.105,0.171-8.383,0.514-12.49,1.034c-1.377,0.165-2.74,0.343-4.105,0.514c-2.742,0.343-5.654,0.857-8.39,1.542   c-2.734,0.514-5.479,1.2-8.042,1.891c-2.735,0.686-5.3,1.542-7.871,2.405c-1.028,0.349-2.056,0.863-3.078,1.199   c-0.687,0.343-1.37,0.521-2.05,0.863c-1.713,0.514-3.256,1.199-4.792,1.891c-1.536,0.692-3.25,1.371-4.963,2.228   c-0.685,0.171-1.199,0.686-1.886,1.028c-2.393,1.206-4.963,2.583-7.355,3.954c-2.05,1.193-3.936,2.228-5.99,3.599   c-0.172,0-0.172,0.178-0.344,0.349c-2.05,1.199-3.936,2.748-5.992,4.125c-1.535,1.193-3.25,2.405-4.792,3.599   c-0.343,0.349-0.685,0.52-0.856,0.863c-1.713,1.377-3.256,2.577-4.963,4.125c-1.027,1.028-2.228,1.891-3.25,2.919   c-0.685,0.685-1.198,1.199-1.885,1.891c-0.514,0.514-1.027,1.028-1.371,1.542c-1.541,1.377-2.742,2.926-4.105,4.469   c-1.021,1.193-2.051,2.404-3.078,3.433c-1.371,1.714-2.564,3.263-3.764,4.976c-0.172,0.172-0.344,0.515-0.508,0.687   c-0.515,0.687-1.028,1.377-1.543,2.056c-0.17,0.178-0.343,0.35-0.343,0.521c-30.294,42.57-34.915,100.602-7.19,148.843   c37.82,65.756,121.675,88.248,187.05,50.303c3.594-2.057,7.014-4.289,10.27-6.695c0.166,0,0.166-0.172,0.344-0.172   s0.17,0,0.342-0.164c0.172,0,0.35-0.172,0.35-0.35c0.166,0,0.344-0.166,0.516-0.166c1.535-1.205,2.906-2.232,4.449-3.439   c1.025-0.686,1.885-1.713,2.912-2.576c0.68-0.514,1.193-0.855,1.885-1.377c0.514-0.342,1.029-0.857,1.543-1.371   c0.855-0.863,1.879-1.719,2.734-2.576c0.68-0.686,1.535-1.377,2.223-2.063c2.057-2.063,4.277-4.291,6.328-6.695   c1.027-1.035,1.885-2.063,2.912-3.262c0.172-0.35,0.516-0.863,0.857-1.201c1.027-1.377,2.057-2.576,3.084-3.953   c0.164-0.172,0.342-0.344,0.514-0.686c1.193-1.543,2.395-3.09,3.422-4.805c1.199-1.547,2.229-3.262,3.25-4.975   c0.172-0.172,0.35-0.352,0.35-0.516c1.021-1.549,1.885-3.092,2.563-4.639c0.344-0.344,0.686-0.863,0.857-1.199   c0.686-1.201,1.369-2.578,1.885-3.955c0.35-0.686,0.855-1.377,1.199-1.891c0.516-1.199,0.857-2.229,1.371-3.434   c0.514-0.863,0.855-1.713,1.193-2.748c1.199-2.576,2.221-5.318,3.25-7.895c0.514-1.549,1.027-2.925,1.541-4.461   c0-0.349,0.172-0.862,0.344-1.198c0.348-1.201,0.686-2.578,1.027-3.777c0.172-0.686,0.344-1.198,0.514-1.891   c0.172-0.171,0.172-0.514,0.172-0.856c8.549-33.654,4.621-70.563-14.033-103.013c-16.432-28.672-41.586-49.101-70.338-59.92   c0,0-0.17-0.165-0.342-0.165c0,0,0,0-0.172,0c0,0,0,0,0-0.171c-0.17,0-0.342,0-0.514-0.171c-1.707-0.514-3.594-1.193-5.479-1.708   c-0.172-0.177-0.514-0.177-0.686-0.349c-1.885-0.514-3.764-1.206-5.648-1.72c-0.166,0-0.342,0-0.508-0.166   c-2.057-0.514-3.941-0.863-5.82-1.199c-2.057-0.521-4.277-0.863-6.506-1.377c-4.105-0.686-8.219-1.035-12.326-1.377   c-0.342,0-0.514-0.171-0.855-0.171l0,0c-2.223-0.165-4.277-0.343-6.506-0.343C194.38,47.37,192.16,47.37,189.937,47.37   L189.937,47.37z M190.103,56.99L190.103,56.99c3.084,0,6.162,0,9.07,0.166c0.17,0,0.342,0,0.514,0s0.172,0,0.342,0   c9.414,0.686,18.826,2.748,28.066,5.324c-14.033,9.786-29.438,21.806-40.729,35.875c-6.842,8.586-12.148,17.51-14.541,26.787   c-2.405,9.443-1.542,19.4,3.936,28.33c0.344,0.515,0.855,1.028,1.371,1.371c12.146,8.93,21.736,17.688,28.064,26.438   c6.336,8.58,9.242,16.995,8.729,25.753c-1.021,17.338-16.939,38.115-55.447,62.835c-3.084-0.344-9.412-3.949-15.918-11.158   c-7.014-7.725-14.375-18.539-19.854-30.221c-5.648-11.849-9.755-24.554-10.441-35.539c-0.855-10.82,1.543-19.743,7.705-25.747   c0.172-0.178,0.172-0.35,0.344-0.514c4.449-5.496,5.992-12.026,5.478-18.207c-0.514-6.182-3.077-12.186-6.848-17.682   c-6.334-9.613-16.083-17.857-26.353-24.382c7.185-9.266,15.568-17.853,25.324-25.067c0.171,0,0.344-0.166,0.514-0.166   c3.25-2.405,6.678-4.804,10.441-6.867c2.393-1.377,4.792-2.742,7.186-3.954c0.514-0.165,1.021-0.342,1.535-0.514   c1.885-1.028,3.936-1.891,5.82-2.748c1.027-0.514,2.057-0.857,3.078-1.193c1.371-0.692,2.906-1.206,4.283-1.72   c2.051-0.686,3.936-1.377,5.992-2.056c0.514-0.178,1.192-0.178,1.707-0.349c4.106-1.2,8.043-2.063,12.148-2.748   c2.05-0.343,4.105-0.68,6.162-0.863C181.89,57.669,185.996,57.156,190.103,56.99L190.103,56.99z M239.73,65.918   c26.018,10.123,48.947,28.837,64.174,55.276c15.74,27.644,20.197,58.715,14.721,87.729c-5.82-5.152-12.662-8.58-20.197-8.244   c-7.014,0.515-13.861,4.461-19.51,11.849c0,0.171-0.172,0.171-0.172,0.171c-10.092,14.248-20.195,26.781-36.795,28.158   c-0.686,0.164-1.541,0.344-2.055,0.857c-6.328,3.775-10.092,9.1-10.441,14.768c-0.344,5.668,2.398,10.984,6.162,15.625   c6.164,7.725,15.918,14.764,26.018,20.943c-1.543,1.033-2.912,1.893-4.455,2.746c-60.924,35.363-138.619,14.42-173.869-46.695   c-25.16-43.783-21.738-95.974,4.449-135.283c9.584,6.181,18.824,14.082,24.301,22.313c2.908,4.639,4.793,9.094,5.136,13.219   c0.343,3.947-0.687,7.553-3.593,11.334c-8.383,8.416-10.783,20.601-9.926,33.134c0.856,12.706,5.135,26.267,11.125,38.801   c5.992,12.533,13.69,24.033,21.562,32.621c7.698,8.58,15.403,14.934,24.131,14.934c0.856-0.172,1.708-0.35,2.394-0.863   c40.906-25.92,60.068-48.76,61.609-71.593c0.68-11.328-3.248-22.313-10.439-32.271c-7.014-9.608-17.111-18.538-29.096-27.296   c-4.105-6.701-4.619-13.219-2.734-20.6c1.885-7.387,6.334-15.281,12.662-23.011C206.878,89.61,224.845,75.528,239.73,65.918   L239.73,65.918z M298.775,210.467c5.479-0.343,11.635,3.776,16.947,9.793c-7.355,26.095-22.932,49.609-45.521,66.611   c-10.783-6.52-21.73-14.248-27.209-20.945c-2.906-3.773-4.105-6.699-3.936-8.758c0.164-2.063,1.193-4.289,5.477-7.037   c19.855-2.576,32.174-17.688,42.102-31.756C291.078,212.53,295.011,210.639,298.775,210.467L298.775,210.467z",
                "duration": 1800
            }
        ],
        "dimensions": {
            "width": 344,
            "height": 458
        }
    }
}; 
