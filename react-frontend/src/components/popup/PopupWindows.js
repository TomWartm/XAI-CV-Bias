import React from "react";
import PropTypes from "prop-types";
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Stack,
} from "@mui/material";

import { useState } from "react";

PopupWindows.propTypes = {
  personId: PropTypes.string,
};

export default function PopupWindows({ personId }) {
  const [open, setOpen] = useState(false);

  // fetch person data
  // set defult values
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
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleClick = async () => {
    setIsLoading(true);

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

      console.log("result is: ", JSON.stringify(result, null, 4));

      setData(result[0]);

      //open the window
      setOpen(true);
    } catch (err) {
      setErr(err.message);
    } finally {
      setIsLoading(false);
    }

    console.log(data);
  };
  return (
    <>
      {err && <h2>{err}</h2>}
      <Button onClick={handleClick}>
        {!isLoading ? "Open Dialog" : "Loading..."}
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{data.Id}</DialogTitle>
        <DialogContent>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box>
              <Box
                component="img"
                alt={data.Id}
                src={`/assets/images/avatars/${data.gender}.jpg`}
                sx={{ width: 48, height: 48, borderRadius: 1.5, flexShrink: 0 }}
              ></Box>
              <Typography
                variant="body2"
                sx={{
                  pr: 3,
                  flexShrink: 0,
                  color: data.decision ? "success.main" : "error.main",
                }}
              >
                {data.decision ? "Accepted" : "Rejected"}
              </Typography>
            </Box>
            {/* TODO: make this nicer */}

            <Box>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary" }}
                noWrap
              >
                <b>Gender: </b>
                {data.gender}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary" }}
                noWrap
              >
                <b>Age: </b>
                {data.age}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary" }}
                noWrap
              >
                <b>Nationality: </b>
                {data.nationality}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary" }}
                noWrap
              >
                <b>Sport: </b>
                {data.sport}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary" }}
                noWrap
              >
                <b>University Grade: </b>
                {data["ind-university_grade"].toString()}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary" }}
                noWrap
              >
                <b>Debateclub: </b>
                {data["ind-debateclub"].toString()}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary" }}
                noWrap
              >
                <b>Programming Exp.: </b>
                {data["ind-programming_exp"].toString()}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary" }}
                noWrap
              >
                <b>International Exp.: </b>
                {data["ind-international_exp"].toString()}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary" }}
                noWrap
              >
                <b>Entrepreneur Exp.: </b>
                {data["ind-entrepeneur_exp"].toString()}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary" }}
                noWrap
              >
                <b>Languages: </b>
                {data["ind-languages"].toString()}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary" }}
                noWrap
              >
                <b>Exact Study: </b>
                {data["ind-exact_study"].toString()}
              </Typography>

              <Typography
                variant="body2"
                sx={{ color: "text.secondary" }}
                noWrap
              >
                <b>Degree: </b>
                {data["ind-degree"]}
              </Typography>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button>Ignore this Person</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
