
var svg = d3.select("svg#area")

var rescale = function(groupIndex) {
    var groupSize = _DATA[groupIndex].length;
    $('#group-size').text(groupSize);
    generateGraph(_DATA[groupIndex]);
}

var initSlider = function(data) {

    var min = 0;
    var max = data.length - 1;
        console.log("initSlider min:" + min + ", max:" + max);
    $('#slider').attr('min', min);
    $('#slider').attr('max', max);
}

var funcSort = function(a, b) {
  console.log("compare called a:" + JSON.stringify(a));
  return a.x < b.x ? a : b;
}

var calcCutoff = function(data) {
    var sum = 0.0;
    for(var i = 0; i < data.length; i++) {
        sum += data[i].y;

        if(sum >= 80) {
            return i;
        }
    }
    return i;
}

var generateGraph = function(data) {

    //data.sort(funcSort);

    d3.selectAll("svg > *").remove();
    var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 600 - margin.left - margin.right,
        height = 350 - margin.top - margin.bottom;

    var x = d3.scale.linear()
        .domain([1, d3.max(data, function(d){return d.x;})])
        .range([1, width]);

    var y = d3.scale.linear()
        .domain([0, d3.max(data, function(d){return d.y;})])
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .tickFormat(d3.format("d"))
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var area = d3.svg.area()
        .x(function(d) { return x(d.x); })
        .y0(height)
        .y1(function(d) { return y(d.y); });


    svg.attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(80," + (margin.top+10) + ")");

    svg.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("transform", "translate(40,10)")
        .attr("d", area);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(40," + (height+10) + ")")
        .call(xAxis)
        .append("text")
        .attr("y", 20)
        .attr("x", width/1.7)
        .attr("dy", "0.71em")
        .style("text-anchor", "end")
        .text("Member contribution rank");

    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(40,10)")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("x", -height/3)
        .attr("dy", "0.71em")
        .style("text-anchor", "end")
        .text("Percent message contribution");
;



    var rank = calcCutoff(data);
    var rankToX = function(rank) {
        return 40 + width / (d3.max(data, function(d) { return d.x; })) * rank;
    }

    console.log("rankToX(8) " + rankToX(8) + " maxX " + (d3.max(data, function(d) { return d.x; })))

    svg.append("line")
        .attr("x1", rankToX(rank))
        .attr("y1", 0)
        .attr("x2", rankToX(rank))
        .attr("y2", height + 8)
        .style("stroke", "black");
}


var slider = $('#slider');
slider.on("input change", function(){
    var val = $(this).val(); 
    rescale(val);   
});

initSlider(_DATA);
var data = _DATA[0];//generateData(7);
rescale(0);

