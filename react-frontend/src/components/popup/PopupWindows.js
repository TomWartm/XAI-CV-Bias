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
  const [open, setOpen] = useState(false);

  // fetch person data
  // set default values
  const [data, setData] = useState({
    Id: "",
    gender: "female",
    age: 0,
    nationality: "",
    sport: "",
    "ind-university_grade": 0,
    "ind-debateclub": false,
    "ind-programming_exp": false,
    "ind-international_exp": false,
    "ind-entrepeneur_exp": false,
    "ind-languages": 0,
    "ind-exact_study": false,
    "ind-degree": "",
    company: "",
    decision: false,
  });
  const [err, setErr] = useState("");

  const handleClick = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/person/${personId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }
      //get only first element since we are sure there is only one returned
      const result = await response.json();
      if (result.length < 1) {
        throw new Error(
          `Error! result of fetch("http://127.0.0.1:8000/person/${personId}" not as expected. It is: ${result}. Probably there is a non existing Id requested.`
        );
      }
      console.log(
        `"result of GET /person/${personId} is: `,
        JSON.stringify(result, null, 4)
      );

      setData(result[0]);

      //open the window
      setOpen(true);
    } catch (err) {
      setErr(err.message);
    } finally {
    }
  };
  return (
    <>
      {err && <h2>{err}</h2>}
      <Button onClick={handleClick} variant="body2">
        {personId}
      </Button>

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
              <PersonProfile personData={data} />
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
              <PersonProfile personData={data} />
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions></DialogActions>
      </Dialog>
    </>
  );
}
