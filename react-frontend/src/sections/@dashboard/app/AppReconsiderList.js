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
    <Card {...other} sx={{ height: "100%" }}>
      <CardHeader title={title} subheader={subheader} />

      <CardContent sx={{ width: 400 }}>
        <Scrollbar>
          <Stack spacing={2} sx={{ m: 2, pr: 0 }} alignItems="left">
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
  const { image, personId, decision, name, surname } = personSummary;

  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Box
        component="img"
        alt={personId}
        src={image}
        sx={{ width: 48, height: 48, borderRadius: 1.5, flexShrink: 0 }}
      />

      <Box sx={{ flexGrow: 1 }}>
        <PopupWindows personId={personId} name={name} surname={surname}></PopupWindows>
      </Box>

      <Box>
        <Typography
          variant="body2"
          sx={{
            color: decision ? "success.main" : "error.main",
          }}
        >
          {decision ? "Accepted" : "Rejected"}
        </Typography>
      </Box>
    </Stack>
  );
}
