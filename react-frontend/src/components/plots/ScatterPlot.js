import { useState } from "react";
import PropTypes from "prop-types";
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
  ToggleButton,
  ToggleButtonGroup,
  Grid,
} from "@mui/material";
import { PersonProfile } from "../popup";
import InteractiveChart from "./InteractiveChart";

ScatterPlot.propTypes = { data: PropTypes.array };

function ScatterPlot({ data }) {
  const [state, setState] = useState({
    view: "all",
    male: true,
    female: true,
    other: true,
    dutch: true,
    belgian: true,
    german: true,
    bachelor: true,
    master: true,
    phd: true,
    ageValue: [21, 32],
    gradeValue: [45, 78],
    languagesValue: [0, 3],
    rejected: true,
    accepted: true,
  });

  // set data filter for gender and nationality

  const handleChange = (event) => {
    //console.log("meh");
    //simulation.force("x", d3.forceX().strength(1).x(1)).restart();
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };

  // set data filter for age
  const handleAgeChange = (event, newValue) => {
    setState({ ...state, ageValue: newValue });
  };
  // set data filter for grade
  const handleGradeChange = (event, newValue) => {
    setState({ ...state, gradeValue: newValue });
  };
  // set data filter for languages
  const handleLanguagesChange = (event, newValue) => {
    setState({ ...state, languagesValue: newValue });
  };

  // handle click event --> load data (code duplicate from PopupWindows.js)
  // TODO: remvove this code duplication, but idk when to fetch the data
  ///////////////////////////////////////////////////////////code duplication top/////////////////////////////////////////////////////////
  const [open, setOpen] = useState(false);
  // set default values
  const [sidePersonData, setSidePersonData] = useState({});
  const [personData, setPersonData] = useState({});
  const [similarPersonData, setSimilarPersonData] = useState({});
  const initialState = {
    gender: true,
    age: true,
    nationality: true,
    "ind-degree": true,
    "ind-university_grade": true,
    "ind-exact_study": true,
    "ind-languages": true,
    "ind-programming_exp": true,
    "ind-international_exp": true,
    "ind-entrepeneur_exp": true,
    "ind-debateclub": true,
    sport: true,
  };
  const [PersonDataSame, setPersonDataSame] = useState(initialState); // this is true in locations where attributes of PersonData and SimilarPersonData are the same

  const handleToggleChange = (event, newView) => {
    setState({ ...state, view: newView });
  };

  const handleClick = async (personId) => {
    try {
      // (1) get person data
      const responsePerson = await fetch(
        `${window.BASE_BACKEND}similarpeople/${personId}`,
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
          `Error! result of fetch("similarpeople/${personId}" not as expected. It is: ${resultPerson}. Probably there is a non existing Id requested.`
        );
      }
      //console.log(
      //  `"result of GET /similarpeople/${personId} is: `,
      //  JSON.stringify(resultPerson, null, 4)
      //);

      setPersonData(resultPerson[0]);
      setSimilarPersonData(resultPerson[1]);

      // compute differences in person and similarPerson
      const temp = {};
      for (const [key, value] of Object.entries(resultPerson[0])) {
        temp[key] = value === resultPerson[1][key];
      }
      setPersonDataSame(temp);

      //open the window
      setOpen(true);
    } catch (err) {
      console.log(err.message);
    } finally {
    }
  };

  async function handleMouseover(personId) {
    //console.log(personId)

    if (personId == null) {
      //setSidePersonData({})
    } else {
      let response = await fetch(`${window.BASE_BACKEND}/person/${personId}`);
      if (!response.ok) {
        throw new Error("Couldn't load person");
      }
      let person = await response.json();
      setSidePersonData(person[0]);
    }
  }
  ///////////////////////////////////////////////////////////code duplication bottom/////////////////////////////////////////////////////////

  return (
    <div className="scatterPlot">
      <Grid container spacing="5">
        <Grid item xs={8.9} md={8.9} lg={8.9}>
          <ToggleButtonGroup
            color="primary"
            value={state.view}
            exclusive
            onChange={handleToggleChange}
            aria-label="Platform"
          >
            <ToggleButton value="all">All</ToggleButton>
            <ToggleButton value="gender">Gender</ToggleButton>
            <ToggleButton value="nationality">Nationality</ToggleButton>
            <ToggleButton value="age">Age</ToggleButton>
          </ToggleButtonGroup>
          <Box>
            <InteractiveChart
              data={data}
              filters={state}
              onCircleClick={handleClick}
              onCircleMouseover={handleMouseover}
            />
          </Box>

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
                      value={state.ageValue}
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
                      value={state.gradeValue}
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
                      value={state.languagesValue}
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
              <Divider orientation="vertical" flexItem />
              <FormGroup sx={{ m: 2 }}>
                <FormHelperText>Decision</FormHelperText>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={state.accepted}
                      onChange={handleChange}
                      name="accepted"
                    />
                  }
                  label="accepted"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={state.rejected}
                      onChange={handleChange}
                      name="rejected"
                    />
                  }
                  label="rejected"
                />
              </FormGroup>
            </FormGroup>
          </FormControl>
        </Grid>
        <Divider orientation="vertical" flexItem />
        <Grid item xs={3} md={3} lg={3}>
          <PersonProfile
            personData={sidePersonData}
            attributeColor={initialState}
          />
        </Grid>
      </Grid>
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
              <PersonProfile
                personData={personData}
                attributeColor={PersonDataSame}
              />
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
              <PersonProfile
                personData={similarPersonData}
                attributeColor={PersonDataSame}
              />
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions></DialogActions>
      </Dialog>
    </div>
  );
}
export default ScatterPlot;
