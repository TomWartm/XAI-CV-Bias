import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";

ScatterPlot.propTypes = {
  data: PropTypes.array.isRequired,
};

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

    // set up data
    svg
      .selectAll()
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d[0]))
      .attr("cy", (d) => yScale(d[1]))
      .attr("r", 2);
  }, [data]);
  return (
    <div className="scatterPlot">
      <svg ref={svgRef}></svg>
    </div>
  );
}
export default ScatterPlot;
