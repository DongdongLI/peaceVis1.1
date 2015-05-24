var plotNodes;
var width = 1000,
height = 1000;

var cluster = d3.layout.cluster()
.size([height, width - 500]);

var diagonal = d3.svg.diagonal()
.projection(function(d) { return [d.y, d.x]; });

// decisionTree

var svg = d3.select("#decisionTree").append("svg")
.attr("width", width)
.attr("height", height)
.append("g")
.attr("transform", "translate(210,0)");

d3.json("data/decision_tree.json", function(error, root) {
	var nodes = cluster.nodes(root),
	links = cluster.links(nodes);

	var link = svg.selectAll(".link")
	.data(links)
	.enter().append("path")
	.attr("class", "link")
	.attr("d", diagonal);

	var node = svg.selectAll(".node")
	.data(nodes)
	.enter().append("g")
	.attr("class", "decisionNodes")
	.attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

	node.append("circle")
	.attr("r", 4.5);

	plotNodes = function(countryPath) {
		console.log("countryPath", countryPath);
		
		node.append("circle")
		.attr("r", 4.5)
		.style("fill", "white");

		node.append("circle")
		.attr("r", 4.5)
		.style("fill", function(nodez) {
			console.log("nodez", nodez.node);
			for (obj in countryPath) {
				console.log("obj", countryPath[obj].node);
				if (countryPath[obj].node==nodez.node && countryPath[obj].value==nodez.value && countryPath[obj].is==nodez.is) {
					console.log("yes");
					return "black";
				}
			}
		})
		.attr("class", "decisionNodes");
	}

	node.append("text")
	.attr("dx", function(d) { return d.children ? -8 : 8; })
	.attr("dy", 3)
	.style("text-anchor", function(d) { return d.children ? "end" : "start"; })
	.text(function(d) { return d.node+"("+d.value+")"; });
});

d3.select(self.frameElement).style("height", height + "px");
