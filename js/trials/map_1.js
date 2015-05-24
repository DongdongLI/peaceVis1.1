var data;
var country;
var allCountries = [];
var allAggressValues = [];
var maxAggressValue;
var minAggressValue;
var fillData={"defaultFill": "lightgrey"};
var country_color={};

queue()
.defer(d3.json, "data/aggressCountries.json")
.defer(d3.json, "data/country_codes.json")
.await(input);
function input(error, a, b) {
	data = a;
	country_codes = b;
	console.log("data", data);
	// var selected = getData(country_codes, 'name', 'Yemen');
	// console.log("selected", selected);

	for (var country in data) {
	    if (data.hasOwnProperty(country)) {
	    	allCountries.push(country);
	    	allAggressValues.push(data[country]);
	    }
	}
	maxAggressValue = d3.max(allAggressValues);
	minAggressValue = d3.min(allAggressValues);
	for (var country in data) {
		if (data.hasOwnProperty(country)) {
			fillData[country+"_color"] = "rgba(215, 40, 40, "+(data[country]/maxAggressValue+0.05)+")";
			country_color[country] = {fillKey:country+"_color"};
		}
	}
	var map = new Datamap({
		element: document.getElementById('container'),
		fills: fillData,
		data: country_color,
		geographyConfig: {
			highlightOnHover: true,
			popupOnHover: true
		}
	});
	// map labels
    // map.labels();
    
	$("#container").on('click', function(event, data) {
		// data.geography is the geoJSON
		console.log("map.options.element.textContent", map.options.element.textContent);
		var C = map.options.element.textContent;
		var selected = getData(country_codes, "name", map.options.element.textContent);
		console.log("selected", selected);	// .options.element.textContent
		// alerts "CA" if you clicked California
		// 
		// data.data is the data you passed in to render the map, so in the ch
		// alert(data.data.electoralVotes);
		// alerts 32 if you clicked California
	});

    // console.log("map", map);

}	// End of input queue

function getData(array, type, val) {
  return array.filter(function (el) {
    return el[type] === val;
  });
}
