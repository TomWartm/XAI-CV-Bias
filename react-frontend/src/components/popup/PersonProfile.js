import PropTypes from "prop-types";
import { Typography, Box, Stack, Button } from "@mui/material";
PersonProfile.propTypes = {
  personData: PropTypes.array.isRequired,
};

export default function PersonProfile({ personData }) {
  return (
    <Stack direction="row">
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
              <Typography
                variant="body2"
                sx={{ color: "text.secondary" }}
                noWrap
              >
                <b>Gender: </b>
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary" }}
                noWrap
              >
                <b>Age: </b>
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary" }}
                noWrap
              >
                <b>Nationality: </b>
              </Typography>
            </Box>
            <Box>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary" }}
                noWrap
              >
                {personData.gender}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary" }}
                noWrap
              >
                {personData.age}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary" }}
                noWrap
              >
                {personData.nationality}
              </Typography>
            </Box>
          </Stack>
        </Box>
        <Box>
          <Typography
            variant="body2"
            sx={{ color: "text.primary", fontSize: 18 }}
            noWrap
          >
            <b>Education</b>
          </Typography>
          <Stack direction="row" spacing={1}>
            <Box>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary" }}
                noWrap
              >
                <b>Degree: </b>
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary" }}
                noWrap
              >
                <b>University Grade: </b>
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary" }}
                noWrap
              >
                <b>Exact Study: </b>
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary" }}
                noWrap
              >
                <b>Languages: </b>
              </Typography>
            </Box>
            <Box>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary" }}
                noWrap
              >
                {personData["ind-degree"]}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary" }}
                noWrap
              >
                {personData["ind-university_grade"].toString()}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary" }}
                noWrap
              >
                {personData["ind-exact_study"].toString()}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary" }}
                noWrap
              >
                {personData["ind-languages"].toString()}
              </Typography>
            </Box>
          </Stack>
        </Box>
        <Box>
          <Typography
            variant="body2"
            sx={{ color: "text.primary", fontSize: 18 }}
            noWrap
          >
            <b>Experience</b>
          </Typography>
          <Stack direction="row" spacing={1}>
            <Box>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary" }}
                noWrap
              >
                <b>Programming: </b>
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary" }}
                noWrap
              >
                <b>International: </b>
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary" }}
                noWrap
              >
                <b>Entrepreneur: </b>
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary" }}
                noWrap
              >
                <b>Debateclub: </b>
              </Typography>
            </Box>
            <Box>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary" }}
                noWrap
              >
                {personData["ind-programming_exp"].toString()}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary" }}
                noWrap
              >
                {personData["ind-international_exp"].toString()}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary" }}
                noWrap
              >
                {personData["ind-entrepeneur_exp"].toString()}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary" }}
                noWrap
              >
                {personData["ind-debateclub"].toString()}
              </Typography>
            </Box>
          </Stack>
        </Box>
        <Box>
          <Typography
            variant="body2"
            sx={{ color: "text.primary", fontSize: 18 }}
            noWrap
          >
            <b>Hobbies</b>
          </Typography>
          <Stack direction="row" spacing={1}>
            <Box>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary" }}
                noWrap
              >
                <b>Sport: </b>
              </Typography>
            </Box>
            <Box>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary" }}
                noWrap
              >
                {personData.sport}
              </Typography>
            </Box>
          </Stack>
        </Box>
        <Box alignItems="left">
          <Button>Ignore this Person</Button>
        </Box>
      </Stack>
    </Stack>
  );
}
