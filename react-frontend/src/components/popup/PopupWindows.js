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

  const handleClick = async () => {
    try {
      // (1) get person data
      const responsePerson = await fetch(
        `${window.BASE_BACKEND}person/${personId}`,
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
          `Error! result of fetch("${window.BASE_BACKEND}person/${personId}" not as expected. It is: ${resultPerson}. Probably there is a non existing Id requested.`
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
        `${window.BASE_BACKEND}person/${similarPersonId}`,
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
          `Error! result of fetch("${window.BASE_BACKEND}person/${similarPersonId}" not as expected. It is: ${resultSimilarPerson}. Probably there is a non existing Id requested.`
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
    </>
  );
}
