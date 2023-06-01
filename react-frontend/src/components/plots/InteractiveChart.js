import { useTheme } from "@mui/material/styles";
import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { floor } from "lodash";

export default function InteractiveChart({
  data,
  filters,
  onCircleClick,
  onCircleMouseover,
}) {
  const [renderCount, setRenderCount] = useState(0);
  const theme = useTheme();
  const svgRef = useRef();
  //const simulationRef = useRef();

  let simulationRef = useRef(d3.forceSimulation());

  useEffect(() => {
    if (data.length > 0) {
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
        .style("padding", "10px")
        .style("pointer-events", "none");

      //console.log(svgRef.current.offsetHeight);
      //setting up container
      const w = 950;
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
        if (value <= 33) return theme.palette.error.main; // Some points have negative value smh
        if (value > 33 && value <= 66) return theme.palette.warning.main;
        if (value >= 66) return theme.palette.success.main;
      };

      const getCircleStrokeColor = (value) => {
        //return "#ffffff";
        if (value <= 33) return theme.palette.error.dark;
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

      /////
      svg
        .append("text")
        .attr("x", 13)
        .attr("y", -80)
        .text("Fairness:")
        .style("font-size", "15px")
        .attr("alignment-baseline", "middle")
        .style("font-family", theme.typography.fontFamily)
        .attr("fill", theme.palette.text.secondary);
      svg
        .append("circle")
        .attr("cx", 175)
        .attr("cy", -80)
        .attr("r", 7)
        .attr("opacity", MAX_OPACITY)
        .attr("stroke", theme.palette.success.dark)
        .style("fill", theme.palette.success.main);
      svg
        .append("circle")
        .attr("cx", 150)
        .attr("cy", -80)
        .attr("r", 7)
        .attr("opacity", MAX_OPACITY)
        .attr("stroke", theme.palette.warning.dark)
        .style("fill", theme.palette.warning.main);
      svg
        .append("circle")
        .attr("cx", 125)
        .attr("cy", -80)
        .attr("r", 7)
        .attr("opacity", MAX_OPACITY)
        .attr("stroke", theme.palette.error.dark)
        .style("fill", theme.palette.error.main);
      svg
        .append("text")
        .attr("x", 13)
        .attr("y", -50)
        .text("Qualification:")
        .style("font-size", "15px")
        .attr("alignment-baseline", "middle")
        .style("font-family", theme.typography.fontFamily)
        .attr("fill", theme.palette.text.secondary);
      svg
        .append("circle")
        .attr("cx", 175)
        .attr("cy", -50)
        .attr("r", 10)
        .attr("opacity", MAX_OPACITY)
        .attr("stroke", theme.palette.grey[500])
        .style("fill", theme.palette.grey[400]);
      svg
        .append("circle")
        .attr("cx", 150)
        .attr("cy", -50)
        .attr("r", 7)
        .attr("opacity", MAX_OPACITY)
        .attr("stroke", theme.palette.grey[500])
        .style("fill", theme.palette.grey[400]);
      svg
        .append("circle")
        .attr("cx", 125)
        .attr("cy", -50)
        .attr("r", 4)
        .attr("opacity", MAX_OPACITY)
        .attr("stroke", theme.palette.grey[500])
        .style("fill", theme.palette.grey[400]);

      // Add cluster labels
      const x = d3.scaleOrdinal().domain([1, 2, 3]).range([200, 500, 800]);
      var text1, text2, text3;
      if (filters.view === "gender") {
        text1 = "Male";
        text2 = "Female";
        text3 = "Other";
      } else if (filters.view === "nationality") {
        text1 = "Dutch";
        text2 = "German";
        text3 = "Belgian";
      } else if (filters.view === "age") {
        text1 = "21-24 y/o";
        text2 = "25-28 y/o";
        text3 = "29-32 y/o";
      }

      const textLeft = svg
        .append("text")
        .attr("x", x(1))
        .attr("y", h / 2)
        .text(text1)
        .style("font-size", "20px")
        .style("font-weight", "bold")
        .style("font-family", theme.typography.fontFamily)
        .attr("stroke", theme.palette.grey[500])
        .style("stroke-width", 0.5)
        .attr("text-anchor", "middle")
        .attr("fill", theme.palette.grey[200]);
      const textMid = svg
        .append("text")
        .attr("x", x(2))
        .attr("y", h / 2)
        .text(text2)
        .style("font-size", "20px")
        .style("font-weight", "bold")
        .style("font-family", theme.typography.fontFamily)
        .attr("stroke", theme.palette.grey[500])
        .style("stroke-width", 0.5)
        .attr("text-anchor", "middle")
        .attr("fill", theme.palette.grey[200]);
      const textRight = svg
        .append("text")
        .attr("x", x(3))
        .attr("y", h / 2)
        .text(text3)
        .style("font-size", "20px")
        .style("font-weight", "bold")
        .style("font-family", theme.typography.fontFamily)
        .attr("stroke", theme.palette.grey[500])
        .style("stroke-width", 0.5)
        .attr("text-anchor", "middle")
        .attr("fill", theme.palette.grey[200]);

      // set up data
      var circles = svg
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("fill", function (d) {
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

      function getForces(view) {
        const strengthX = 0.05;
        const strengthY = 0.05;
        if (view === "all") {
          console.log("All view");
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
              .x((d) => {
                let bin = floor((d.age - 21) / 4)
                return x(bin + 1)
              }),
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
      
      let simulation = simulationRef.current;
      //if (simulationRef.current) {
      // Stop previous simulation
      //  simulationRef.current.stop();
      //simulationRef.current.restart();
      //}
      

      simulation
        .force("x", force.x)
        .force("y", force.y)
        //.force("charge", d3.forceManyBody().strength(1)) // Makes nodes attract each other
        .force(
          "collide", // Force that avoids circle overlapping
          d3
            .forceCollide()
            .strength(0.5)
            .radius((d) => Math.exp((1 / 5) * (d.qualification + 10)))
            .iterations(1)
        )
        .on("end", () => {
          // Animation is complete, but keep simulation running
          console.log("Simulation's animation ended");
          //simulation.alpha(1).restart();
        });
      // Apply these forces to the nodes and update their positions.
      // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
      if(simulation.nodes().length === 0) {
        simulation.nodes(data).on("tick", function (d) {
          circles.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
        });
      }

      simulation.alpha(1).restart()

      //simulationRef.current = simulation;

      // What happens when a circle is dragged?
      function dragstarted(event, d) {
        console.log("Drag started");
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

      ////// Hovering over //////////
      let age_categories = {
        low: [21, 22, 23, 24],
        medium: [25, 26, 27, 28],
        high: [29, 30, 31, 32],
      };
      //console.log(age_categories);
      const get_age_category = (age) => {
        if (age_categories.low.includes(age)) {
          return "21-24";
        } else if (age_categories.medium.includes(age)) {
          return "25-28";
        } else if (age_categories.high.includes(age)) {
          return "29-32";
        }
      };
      function same_age_category(age1, age2) {
        if (
          age_categories.low.includes(age1) &&
          age_categories.low.includes(age2)
        )
          return true;
        else if (
          age_categories.medium.includes(age1) &&
          age_categories.medium.includes(age2)
        )
          return true;
        else if (
          age_categories.high.includes(age1) &&
          age_categories.high.includes(age2)
        )
          return true;
        else return false;
      }

      function same_cluster(view, d1, d2) {
        if (view === "all") {
          if (
            d1.gender === d2.gender &&
            d1.nationality === d2.nationality &&
            same_age_category(d1.age, d2.age)
          ) {
            return true;
          } else return false;
        } else if (view === "gender") {
          // this doesn't get reached now, because states are not cahnged correctly
          if (d1.gender === d2.gender) {
            return true;
          } else return false;
        } else if (view === "nationality") {
          if (d1.nationality === d2.nationality) {
            return true;
          } else return false;
        } else if (view === "age") {
          if (same_age_category(d1.age, d2.age)) {
            return true;
          } else return false;
        } else return false;
      }
      //console.log("states:", filters);
      circles
        .on("mouseover", function (event, d) {
          /* tip
          .style("opacity", 1)
          .style("left", event.pageX - 25 + "px")
          .style("top", event.pageY - 50 + "px")
          .html("<b>Person:</b> " + d.id); */

          //console.log(filters.view);
          circles.attr("stroke", "black").style("stroke-width", (d2) => {
            if (same_cluster(filters.view, d, d2)) {
              return 5;
            } else {
              return 1;
            }
          });

          svg
            .append("text")
            .attr("id", "highlighted-text")
            .attr("x", 13)
            .attr("y", -20)
            .style("font-size", "15px")
            .attr("alignment-baseline", "middle")
            .style("font-family", theme.typography.fontFamily)
            .attr("fill", theme.palette.text.secondary)
            .text("Highlighted: ")
            .append("tspan")
            .style("font-size", "15px")
            .attr("alignment-baseline", "middle")
            .style("font-family", theme.typography.fontFamily)
            .attr("fill", theme.palette.text.primary)
            .text(function () {
              return (
                d.gender + ", " + d.nationality + ", " + get_age_category(d.age)
              );
            });
        })
        .on("mouseout", function (event, d) {
          tip.style("opacity", 0);
          //console.log("mouseout", d);
          //d3.select(this).attr("stroke", "none").style("stroke-width", 1);
          circles.attr("stroke", "none").style("stroke-width", 1);
          svg.select("#highlighted-text").remove();
        })
        .on("click", function (event, d) {
          onCircleClick(d.id);
        })
        .on("mouseover", function (event, d) {
          onCircleMouseover(d.id);
        })
        .on("mouseout", function (event, d) {
          onCircleMouseover(null);
        });

      setRenderCount((prevCount) => prevCount + 1);
      //simulation.restart();
      return () => {
        // first call of useEffect happends without the data.
        // Everytime I change the view, the filters change, and this unmount is called for the previous effect
        console.log("Simulation stopped");
        simulation.stop();

        textLeft.remove();
        textMid.remove();
        textRight.remove();
      };
    }
  }, [data, filters, theme]);

  return <svg ref={svgRef}></svg>;
}
