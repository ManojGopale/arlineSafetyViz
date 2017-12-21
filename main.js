// svg parameters

var svgHeight = 200;
var svgWidth = 500;

var dataD = [];

padding = {"bottom" : 40, "top" : 10, "right": 10, "left" :40};
paddingAxis = {"bottom": 15, "left": 15};

// For brushing back to original size
//var xExtent, yExtent;

//svgPlotIFF -> svgPlot Incidents, Fatal accidents, Fatalities
var svg = d3.select("#scatterplot").append("svg").attr("id", "svgPlotIFF")
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

	var brush = d3.brush().on("end", brushend);
	
	d3.select("#svgPlotIFF").append("g").attr("class", "brush").call(brush);

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

	// function brushend
	// Need to be inside the csv call, for preserving the scope of xExtent and yExtent
	function brushend() {
		if(!d3.event.sourceEvent) return;
		eventt = d3.event.sourceEvent;
		console.log ("eventt= " + eventt);
		//debugger;
		s = d3.event.selection;
		if (!s) {
			console.log ("No Selection");
			console.log("xExtent= " + xExtent);
			
			// Going back to original domain when nothing is selected
			xScale.domain(xExtent);
			yScale.domain(yExtent);
		} else {
			console.log("s= " + s +", s[0]= " + s[0] + ", s[1]= " + s[1] + " , this= " + this);
			var x0 = xScale.invert(s[0][0]);
			var y0 = yScale.invert(s[0][1]);
		
			var x1 = xScale.invert(s[1][0]);
			var y1 = yScale.invert(s[1][1]);
		
			console.log("x0= " + x0 + ", x1= " + x1 + ", y0= " + y0 + ", y1= " + y1);
		
			// New domain after brushing to zoom in to these points
			xScale.domain([x0, x1]);
			yScale.domain([y1, y0]);
		}

		// Zoom to the new domain
		zoom();
		//debugger;

		// ** Cant get the brush to deselect, gives d3 call stack size exceeded, 
		// check https://github.com/d3/d3-brush/issues/10 
		// and https://github.com/d3/d3-brush/issues/9
		// example https://bl.ocks.org/mbostock/f48fcdb929a620ed97877e4678ab15e6
		// brush events https://bl.ocks.org/mbostock/15a9eecf0b29db92f12ca823cfbbce0a

		//svg.select(".brush").call(brush.move, null);
	}

	function zoom() {
		var t = svg.transition().duration(750);
		svg.select(".xAxis").transition(t).call(xAxis);
		svg.select(".yAxis").transition(t).call(yAxis);

		svg.selectAll("circle").transition(t)
			.attr("cx", function(d) {
				return xScale(d.incidents_85_99);
			})
			.attr("cy", function(d) {
				return yScale(d.fatal_accidents_85_99);
			});
		//debugger;
		//svg.select(".brush").call(brush.move, null);
	}

});
