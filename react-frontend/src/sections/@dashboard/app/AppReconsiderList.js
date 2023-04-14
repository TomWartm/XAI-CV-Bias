// @mui
import PropTypes from "prop-types";

import {
  Box,
  Stack,
  Card,
  Typography,
  CardHeader,
  CardContent,
} from "@mui/material";
// components
import Scrollbar from "../../../components/scrollbar";
import { PopupWindows } from "../../../components/popup";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
// ----------------------------------------------------------------------

AppReconsiderList.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  list: PropTypes.array.isRequired,
};

export default function AppReconsiderList({
  title,
  subheader,
  list,
  ...other
}) {
  return (
    <Card {...other} sx={{ height: "100%", border: "none", boxShadow: "none" }}>
      <CardHeader title={title} subheader={subheader} />

      <CardContent>
        <Scrollbar>
          <Stack spacing={2} sx={{ m: 3, pr: 0 }} alignItems="left">
            {list.map((personSummary) => (
              <ReconsiderItem
                key={personSummary.id}
                personSummary={personSummary}
              />
            ))}
          </Stack>
        </Scrollbar>
      </CardContent>
    </Card>
  );
}

// ----------------------------------------------------------------------

ReconsiderItem.propTypes = {
  personSummary: PropTypes.shape({
    image: PropTypes.string,
    decision: PropTypes.bool,
    personId: PropTypes.string,
  }),
};

function ReconsiderItem({ personSummary }) {
  const { image, personId, decision } = personSummary;

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Box
        component="img"
        alt={personId}
        src={image}
        sx={{ width: 48, height: 48, borderRadius: 1.5, flexShrink: 0 }}
      />

      <Box sx={{ flexGrow: 1 }}>
        <PopupWindows personId={personId}></PopupWindows>
      </Box>

      <Box>
        <Stack direction="row" alignItems="center" spacing={2}>
          {decision ? <CheckCircleOutlineIcon /> : <NotInterestedIcon />}
          <Typography
            variant="body2"
            sx={{
              pr: 3,
              flexShrink: 0,
              color: decision ? "success.main" : "error.main",
            }}
          >
            {decision ? "Accepted" : "Rejected"}
          </Typography>
        </Stack>
      </Box>
    </Stack>
  );
}
