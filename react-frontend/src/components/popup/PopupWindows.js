import React from "react";
import PropTypes from "prop-types";
import { PersonProfile } from "./";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  Divider,
  Box,
  Typography,
} from "@mui/material";

import { useState } from "react";

PopupWindows.propTypes = {
  personId: PropTypes.string,
};

export default function PopupWindows({ personId }) {
  // TODO: resolve this code duplication with ScatterPlot.js
  ///////////////////////////////////////////////////////////code duplication top/////////////////////////////////////////////////////////
  const [open, setOpen] = useState(false);

  // fetch person data
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
  const [PersonDataSame, setPersonDataSame] = useState(initialState);
  const handleClick = async () => {
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
          `Error! result of fetch("http://127.0.0.1:8000/similarpeople/${personId}" not as expected. It is: ${resultPerson}. Probably there is a non existing Id requested.`
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
  ///////////////////////////////////////////////////////////code duplication bottom/////////////////////////////////////////////////////////
  return (
    <>
      <Button onClick={handleClick} variant="body2">
        {personId}
      </Button>

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
    </>
  );
}
