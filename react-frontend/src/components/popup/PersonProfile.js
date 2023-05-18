import PropTypes from "prop-types";
import { Typography, Box, Stack, Button } from "@mui/material";
PersonProfile.propTypes = {
  personData: PropTypes.object,
};

export default function PersonProfile({ personData }) {
  const ignoreClicked = () => {
    // Probably reloading the entire page is not a nice way to do this
    fetch("http://127.0.0.1:8000/person/" + personData.Id, {
      method: "POST",
    }).then((r) => window.location.reload());
  };

  if (personData == undefined || personData == null || !("Id" in personData)) {
    return <div>Nothing selected so far.</div>
  }
  else {
    return (
      <Stack direction="row" sx={{ pt: 4, justifyContent: "center"}}>
        <Stack direction="column" alignItems="left" spacing={2}>
          <Box
            component="img"
            alt={personData.Id}
            src={`/assets/images/avatars/${personData.gender}.jpg`}
            sx={{ width: 96, height: 96, borderRadius: 1.5, flexShrink: 0 }}
          ></Box>
          <Box>
            <Typography
              variant="body2"
              sx={{
                pr: 3,
                flexShrink: 0,
                color: personData.decision ? "success.main" : "error.main",
                fontSize: 18,
              }}
            >
              <b>{personData.decision ? "Accepted" : "Rejected"}</b>
            </Typography>
          </Box>
  
          <Box>
            <Stack direction="row" spacing={1}>
              <Box>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  <b>Gender: </b>
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  <b>Age: </b>
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  <b>Nationality: </b>
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {personData.gender}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {personData.age}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {personData.nationality}
                </Typography>
              </Box>
            </Stack>
          </Box>
          <Box>
            <Typography
              variant="body2"
              sx={{ color: "text.primary", fontSize: 18 }}
            >
              <b>Education</b>
            </Typography>
            <Stack direction="row" spacing={1}>
              <Box>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  <b>Degree: </b>
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  <b>University Grade: </b>
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  <b>Exact Study: </b>
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  <b>Languages: </b>
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {personData["ind-degree"]}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {personData["ind-university_grade"].toString()}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {personData["ind-exact_study"].toString()}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {personData["ind-languages"].toString()}
                </Typography>
              </Box>
            </Stack>
          </Box>
          <Box>
            <Typography
              variant="body2"
              sx={{ color: "text.primary", fontSize: 18 }}
            >
              <b>Experience</b>
            </Typography>
            <Stack direction="row" spacing={1}>
              <Box>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  <b>Programming: </b>
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  <b>International: </b>
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  <b>Entrepreneur: </b>
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  <b>Debateclub: </b>
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {personData["ind-programming_exp"].toString()}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {personData["ind-international_exp"].toString()}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {personData["ind-entrepeneur_exp"].toString()}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {personData["ind-debateclub"].toString()}
                </Typography>
              </Box>
            </Stack>
          </Box>
          <Box>
            <Typography
              variant="body2"
              sx={{ color: "text.primary", fontSize: 18 }}
            >
              <b>Hobbies</b>
            </Typography>
            <Stack direction="row" spacing={1}>
              <Box>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  <b>Sport: </b>
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {personData.sport}
                </Typography>
              </Box>
            </Stack>
          </Box>
          <Box alignItems="left">
            <Button onClick={ignoreClicked}>Ignore this Person</Button>
          </Box>
        </Stack>
      </Stack>
    );
  } 
}
