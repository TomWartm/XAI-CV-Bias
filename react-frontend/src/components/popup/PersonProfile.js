import PropTypes from "prop-types";
import { Typography, Box, Stack, Button } from "@mui/material";
PersonProfile.propTypes = {
  personData: PropTypes.object,
};

export default function PersonProfile({ personData, attributeColor }) {
  const ignoreClicked = () => {
    // Probably reloading the entire page is not a nice way to do this
    fetch(`${window.BASE_BACKEND}person/` + personData.Id, {
      method: "POST",
    }).then((r) => window.location.reload());
  };

  if (personData == undefined || personData == null || !("Id" in personData)) {
    return <div>Nothing selected so far.</div>;
  } else {
    return (
      <Stack direction="row" sx={{ pt: 4, justifyContent: "center" }}>
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
                <Typography
                  variant="body2"
                  sx={{
                    color: attributeColor.gender
                      ? "text.secondary"
                      : "info.main",
                    fontWeight: attributeColor.gender ? "" : "bold",
                  }}
                >
                  {personData.gender}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: attributeColor.age ? "text.secondary" : "info.main",
                    fontWeight: attributeColor.age ? "" : "bold",
                  }}
                >
                  {personData.age}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: attributeColor.nationality
                      ? "text.secondary"
                      : "info.main",
                    fontWeight: attributeColor.nationality ? "" : "bold",
                  }}
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
                <Typography
                  variant="body2"
                  sx={{
                    color: attributeColor["ind-degree"]
                      ? "text.secondary"
                      : "info.main",
                    fontWeight: attributeColor["ind-degree"] ? "" : "bold",
                  }}
                >
                  {personData["ind-degree"]}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: attributeColor["ind-university_grade"]
                      ? "text.secondary"
                      : "info.main",
                    fontWeight: attributeColor["ind-university_grade"]
                      ? ""
                      : "bold",
                  }}
                >
                  {personData["ind-university_grade"].toString()}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: attributeColor["ind-exact_study"]
                      ? "text.secondary"
                      : "info.main",
                    fontWeight: attributeColor["ind-exact_study"] ? "" : "bold",
                  }}
                >
                  {personData["ind-exact_study"].toString()}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: attributeColor["ind-languages"]
                      ? "text.secondary"
                      : "info.main",
                    fontWeight: attributeColor["ind-languages"] ? "" : "bold",
                  }}
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
                <Typography
                  variant="body2"
                  sx={{
                    color: attributeColor["ind-programming_exp"]
                      ? "text.secondary"
                      : "info.main",
                    fontWeight: attributeColor["ind-programming_exp"]
                      ? ""
                      : "bold",
                  }}
                >
                  {personData["ind-programming_exp"].toString()}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: attributeColor["ind-international_exp"]
                      ? "text.secondary"
                      : "info.main",
                    fontWeight: attributeColor["ind-international_exp"]
                      ? ""
                      : "bold",
                  }}
                >
                  {personData["ind-international_exp"].toString()}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: attributeColor["ind-entrepeneur_exp"]
                      ? "text.secondary"
                      : "info.main",
                    fontWeight: attributeColor["ind-entrepeneur_exp"]
                      ? ""
                      : "bold",
                  }}
                >
                  {personData["ind-entrepeneur_exp"].toString()}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: attributeColor["ind-debateclub"]
                      ? "text.secondary"
                      : "info.main",
                    fontWeight: attributeColor["ind-debateclub"] ? "" : "bold",
                  }}
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
                <Typography
                  variant="body2"
                  sx={{
                    color: attributeColor.sport
                      ? "text.secondary"
                      : "info.main",
                    fontWeight: attributeColor.sport ? "" : "bold",
                  }}
                >
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
