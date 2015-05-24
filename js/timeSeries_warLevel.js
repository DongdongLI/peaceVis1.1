var countryList=[];
var changeWar;
var pathNodes;
// console.log("pathNodes", pathNodes);

var margin = {top: 50, right: 60, bottom: 50, left: 50},
    width_warLevel = 600 - margin.left - margin.right,
    height_warLevel = 270 - margin.top - margin.bottom;

queue()
.defer(d3.json, "data/war_level.json")
.defer(d3.json, "data/decision_tree.json")
.defer(d3.json, "data/pFeatures.json")
.await(input);
function input(error, a, b, c) {

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
    d3.selectAll(".pScatter").remove();
    pWar=predictWar(decision_tree, pFeatures, country);

    canvas
    .selectAll("predictiveBars")
    .data(pWar)
    .enter()
    .append("circle")
    .attr("cx", function(d) {return x(d.year)-5;})
    .attr("cy", function(d) {return py(d.state);})
    .attr("r", 5)
    .attr("class", "pScatter")
    .style("fill", function(d) {
        if (d.state=="War") return "red";
        else if (d.state=="Peace") return "#1464F4";
    })
    .on("click", function(d) {
        plotNodes(pathNodes[d.year]);
    });
    // console.log("pathNodes", pathNodes);
}
// predictWar
var predictWar = function(decision_tree, pFeatures, pCountry) {
    // Predict for each year if there is war or not
    pathNodes= {"2011": [], "2012": [], "2013": [], "2014": [], "2015": [], "2016": [], "2017": []};
    var pWar=[];
    var node;
    var compare;
    var feature;
    var chosen;
    var level;
    var numChildren;
    for (pYear=2011; pYear<2017; pYear++) {
        level=0;
        node = decision_tree;
        while (1) {
            level++;
            nodeValue = node.value;
            if (node.node=="Unemployment % labor force") feature=0;
            else if (node.node=="GDP per capita") feature=1;
            else if (node.node=="National revenue % GDP") feature=2;
            else if (node.node=="Gross national debt % GDP") feature=3;
            else if (node.node=="National expenditure % GDP") feature=4;
            if (nodeValue<parseInt(pFeatures[pCountry][pYear][feature])) compare=1;
            else if (nodeValue==parseInt(pFeatures[pCountry][pYear][feature])) compare=0;
            else if (nodeValue>parseInt(pFeatures[pCountry][pYear][feature])) compare=-1;
            numChildren=node.children.length;
            pathNodes[pYear].push(node);
            if (numChildren==0) {
                if (feature==0 || feature==3 || feature==4) {
                    if (pFeatures[pCountry][pYear][feature]>node.value) pWar.push({"year": pYear, "state": "War"});
                    else {pWar.push({"year": pYear, "state": "Peace"});}
                }
                else if (feature==1 || feature==2) {
                    if (pFeatures[pCountry][pYear][feature]<node.value) pWar.push({"year": pYear, "state": "War"});
                    else {pWar.push({"year": pYear, "state": "Peace"});}
                }
                break;
            }
            if (numChildren==1) {
                node=node.children[0];
            }
            if (numChildren==2) {
                if (compare<=0) {   // smaller
                    node.children.forEach(function(child) {
                        if (child.is=="smaller") {
                            node=child;
                        }
                    })
                }
                else if (compare>0) {   // greater
                    node.children.forEach(function(child) {
                        if (child.is=="greater") {
                            node=child;
                        }
                    })
                }
            }
            // Safety to exit
            if (level>=10) {
                break;
            }
        }
    }
    return pWar;
}   // end of predictWar function
 
    var warData = a;
    var decision_tree = b;
    var pFeatures=c;

    var pCountry="USA";
    var pWar = predictWar(decision_tree, pFeatures, pCountry);
    // plotNodes();

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

    var x = d3.scale.linear().range([5, width_warLevel+5]).domain([1980, 2017]);
    var y = d3.scale.linear().range([0, height_warLevel]).domain([0, warMax]);
    var yy = d3.scale.linear().range([height_warLevel, 0]).domain([0, warMax]);
    var py = d3.scale.ordinal().range([height_warLevel-50, 50]).domain(["Peace", "War"]);

    var xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(10).tickFormat(d3.format("d"));
    var yAxis = d3.svg.axis().scale(yy).orient("left").ticks(5);
    var pyAxis = d3.svg.axis().scale(py).orient("right");

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
    .attr("transform", "translate("+margin.left+","+margin.top+")");

    canvas.append("g")
    .attr("transform","translate(0,"+height_warLevel+")")
    .attr("id","Axis")
    .call(xAxis);

    canvas.append("g")
    .attr("id","Axis")
    .call(yAxis);

    canvas.append("g")
    .attr("id","Axis")
    .attr("transform", "translate(" + (width_warLevel+10) + ",0)")
    .call(pyAxis);

    canvas
    .selectAll("predictiveBars")
    .data(pWar)
    .enter()
    .append("circle")
    .attr("cx", function(d) {return x(d.year)-5;})
    .attr("cy", function(d) {return py(d.state);})
    .attr("r", 5)
    .attr("class", "pScatter")
    .style("fill", function(d) {
        if (d.state=="War") return "red";
        else if (d.state=="Peace") return "#1464F4";
    })
    .on("click", function(d) {
        console.log("pathNodes[d.year]", pathNodes[d.year]);
        plotNodes(pathNodes[d.year]);
    });

    for(countryIdx in warData) {
        canvas
        .selectAll("war")
        .data(warData[countryIdx].value)
        .enter()
        .append("rect")
        .attr("x",function(d) {return x(d.date)-5;})
        .attr("y",function(d){return height_warLevel-y(d.close);})
        .attr("width",10)
        .attr("height",function(d){return y(d.close);})
        .attr("id",function(d){return warData[countryIdx].name;})
        .attr("class","warLevel")
        .attr("stroke","blue")
        .style("fill", "none")
        .attr("visibility", function(d) {
            if(warData[countryIdx].name=="USA") {return "visibile";}
            else {return "hidden";}
        });
    }
}
