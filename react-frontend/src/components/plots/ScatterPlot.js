import { useEffect, useState, useRef } from "react";
import { useTheme } from "@mui/material/styles";
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
  Slider,
} from "@mui/material";
import { PersonProfile } from "../popup";
import { PrintTwoTone } from "@mui/icons-material";

ScatterPlot.propTypes = { data: PropTypes.array };

function ScatterPlot({ data }) {
  const theme = useTheme();
  const svgRef = useRef();
  const MAX_OPACITY = "0.5";
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
      .attr("cx", 0)
      .attr("cy", -80)
      .attr("r", 5)
      .style("fill", theme.palette.success.main);
    svg
      .append("circle")
      .attr("cx", 0)
      .attr("cy", -60)
      .attr("r", 5)
      .style("fill", theme.palette.error.main);
    svg
      .append("text")
      .attr("x", 20)
      .attr("y", -80)
      .text("fair")
      .style("font-size", "15px")
      .attr("alignment-baseline", "middle");
    svg
      .append("text")
      .attr("x", 20)
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
      .attr("r", (d) => d.qualification * 5) // I put it just to see how it will look. TODO: scale based on qualification instead of age once we have PCA positions
      .attr("opacity", MAX_OPACITY)
      .style("cursor", "pointer")
      .style("stroke", function (d) {
        //return getCircleStrokeColor((d["ind-university_grade"] - 45) * 3); // I put grade temporarily to see how it will look. TODO: scale based on bias once we have PCA positions
        return getCircleStrokeColor((Math.abs(d.bias) * -1 + 1) * 100);
      });

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
        handleClick(d.id);
      });
  }, [data]);

  // set data filter for gender and nationality
  const [state, setState] = useState({
    male: true,
    female: true,
    other: true,
    dutch: true,
    belgian: true,
    german: true,
    bachelor: true,
    master: true,
    phd: true,
  });
  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };
  // set data filter for age
  const [ageValue, setAgeValue] = useState([21, 32]);
  const handleAgeChange = (event, newValue) => {
    setAgeValue(newValue);
  };
  // set data filter for grade
  const [gradeValue, setGradeValue] = useState([45, 78]);
  const handleGradeChange = (event, newValue) => {
    setGradeValue(newValue);
  };
  // set data filter for languages
  const [languagesValue, setLanguagesValue] = useState([0, 3]);
  const handleLanguagesChange = (event, newValue) => {
    setLanguagesValue(newValue);
  };
  useEffect(() => {
    //console.log("there was a change in a state: ", state, ageValue[0]);
    function ignore_point(d) {
      // returns true if datapoint should be ignored, false otherwise

      if (d.gender === "male" && !state.male) return true;
      if (d.gender === "female" && !state.female) return true;
      if (d.gender === "other" && !state.other) return true;
      if (d.nationality === "Dutch" && !state.dutch) return true;
      if (d.nationality === "Belgian" && !state.belgian) return true;
      if (d.nationality === "German" && !state.german) return true;
      if (!(ageValue[0] <= d.age && d.age <= ageValue[1])) return true;
      if (d["ind-degree"] === "bachelor" && !state.bachelor) return true;
      if (d["ind-degree"] === "master" && !state.master) return true;
      if (d["ind-degree"] === "phd" && !state.phd) return true;
      if (
        !(
          gradeValue[0] <= d["ind-university_grade"] &&
          d["ind-university_grade"] <= gradeValue[1]
        )
      )
        return true;
      if (
        !(
          languagesValue[0] <= d["ind-languages"] &&
          d["ind-languages"] <= languagesValue[1]
        )
      )
        return true;
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
  }, [state, ageValue, gradeValue, languagesValue]);

  // handle click event --> load data (code duplicate from PopupWindows.js)
  // TODO: remvove this code duplication, but idk when to fetch the data
  ///////////////////////////////////////////////////////////code duplication top/////////////////////////////////////////////////////////
  const [open, setOpen] = useState(false);
  // set default values
  const [personData, setPersonData] = useState({});
  const [similarPersonData, setSimilarPersonData] = useState({});
  const handleClick = async (personId) => {
    //console.log("handleClick", personId);
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
      <svg ref={svgRef}></svg>
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
            <FormGroup sx={{ m: 2 }}>
              <FormHelperText>Age</FormHelperText>

              <FormControlLabel
                sx={{ height: 100, mt: 2, ml: 0.1 }}
                control={
                  <Slider
                    orientation="vertical"
                    size="small"
                    getAriaLabel={() => "Age range"}
                    value={ageValue}
                    onChange={handleAgeChange}
                    valueLabelDisplay="auto"
                    marks={[
                      {
                        value: 21,
                        label: "21",
                      },

                      {
                        value: 32,
                        label: "32",
                      },
                    ]}
                    min={21}
                    max={32}
                    disableSwap
                    name="age"
                  />
                }
                label=""
              />
            </FormGroup>
            <Divider orientation="vertical" flexItem />
            <FormGroup sx={{ m: 2 }}>
              <FormHelperText>Degree</FormHelperText>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={state.bachelor}
                    onChange={handleChange}
                    name="bachelor"
                  />
                }
                label="bachelor"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={state.master}
                    onChange={handleChange}
                    name="master"
                  />
                }
                label="master"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={state.phd}
                    onChange={handleChange}
                    name="phd"
                  />
                }
                label="phd"
              />
            </FormGroup>
            <FormGroup sx={{ m: 2 }}>
              <FormHelperText>Grade</FormHelperText>

              <FormControlLabel
                sx={{ height: 100, mt: 2, ml: 0.1 }}
                control={
                  <Slider
                    orientation="vertical"
                    size="small"
                    getAriaLabel={() => "Grade range"}
                    value={gradeValue}
                    onChange={handleGradeChange}
                    valueLabelDisplay="auto"
                    marks={[
                      {
                        value: 45,
                        label: "45",
                      },
                      {
                        value: 78,
                        label: "78",
                      },
                    ]}
                    min={45}
                    max={78}
                    disableSwap
                    name="grade"
                  />
                }
              />
            </FormGroup>
            <FormGroup sx={{ m: 2 }}>
              <FormHelperText>Languages</FormHelperText>

              <FormControlLabel
                sx={{ height: 100, mt: 2, ml: 0.1 }}
                control={
                  <Slider
                    orientation="vertical"
                    size="small"
                    getAriaLabel={() => "Languages range"}
                    value={languagesValue}
                    onChange={handleLanguagesChange}
                    valueLabelDisplay="auto"
                    marks={[
                      {
                        value: 0,
                        label: "0",
                      },
                      {
                        value: 1,
                        label: "",
                      },
                      {
                        value: 2,
                        label: "",
                      },
                      {
                        value: 3,
                        label: "3",
                      },
                    ]}
                    min={0}
                    max={3}
                    disableSwap
                    name="languages"
                  />
                }
              />
            </FormGroup>
          </FormGroup>
        </FormControl>
      </Card>
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
