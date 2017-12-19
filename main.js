// svg parameters

var svgHeight = 200;
var svgWidth = 500;

var dataD = [];

padding = {"bottom" : 40, "top" : 10, "right": 10, "left" :40};
paddingAxis = {"bottom": 15, "left": 15};

//svgPlotIFF -> svgPlot Incidents, Fatal accidents, Fatalities
d3.select("#scatterplot").append("svg").attr("id", "svgPlotIFF")
	.attr("height", svgHeight)
	.attr("width", svgWidth);


d3.csv("airline-safety.csv", function(error, data) { 
	if(error) throw error;

	console.log("d=" + data);
	dataD = data;

	var xExtent = d3.extent(data, function(d) { return parseInt(d.incidents_85_99) } );
	var yExtent = d3.extent(data, function(d) { return parseInt(d.fatal_accidents_85_99) } );
	var rExtent = d3.extent(data, function(d) {return parseInt(d.fatalities_85_99) } );
	var extent = d3.extent(data, function(d) { return parseInt(d.incidents_85_99) } )
	console.log("xExtent= " + xExtent + ", yExtent= " + yExtent);
	console.log("Extent =" + extent);

	var xScale = d3.scaleLinear().domain([xExtent[0], xExtent[1]]).range([0+padding.left, svgWidth-padding.right]);
	var yScale = d3.scaleLinear().domain([yExtent[0], yExtent[1]]).range([svgHeight-padding.bottom, 0+padding.top]);
	var rScale = d3.scaleSqrt().domain([rExtent[0], rExtent[1]]).range([4,10]);
	var colorScale = d3.scaleLinear().domain([rExtent[0], rExtent[1]]).range(['#fee5d9', '#a50f15']);

	// incidents vs fatalities , with radius size and color corresponding to the number of fatalities
	// To do -> create a brushing and resizeing of the axis for each of the points
	d3.select("#svgPlotIFF").selectAll("empty")
		.data(data)
		.enter()
		.append("g")
		.append("circle")
		.attr("cx", function(d) {
			return xScale(d.incidents_85_99);
		})
		.attr("cy", function(d) {
			return yScale(d.fatal_accidents_85_99);
		})
		.attr("r", function(d) {
			return rScale(d.fatalities_85_99);
		})
		.attr("fill", function(d) {
			return colorScale(d.fatalities_85_99);
		})
		.attr("stroke", "white")
		.attr("stroke-width", "1");

		// Axis
		var xAxis = d3.axisBottom().scale(xScale);
		d3.select("#svgPlotIFF").append("g")
			.attr("class", "xAxis")
			.attr("transform", "translate ( 0 " + (svgHeight - padding.bottom) + " ) " )
			.call(xAxis);

		d3.select("#svgPlotIFF").append("g")
			.attr("id", "xLabel")
			.append("text")
			.attr("x", padding.left+(svgWidth-padding.left-padding.right)/2 )
			.attr("y", (svgHeight-paddingAxis.bottom) )
			.attr("font-size", "10")
			.text("Incidents_85_99")

		var yAxis = d3.axisLeft().scale(yScale);
		d3.select("#svgPlotIFF").append("g")
			.attr("class", "yAxis")
			.attr("transform", "translate (" + padding.left + " 0)" )
			.call(yAxis);

		d3.select("#svgPlotIFF").append("g")
			.attr("id", "yLabel")
			.append("text")
			.attr("x", paddingAxis.left)
			.attr("y", svgHeight/2 )
			.attr("transform" , "rotate (-90 " + paddingAxis.left + ", " + (svgHeight/2) + ")" )
			.attr("font-size", "10")
			.text("Fatal Accidents");

});
