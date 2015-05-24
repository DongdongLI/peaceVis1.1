    var svg = d3.select("#timeSeries").append("svg")
    .attr("width",width+margin.right+margin.left)
    .attr("height", height+margin.top+margin.bottom)

    var canvas = svg.append("g")
    .attr("transform", "translate("+margin.left+","+margin.top+")")

    //add the x asix
    canvas.append("g")
    .attr("transform","translate(0,"+height+")")
    .attr("id","Axis")
    .call(xAxis);

    //add the y asix
    canvas.append("g")
    .attr("id","Axis")
    .call(yAxis);

    //add line
    war = canvas
    .selectAll("war")
    .data(warData)
    .enter()
    .append("path")
    .attr("d", function(d){
            return valueline(d.value);
    })
    .attr("id",function(d){
        return d.name;
    })
    .attr("class","war_level")
    .attr("stroke","blue")
    .style("fill", "none")
    .style("visibility", function(d) {
        if(d.name=="United States") {
            return "visibile";
        }
        else {return "hidden";}
    });
