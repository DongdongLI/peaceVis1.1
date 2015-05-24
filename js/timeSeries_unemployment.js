var changeUnemployment;
var countryList=[];

var margin = {top: 50, right: 20, bottom: 50, left: 50},
    width_unemployment = 550 - margin.left - margin.right,
    height_unemployment = 270 - margin.top - margin.bottom;

queue()
.defer(d3.json, "data/unemployment.json")
.await(input);
function input(error, a) {
    var unemploymentData = a;

    // Get the max value
    var unemploymentValues = [];
    unemploymentData.forEach(function(countryValue) {
        countryValue.value.forEach(function(closeValue) {
            unemploymentValues.push(closeValue.close);
        })
    })
    var unemploymentMax = d3.max(unemploymentValues);
    unemploymentMax = Math.round(unemploymentMax / 10) * 10;    // Rounding numbers to the nearest tens

    var parseDate = d3.time.format("%Y").parse;

    var xx=d3.scale.linear().range([0,width_unemployment]).domain([1980,2015]);
    var yy=d3.scale.linear().range([height_unemployment,0]).domain([0, unemploymentMax]);

    var valueline_unemployment=d3.svg.line()
    .x(function(d) {return xx(d.date); })
    .y(function(d) {return yy(d.close); })

    var xxAxis=d3.svg.axis().scale(xx)
    .orient("bottom").ticks(10).tickFormat(d3.format("d"));

    var yyAxis=d3.svg.axis().scale(yy)
    .orient("left").ticks(5);

    svg_unemployment = d3.select("#unemployment").append("svg")
    .attr("width",width_unemployment+margin.right+margin.left)
    .attr("height", height_unemployment+margin.top+margin.bottom)

    var title1 = svg_unemployment.append("text")
    .text("Unemployment")
    .attr("x", width_unemployment/2+margin.left)
    .attr("y", height_unemployment-margin.bottom/2)
    .style("text-anchor", "middle")
    .style("font-size", 50)
    .style("fill", "lightgrey");

    var countryDisplay = "United States of America";
    var svg_display = d3.select("#display")
    .append("svg")
    .attr("width", 1000)
    .attr("height", 40);

    var title2 = svg_display.append("text")
    .text(countryDisplay)
    .attr("x", 600)
    .attr("y", 30)
    .style("text-anchor", "middle")
    .style("font-size", 40)
    .style("fill", "black");

    var xLabel = svg_unemployment.append("text")
    .text("Years")
    .attr("x", width_unemployment)
    .attr("y", height_unemployment+margin.top+margin.bottom)
    .style("font-size", 20);

    var yLabel = svg_unemployment.append("text")
    .text("Percentage")
    .attr("x", 10)
    .attr("y", 20)
    .style("font-size", 20);

    canvas = svg_unemployment.append("g")
    .attr("transform", "translate("+margin.left+","+margin.top+")")

    //add the x asix
    canvas.append("g")
    .attr("transform","translate(0,"+height_unemployment+")")
    .attr("id","Axis")
    .call(xxAxis);

    //add the y asix
    canvas.append("g")
    .attr("id","Axis")
    .call(yyAxis);

    //add line
    canvas
    .selectAll("unemployment")
    .data(unemploymentData)
    .enter()
    .append("path")
    .attr("d", function(d){
        return valueline_unemployment(d.value);
    })
    .attr("id",function(d){
        return d.name;
    })
    .attr("class","unemployment")
    .attr("stroke","blue")
    .style("fill", "none")
    .attr("visibility", function(d) {
        if(d.name=="USA") {
            return "visibile";
        }
        else {return "hidden";}
    });

    // changeUnemployment
    changeUnemployment = function (country) {
        d3.selectAll(".unemployment")
        .attr("visibility", "hidden");

        d3.selectAll("#"+country)
        .attr("visibility", function(d) {
            if(d.name==country) {
                return "visibile";
            }
        });
        title2.text(country);
    }
}
