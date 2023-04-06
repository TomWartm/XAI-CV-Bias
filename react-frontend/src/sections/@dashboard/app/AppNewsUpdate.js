// @mui
import PropTypes from "prop-types";
import {
  Box,
  Stack,
  Link,
  Card,
  Button,
  Divider,
  Typography,
  CardHeader,
} from "@mui/material";
// components
import Iconify from "../../../components/iconify";
import Scrollbar from "../../../components/scrollbar";

// ----------------------------------------------------------------------

AppNewsUpdate.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  list: PropTypes.array.isRequired,
};

export default function AppNewsUpdate({ title, subheader, list, ...other }) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Scrollbar>
        <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
          {list.map((news) => (
            <NewsItem key={news.id} news={news} />
          ))}
        </Stack>
      </Scrollbar>

      <Divider />

      <Box sx={{ p: 2, textAlign: "right" }}>
        <Button
          size="small"
          color="inherit"
          endIcon={<Iconify icon={"eva:arrow-ios-forward-fill"} />}
        >
          View all
        </Button>
      </Box>
    </Card>
  );
}

// ----------------------------------------------------------------------

NewsItem.propTypes = {
  news: PropTypes.shape({
    age: PropTypes.string,
    nationality: PropTypes.string,
    image: PropTypes.string,
    decision: PropTypes.bool,
    title: PropTypes.string,
  }),
};

function NewsItem({ news }) {
  const { image, title, age, nationality, decision } = news;

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Box
        component="img"
        alt={title}
        src={image}
        sx={{ width: 48, height: 48, borderRadius: 1.5, flexShrink: 0 }}
      />

      <Box sx={{ minWidth: 240, flexGrow: 1 }}>
        <Link color="inherit" variant="subtitle2" underline="hover" noWrap>
          {title}
        </Link>

        <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
          Age: {age}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
          Nationality: {nationality}
        </Typography>
      </Box>

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
  );
}
