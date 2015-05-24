var aggressCountries;
var country;
var allCountries = [];
var allAggressValues = [];
var maxAggressValue;
var minAggressValue;
var fillData={"defaultFill": "#b2d0b2"};
var country_color={};
var totalTooltip = 0;
var selectedCountry = "";
var selectedAbb = "";
var argString = "";

queue()
.defer(d3.json, "data/aggressCountries.json")
.defer(d3.json, "data/country_codes.json")
.await(input);
function input(error, a, b) {
	aggressCountries = a;
	country_codes = b;

	for (var country in aggressCountries) {
	    if (aggressCountries.hasOwnProperty(country)) {
	    	allCountries.push(country);
	    	allAggressValues.push(aggressCountries[country]);
	    }
	}
	maxAggressValue = d3.max(allAggressValues);
	minAggressValue = d3.min(allAggressValues);
	for (var country in aggressCountries) {
		if (aggressCountries.hasOwnProperty(country)) {
			fillData[country+"_color"] = "rgba(215, 40, 40, "+(aggressCountries[country]/maxAggressValue+0.05)+")";
			country_color[country] = {fillKey:country+"_color"};
		}
	}
	var map = new Datamap({
		element: document.getElementById("map"),
		fills: fillData,
		data: country_color,
		scope: "world",
		responsive: false,
		geographyConfig: {
			borderWidth: 0.5,
			highlightOnHover: true,
			highlightFillColor: "#6666b2",
			popupOnHover: true,
			highlightBorderColor: "#6666b2",
			highlightBorderWidth: 3,
			popupTemplate: function(geography, data) { //this function should just return a string
				totalTooltip = aggressCountries[country_codes[geography.properties.name]];
				if (typeof totalTooltip=="undefined") {totalTooltip = 0;}
				return "<div class='hoverinfo'><strong>"+geography.properties.name+"</br>"+"Total aggressions: "+totalTooltip+'</strong></div>';
			}
		}
	});

	$("#map").on('click', function(event, data) {
		argString = map.options.element.textContent;
		selectedCountry = argString.substring(argString.indexOf("#") + 1, argString.indexOf("Total"));
		selectedAbb = country_codes[selectedCountry];
		changeUnemployment(selectedCountry);
		changeWar(selectedAbb);
	});

}	// End of input queue

