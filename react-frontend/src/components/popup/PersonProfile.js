import PropTypes from "prop-types";
import { Typography, Box, Stack } from "@mui/material";

PersonProfile.propTypes = {
  personData: PropTypes.array.isRequired,
};

export default function PersonProfile({ personData }) {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Box>
        <Box
          component="img"
          alt={personData.Id}
          src={`/assets/images/avatars/${personData.gender}.jpg`}
          sx={{ width: 96, height: 96, borderRadius: 1.5, flexShrink: 0 }}
        ></Box>
        <Typography
          variant="body2"
          sx={{
            pr: 3,
            flexShrink: 0,
            color: personData.decision ? "success.main" : "error.main",
          }}
        >
          {personData.decision ? "Accepted" : "Rejected"}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
          <b>Gender: </b>
          {personData.gender}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
          <b>Age: </b>
          {personData.age}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
          <b>Nationality: </b>
          {personData.nationality}
        </Typography>
      </Box>
      {/* TODO: make this nicer */}

      <Box>
        <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
          <b>Sport: </b>
          {personData.sport}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
          <b>University Grade: </b>
          {personData["ind-university_grade"].toString()}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
          <b>Debateclub: </b>
          {personData["ind-debateclub"].toString()}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
          <b>Programming Exp.: </b>
          {personData["ind-programming_exp"].toString()}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
          <b>International Exp.: </b>
          {personData["ind-international_exp"].toString()}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
          <b>Entrepreneur Exp.: </b>
          {personData["ind-entrepeneur_exp"].toString()}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
          <b>Languages: </b>
          {personData["ind-languages"].toString()}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
          <b>Exact Study: </b>
          {personData["ind-exact_study"].toString()}
        </Typography>

        <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
          <b>Degree: </b>
          {personData["ind-degree"]}
        </Typography>
      </Box>
    </Stack>
  );
}
