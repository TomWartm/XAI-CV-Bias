// @mui
import PropTypes from "prop-types";

import {
  Box,
  Stack,
  Card,
  Button,
  Divider,
  Typography,
  CardHeader,
  CardContent,
  CardActions,
} from "@mui/material";
// components
import Iconify from "../../../components/iconify";
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
    <Card {...other} sx={{ height: "100%", border: "none", boxShadow: "none" }}>
      <CardHeader title={title} subheader={subheader} />

      <CardContent>
        <Scrollbar>
          <Stack spacing={2} sx={{ m: 3, pr: 0 }}>
            {list.map((personSummary) => (
              <ReconsiderItem
                key={personSummary.id}
                personSummary={personSummary}
              />
            ))}
          </Stack>
        </Scrollbar>
      </CardContent>
      <Divider />
      <CardActions>
        <Box sx={{ px: 2, marginLeft: "auto" }}>
          <Button
            size="small"
            color="inherit"
            endIcon={<Iconify icon={"eva:arrow-ios-forward-fill"} />}
          >
            View all
          </Button>
        </Box>
      </CardActions>
    </Card>
  );
}

// ----------------------------------------------------------------------

ReconsiderItem.propTypes = {
  personSummary: PropTypes.shape({
    image: PropTypes.string,
    decision: PropTypes.bool,
    title: PropTypes.string,
  }),
};

function ReconsiderItem({ personSummary }) {
  const { image, title, decision } = personSummary;

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Box
        component="img"
        alt={title}
        src={image}
        sx={{ width: 48, height: 48, borderRadius: 1.5, flexShrink: 0 }}
      />

      <Box sx={{ flexGrow: 1 }}>
        <PopupWindows personId={title}></PopupWindows>
      </Box>
      <Box>
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
      </Box>
    </Stack>
  );
}
