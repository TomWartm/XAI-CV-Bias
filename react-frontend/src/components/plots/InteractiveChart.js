import { useTheme } from "@mui/material/styles";
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { getFormLabelUtilityClasses } from "@mui/material";

export default function InteractiveChart({ data, filters, onCircleClick }) {
  const theme = useTheme();
  const svgRef = useRef();

  useEffect(() => {
    const MAX_OPACITY = "0.9"; // TODO: define in one of the two components only
    const MIN_OPACITY = "0.1";
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

    //setting up container
    const w = 750;
    const h = 450;
    const svg = d3
      .select(svgRef.current)
      .attr("width", w)
      .attr("height", h)
      .style("overflow", "visible")
      .style("margin-top", "100px");

    //set up scaling
    const xScale = d3.scaleLinear([-0.5, 0.5], [0, w]);
    const yScale = d3.scaleLinear([-1.5, 1.5], [h, 0]);

    //set up axes
    const xAxis = d3.axisBottom(xScale).ticks(10);
    const yAxis = d3.axisLeft(yScale).ticks(10);

    const getCircleColor = (value) => {
      if (value >= 0 && value <= 33) return theme.palette.error.main;
      if (value > 33 && value <= 66) return theme.palette.warning.main;
      if (value >= 66) return theme.palette.success.main;
    };

    const getCircleStrokeColor = (value) => {
      //return "#ffffff";
      if (value >= 0 && value <= 33) return theme.palette.error.dark;
      if (value > 33 && value <= 66) return theme.palette.warning.dark;
      if (value >= 66) return theme.palette.success.dark;
    };

    svg
      .append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + h / 2 + ")")
      .attr("opacity", 0) // hide  axis because of PCA
      .call(xAxis);

    svg
      .append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + w / 2 + ",0)")
      .attr("opacity", 0) // hide  axis because of PCA
      .call(yAxis);

    // set up axis labels (From when we had Qualifications x Bias plot)
    /*svg
      .append("text")
      .attr("x", w + 20)
      .attr("y", h / 2 + 5)
      .text("Bias")
      .on("mouseover", function (event, d) {
        tip
          .style("opacity", 1)
          .style("left", event.pageX + 25 + "px")
          .style("top", event.pageY - 150 + "px")
          .style("width", 250 + "px")
          .html(
            // add informations about the axis
            "<u>Information: </u> <br/>" +
              "A high value on the <b>Bias-axis</b> indicates that the person possesses a high sum of attributes that are considered <b>un-fair</b> and contribute positively towards the hiring decision. <br/>" +
              "i.e. people who may have benefited from your biases have positive Bias values, while people that may have suffered from your biases have a negative Bias values."
          );

        console.log("mouseover: Qulification Info");
      })
      .on("mouseout", function (event, d) {
        tip
          .style("opacity", 0)
          .style("left", 0 + "px") // little hack sth. the invisible element is for sure not clicked by acceident
          .style("top", 0 + "px");
        console.log("mouseout: Qulification Info");
      });

    svg
      .append("text")
      .attr("y", -20)
      .attr("x", w / 2 - 50)
      .text("Qualification")
      .on("mouseover", function (event, d) {
        tip
          .style("opacity", 1)
          .style("left", event.pageX + 25 + "px")
          .style("top", event.pageY - 150 + "px")
          .style("width", 250 + "px")
          .html(
            // add informations about the axis
            "<u>Information: </u> <br/>  A high value on the <b>Qualification-axis</b> indicates that the person possesses a high sum of attributes that are considered <b>fair</b> and contribute positively towards the hiring decision. "
          );

        console.log("mouseover: Qulification Info");
      })
      .on("mouseout", function (event, d) {
        tip
          .style("opacity", 0)
          .style("left", 0 + "px") // little hack sth. the invisible element is for sure not clicked by acceident
          .style("top", 0 + "px");
        console.log("mouseout: Qulification Info");
      });
      */

    // set up legend
    svg
      .append("circle")
      .attr("cx", 10)
      .attr("cy", -80)
      .attr("r", 5)
      .style("fill", theme.palette.success.main);
    svg
      .append("circle")
      .attr("cx", 10)
      .attr("cy", -60)
      .attr("r", 5)
      .style("fill", theme.palette.error.main);
    svg
      .append("text")
      .attr("x", 25)
      .attr("y", -80)
      .text("fair")
      .style("font-size", "15px")
      .attr("alignment-baseline", "middle");
    svg
      .append("text")
      .attr("x", 25)
      .attr("y", -60)
      .text("unfair")
      .style("font-size", "15px")
      .attr("alignment-baseline", "middle");

    // set up data
    var circles = svg
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("fill", function (d) {
        //return getCircleColor((d["ind-university_grade"] - 45) * 3); // I put grade temporarily to see how it will look. TODO: scale based on bias once we have PCA positions
        return getCircleColor((Math.abs(d.bias) * -1 + 1) * 100);
      })
      .attr("cx", function (d) {
        return xScale(d.bias_dimred_x / 4 - 0.1);
      })
      .attr("cy", function (d) {
        return yScale(d.bias_dimred_y);
      })
      .attr("r", (d) => Math.exp((1 / 5) * (d.qualification + 10))) // exp to make the radius vary more
      .attr("opacity", MAX_OPACITY)
      .style("cursor", "pointer")
      .style("stroke", function (d) {
        //return getCircleStrokeColor((d["ind-university_grade"] - 45) * 3); // I put grade temporarily to see how it will look. TODO: scale based on bias once we have PCA positions
        return getCircleStrokeColor((Math.abs(d.bias) * -1 + 1) * 100);
      })
      .call(
        d3
          .drag() // call specific function when circle is dragged
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      );

    ////////// filters ////////
    // Apply filters
    function ignore_point(d, filters) {
      // returns true if datapoint should be ignored, false otherwise
      if (d.gender === "male" && !filters.male) return true;
      if (d.gender === "female" && !filters.female) return true;
      if (d.gender === "other" && !filters.other) return true;
      if (d.nationality === "Dutch" && !filters.dutch) return true;
      if (d.nationality === "Belgian" && !filters.belgian) return true;
      if (d.nationality === "German" && !filters.german) return true;
      if (!(filters.ageValue[0] <= d.age && d.age <= filters.ageValue[1]))
        return true;
      if (d["ind-degree"] === "bachelor" && !filters.bachelor) return true;
      if (d["ind-degree"] === "master" && !filters.master) return true;
      if (d["ind-degree"] === "phd" && !filters.phd) return true;
      if (
        !(
          filters.gradeValue[0] <= d["ind-university_grade"] &&
          d["ind-university_grade"] <= filters.gradeValue[1]
        )
      )
        return true;
      if (
        !(
          filters.languagesValue[0] <= d["ind-languages"] &&
          d["ind-languages"] <= filters.languagesValue[1]
        )
      )
        return true;
      else return false;
    }

    d3.select(svgRef.current)
      .selectAll("circle")
      .filter(function (d) {
        if (d !== undefined) return d;
        else return false;
      })
      .filter(function (d) {
        if (ignore_point(d, filters))
          d3.select(this).attr("opacity", MIN_OPACITY);
        else d3.select(this).attr("opacity", MAX_OPACITY);
        return true;
      });

    /////////// D3 Forces ///////////

    const x = d3.scaleOrdinal().domain([1, 2, 3]).range([100, 600, 325]);
    function getForces(view) {
      //const strengthX = 0.3;
      //const strengthY = 0.1;
      const strengthX = 0.05;
      const strengthY = 0.05;
      if (view === "all") {
        return {
          x: d3
            .forceX()
            .strength(strengthX)
            .x((d) => xScale(d.bias_dimred_x / 4 - 0.1)),
          y: d3
            .forceY()
            .strength(strengthY)
            .y((d) => yScale(d.bias_dimred_y)),
        };
      } else if (view === "gender") {
        return {
          x: d3
            .forceX()
            .strength(strengthX)
            .x((d) => x(d.gender)),
          y: d3
            .forceY()
            .strength(strengthY)
            .y(h / 2),
        };
      } else if (view === "nationality") {
        return {
          x: d3
            .forceX()
            .strength(strengthX)
            .x((d) => x(d.nationality)),
          y: d3
            .forceY()
            .strength(strengthY)
            .y(h / 2),
        };
      } else if (view === "age") {
        return {
          x: d3
            .forceX()
            .strength(strengthX)
            .x((d) => x(d.age)),
          y: d3
            .forceY()
            .strength(strengthY)
            .y(h / 2),
        };
      }
      return null;
    }

    var force = getForces(filters.view);
    //var force = getForces("all");

    /*const testvar = filters.other
      ? d3
          .forceX()
          .strength(0.3)
          .x((d) => x(d.gender))
      : d3
          .forceX()
          .strength(0.3)
          .x((d) => x(1));*/

    const simulation = d3.forceSimulation();

    simulation
      .force(
        "x",
        force.x
        /*d3
          .forceX()
          .strength(0.3)
          .x((d) => x(d.gender))*/
      )
      .force("y", force.y)
      /*.force(
        "center",
        d3
          .forceCenter()
          .x(w / 2)
          .y(h / 2)
      ) // Attraction to the center of the svg area
      .force("charge", d3.forceManyBody().strength(1)) // Makes nodes attract each other*/
      .force(
        "collide", // Force that avoids circle overlapping
        d3
          .forceCollide()
          .strength(0.5)
          .radius((d) => Math.exp((1 / 5) * (d.qualification + 10)))
          .iterations(1)
      );

    // Apply these forces to the nodes and update their positions.
    // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
    simulation.nodes(data).on("tick", function (d) {
      circles.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
    });

    // What happens when a circle is dragged?
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.03).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }
    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0.03);
      d.fx = null;
      d.fy = null;
    }

    circles
      .on("mouseover", function (event, d) {
        tip
          .style("opacity", 1)
          .style("left", event.pageX - 25 + "px")
          .style("top", event.pageY - 85 + "px")
          .html(
            "<b>Bias:</b> " +
              d.bias.toPrecision(3) +
              "<br><b>Qualification:</b> " +
              d.qualification.toPrecision(3)
          );
        d3.select(this).attr("stroke", "black").style("stroke-width", 3);
        //console.log("mouseover", d);
      })
      .on("mouseout", function (event, d) {
        tip
          .style("opacity", 0)
          .style("left", 0 + "px") // little hack sth. the invisible element is for sure not clicked by acceident
          .style("top", 0 + "px");

        //console.log("mouseout", d);
        d3.select(this).attr("stroke", "none").style("stroke-width", 1);
      })
      .on("click", function (event, d) {
        this.props.onCircleClick(d.id);
      });

    return () => {
      //console.log("stopped");
      simulation.stop();
    };
  }, [data, filters]);

  return <svg ref={svgRef}></svg>;
}
