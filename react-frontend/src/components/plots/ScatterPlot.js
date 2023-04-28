import { useEffect, useState, useRef } from "react";
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
  Checkbox,
  Card,
  FormGroup,
  FormControlLabel,
  FormLabel,
  FormControl,
  FormHelperText,
} from "@mui/material";
import { PersonProfile } from "../popup";

ScatterPlot.propTypes = { data: PropTypes.array };

function ScatterPlot({ data }) {
  const svgRef = useRef();
  const MAX_OPACITY = "0.9";
  const MIN_OPACITY = "0.1";
  useEffect(() => {
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
    const h = 650;
    const svg = d3
      .select(svgRef.current)
      .attr("width", w)
      .attr("height", h)
      .style("overflow", "visible")
      .style("margin-top", "100px");
    //set up scaling
    const xScale = d3.scaleLinear([-1.2, 1.2], [0, w]);
    const yScale = d3.scaleLinear([-5, 5], [h, 0]);

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

    // set up legend
    svg
      .append("circle")
      .attr("cx", 0)
      .attr("cy", -80)
      .attr("r", 5)
      .style("fill", "rgb(51, 153, 51)");
    svg
      .append("circle")
      .attr("cx", 0)
      .attr("cy", -60)
      .attr("r", 5)
      .style("fill", "rgb(204, 0, 0)");
    svg
      .append("text")
      .attr("x", 20)
      .attr("y", -80)
      .text("accepted")
      .style("font-size", "15px")
      .attr("alignment-baseline", "middle");
    svg
      .append("text")
      .attr("x", 20)
      .attr("y", -60)
      .text("rejected")
      .style("font-size", "15px")
      .attr("alignment-baseline", "middle");

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
      .attr("r", 5)
      .attr("opacity", MAX_OPACITY)
      .style("cursor", "pointer");

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
        console.log("mouseover", d);
      })
      .on("mouseout", function (event, d) {
        tip
          .style("opacity", 0)
          .style("left", 0 + "px") // little hack sth. the invisible element is for sure not clicked by acceident
          .style("top", 0 + "px");
        console.log("mouseout", d);
        d3.select(this).attr("stroke", "none").style("stroke-width", 0);
      })
      .on("click", function (event, d) {
        handleClick(d.id);
      });
  }, [data]);

  // set data filter for gender
  const [state, setState] = useState({
    male: true,
    female: true,
    other: true,
    dutch: true,
    belgian: true,
    german: true,
  });

  useEffect(() => {
    console.log("there was a change in a Gender state: ", state);
    function ignore_point(d) {
      // returns true if datapoint should be ignored, false otherwise

      if (d.gender === "male" && !state.male) return true;
      if (d.gender === "female" && !state.female) return true;
      if (d.gender === "other" && !state.other) return true;
      if (d.nationality === "Dutch" && !state.dutch) return true;
      if (d.nationality === "Belgian" && !state.belgian) return true;
      if (d.nationality === "German" && !state.german) return true;
      else return false;
    }
    // filter gender
    d3.select(svgRef.current)
      .selectAll("circle")
      .filter(function (d) {
        if (d !== undefined) return d;
        else return false;
      })
      .filter(function (d) {
        if (ignore_point(d)) d3.select(this).attr("opacity", MIN_OPACITY);
        else d3.select(this).attr("opacity", MAX_OPACITY);
        return true;
      });
  }, [state]);

  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };
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
        `http://127.0.0.1:8000/similarpeople/${personId}`,
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
          `Error! result of fetch("http://127.0.0.1:8000/similarpeople/${personId}" not as expected. It is: ${resultPerson}. Probably there is a non existing Id requested.`
        );
      }
      console.log(
        `"result of GET /similarpeople/${personId} is: `,
        JSON.stringify(resultPerson, null, 4)
      );

      setPersonData(resultPerson[0]);
      setSimilarPersonData(resultPerson[1]);

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
      <Card>
        <FormControl
          sx={{ mt: 2, ml: 3, mr: 3 }}
          component="fieldset"
          variant="standard"
        >
          <FormLabel component="legend" focused={false}>
            Filter Plot
          </FormLabel>
          <FormGroup row={true}>
            <FormGroup sx={{ m: 2 }}>
              <FormHelperText>Gender</FormHelperText>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={state.male}
                    onChange={handleChange}
                    name="male"
                  />
                }
                label="male"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={state.female}
                    onChange={handleChange}
                    name="female"
                  />
                }
                label="female"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={state.other}
                    onChange={handleChange}
                    name="other"
                  />
                }
                label="other"
              />
            </FormGroup>
            <FormGroup sx={{ m: 2 }}>
              <FormHelperText>Nationality</FormHelperText>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={state.dutch}
                    onChange={handleChange}
                    name="dutch"
                  />
                }
                label="dutch"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={state.belgian}
                    onChange={handleChange}
                    name="belgian"
                  />
                }
                label="belgian"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={state.german}
                    onChange={handleChange}
                    name="german"
                  />
                }
                label="german"
              />
            </FormGroup>
          </FormGroup>
        </FormControl>
      </Card>

      <svg ref={svgRef}></svg>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent>
          <Stack direction="row">
            <Box sx={{ p: 6, pt: 2, pb: 2 }}>
              <Typography
                variant="body2"
                sx={{ color: "text.primary", fontSize: 24 }}
                noWrap
              >
                <b>Person</b>
              </Typography>
              <PersonProfile personData={personData} />
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box sx={{ p: 6, pt: 2, pb: 2 }} backgroundColor="#f2f2f2">
              <Typography
                variant="body2"
                sx={{ color: "text.primary", fontSize: 24 }}
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
