var changeWar;
var countryList=[];

var margin = {top: 50, right: 20, bottom: 50, left: 50},
    width_warLevel = 600 - margin.left - margin.right,
    height_warLevel = 270 - margin.top - margin.bottom;

queue()
.defer(d3.json, "data/war_level.json")
.await(input);
function input(error, a, b) {
    var warData = a;

    // Get the max value
    var warValues = [];
    warData.forEach(function(countryValue) {
        countryValue.value.forEach(function(closeValue) {
            warValues.push(closeValue.close);
        })
    })
    var warMax = d3.max(warValues);
    warMax = Math.round(warMax / 10) * 10;    // Rounding numbers to the nearest tens

    var parseDate = d3.time.format("%Y").parse;

    var x = d3.scale.linear().range([0, width_warLevel]).domain([1980, 2015]);
    var y = d3.scale.linear().range([height_warLevel, 0]).domain([0, warMax]);
    
    //check
    var valueline_war = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.close); })
    .interpolate("linear");

    var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(10).tickFormat(d3.format("d"));

    var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);

    svg_warlevel = d3.select("#warLevel").append("svg")
    .attr("width",width_warLevel+margin.right+margin.left)
    .attr("height", height_warLevel+margin.top+margin.bottom)

    var title1 = svg_warlevel.append("text")
    .text("War Level")
    .attr("x", width_warLevel/2+margin.left)
    .attr("y", height_warLevel-margin.bottom/2)
    .style("text-anchor", "middle")
    .style("font-size", 50)
    .style("fill", "lightgrey");

    var xLabel = svg_warlevel.append("text")
    .text("Years")
    .attr("x", width_warLevel)
    .attr("y", height_warLevel+margin.top+margin.bottom)
    .style("font-size", 20);

    var yLabel = svg_warlevel.append("text")
    .text("Total war levels per year")
    .attr("x", 10)
    .attr("y", 20)
    .style("font-size", 20);

    canvas = svg_warlevel.append("g")
    .attr("transform", "translate("+margin.left+","+margin.top+")")

    //add the x asix
    canvas.append("g")
    .attr("transform","translate(0,"+height_warLevel+")")
    .attr("id","Axis")
    .call(xAxis);

    //add the y asix
    canvas.append("g")
    .attr("id","Axis")
    .call(yAxis);

for(countryIdx in warData) {
    canvas
    .selectAll("war")
    .data(warData[countryIdx].value)
    .enter()
    .append("rect")
    .attr("x",function(d) {
        return x(d.date);
    })
    .attr("y",function(d){
        return height_warLevel-y(d.close);
    })
    .attr("width",10)
    .attr("height",function(d){
        return y(d.close);
    })
    .attr("id",function(d){
        return warData[countryIdx].name;
    })
    .attr("class","warLevel")
    .attr("stroke","blue")
    .style("fill", "none")
    .attr("visibility", function(d) {
        if(warData[countryIdx].name=="USA") {
            return "visibile";
        }
        else {return "hidden";}
    });
}

    // changeWar
    changeWar = function (country) {
        d3.selectAll(".warLevel")
        .attr("visibility", "hidden");

        d3.selectAll("#"+country)
        .attr("visibility", function(d) {
            if(d.name==country) {
                return "visibile";
            }
        });
    }
}
