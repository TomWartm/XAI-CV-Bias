import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";
import {
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  Divider,
  Box,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { PersonProfile } from "../popup";

ScatterPlot.propTypes = { data: PropTypes.array };

function ScatterPlot({ data }) {
  const svgRef = useRef();
  useEffect(() => {
    //setting up container
    const w = 500;
    const h = 400;
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
      .attr("fill", function (d) {
        return d.decision === true ? "rgb(51, 153, 51)" : "rgb(204, 0, 0)";
      })
      .attr("cx", function (d) {
        return xScale(d.bias);
      })
      .attr("cy", function (d) {
        return yScale(d.qualification);
      })
      .attr("r", 5);

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
      })
      .on("click", function (event, d) {
        handleClick(d.id);
      });
  }, [data]);

  // handle click event --> load data (code duplicate from PopupWindows.js)
  // TODO: remvove this code duplication, but idk when to fetch the data
  ///////////////////////////////////////////////////////////code duplication top/////////////////////////////////////////////////////////
  const [open, setOpen] = useState(false);
  // set default values
  const [personData, setPersonData] = useState({});
  const [similarPersonData, setSimilarPersonData] = useState({});
  const handleClick = async (personId) => {
    console.log("handleClick", personId);
    try {
      // (1) get person data
      const responsePerson = await fetch(
        `http://127.0.0.1:8000/person/${personId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!responsePerson.ok) {
        throw new Error(`Error! status: ${responsePerson.status}`);
      }
      //get only first element since we are sure there is only one returned
      const resultPerson = await responsePerson.json();
      if (resultPerson.length < 1) {
        throw new Error(
          `Error! result of fetch("http://127.0.0.1:8000/person/${personId}" not as expected. It is: ${resultPerson}. Probably there is a non existing Id requested.`
        );
      }
      console.log(
        `"result of GET /person/${personId} is: `,
        JSON.stringify(resultPerson, null, 4)
      );

      setPersonData(resultPerson[0]);
      // (2) get similar person Id
      const similarPersonId = "x8011e"; // TODO: fetch this from server
      // (3) get similar person data
      const responseSimilarPerson = await fetch(
        `http://127.0.0.1:8000/person/${similarPersonId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!responseSimilarPerson.ok) {
        throw new Error(`Error! status: ${responseSimilarPerson.status}`);
      }

      const resultSimilarPerson = await responseSimilarPerson.json();
      if (resultSimilarPerson.length < 1) {
        throw new Error(
          `Error! result of fetch("http://127.0.0.1:8000/person/${similarPersonId}" not as expected. It is: ${resultSimilarPerson}. Probably there is a non existing Id requested.`
        );
      }
      console.log(
        `"result of GET /person/${similarPersonId} is: `,
        JSON.stringify(resultSimilarPerson, null, 4)
      );

      setSimilarPersonData(resultSimilarPerson[0]);

      //open the window
      setOpen(true);
    } catch (err) {
      console.log(err.message);
    } finally {
    }
  };
  ///////////////////////////////////////////////////////////code duplication bottom/////////////////////////////////////////////////////////
  return (
    <div className="scatterPlot">
      <svg ref={svgRef}></svg>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent>
          <Stack direction="row">
            <Box sx={{ p: 6, pb: 1 }}>
              <Typography
                variant="body2"
                sx={{ color: "text.primary", fontSize: 18 }}
                noWrap
              >
                <b>Person to reconsider</b>
              </Typography>
              <PersonProfile personData={personData} />
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box sx={{ p: 6, pb: 1 }} backgroundColor="#f2f2f2">
              <Typography
                variant="body2"
                sx={{ color: "text.primary", fontSize: 18 }}
                noWrap
              >
                <b>Similar person</b>
              </Typography>
              <PersonProfile personData={similarPersonData} />
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions></DialogActions>
      </Dialog>
    </div>
  );
}
export default ScatterPlot;
