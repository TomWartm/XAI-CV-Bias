import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";

ScatterPlot.propTypes = { data: PropTypes.array };

function ScatterPlot({ data }) {
  const svgRef = useRef();
  useEffect(() => {
    //setting up container
    const w = 400;
    const h = 300;
    const svg = d3
      .select(svgRef.current)
      .attr("width", w)
      .attr("height", h)
      .style("overflow", "visible")
      .style("margin-top", "100px");
    //set up scaling
    const xScale = d3.scaleLinear([-10, 10], [0, w]);
    const yScale = d3.scaleLinear([-10, 10], [h, 0]);

    //set up axes
    const xAxis = d3.axisBottom(xScale).ticks(10);
    const yAxis = d3.axisLeft(yScale).ticks(10);
    svg
      .append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + h / 2 + ")")
      .call(xAxis);
    svg
      .append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + w / 2 + ",0)")
      .call(yAxis);

    // set up axis labels
    svg
      .append("text")
      .attr("x", w + 10)
      .attr("y", h / 2 + 5)
      .text("Bias");
    svg
      .append("text")
      .attr("y", -10)
      .attr("x", w / 2 - 50)
      .text("Qualification");
    //create tooltip

    var tip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("background-color", "white")
      .style("position", "absolute")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px");

    // set up data
    var circles = svg
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", function (d) {
        return xScale(d.bias);
      })
      .attr("cy", function (d) {
        return yScale(d.qualification);
      })
      .attr("r", 10);

    circles
      .on("mouseover", function (event, d) {
        tip
          .style("opacity", 1)
          .style("left", event.pageX - 25 + "px")
          .style("top", event.pageY - 75 + "px")
          .html("Bias: " + d.bias + "<br>Qualification: " + d.qualification);
        d3.select(this).attr("opacity", 0.5);
        console.log("mouseover", d);
      })
      .on("mouseout", function (event, d) {
        tip
          .style("opacity", 0)
          .style("left", 0 + "px") // little hack sth. the invisible element is for sure not clicked by acceident
          .style("top", 0 + "px");
        console.log("mouseout", d);
        d3.select(this).attr("opacity", 1);
      });
  }, [data]);
  return (
    <div className="scatterPlot">
      <svg ref={svgRef}></svg>
    </div>
  );
}
export default ScatterPlot;
