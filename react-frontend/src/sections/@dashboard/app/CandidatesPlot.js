import PropTypes from "prop-types";
import { AppReconsiderList } from "./";

import {
  Grid,
  Card,
  CardHeader,
  Box,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
// components
import { useTheme } from "@mui/material/styles";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import React, { useEffect, useState } from "react";
import ScatterPlot from "src/components/plots/ScatterPlot";
// ----------------------------------------------------------------------

CandidatesPlot.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  chartData: PropTypes.array.isRequired,
  chartLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
};

function Number({ number, text, icon }) {
  const theme = useTheme();
  return (
    <>
      <Paper>
        <Box
          sx={{
            p: 3,
            textAlign: "center",
            /*
            border: "1px solid",
            borderRadius: "16px",
            borderColor: theme.palette.divider,
            */
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            {icon}
            <Typography
              variant="subtitle2"
              sx={{ color: theme.palette.text.secondary }}
            >
              {text}
            </Typography>
          </Stack>
          <Typography variant="h3">{number}</Typography>
        </Box>
      </Paper>
    </>
  );
}

export default function CandidatesPlot({
  title,
  subheader,
  chartLabels,
  chartData,
  ...other
}) {
  const theme = useTheme();
  /* const chartOptions = useChart({
    plotOptions: { bar: { columnWidth: "16%" } },
    fill: { type: chartData.map((i) => i.fill) },
    labels: chartLabels,
    xaxis: { type: "datetime" },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y) => {
          if (typeof y !== "undefined") {
            return `${y.toFixed(0)} visits`;
          }
          return y;
        },
      },
    },
  }); */

  // load example person from backend
  const [reconsiderPersons, setReconsiderPersons] = useState([]);
  const fetchReconsiderPersonsData = () => {
    fetch("http://127.0.0.1:8000/reconsider")
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((data) => {
        setReconsiderPersons(data);
      });
  };
  // load scatter Data from backend
  const [scatterData, setScatterData] = useState([]);
  const [totalPeople, setTotalPeople] = useState();
  const [accepedPeople, setAcceptedPeople] = useState();
  const [rejectedPeople, setRejectedPeople] = useState();
  const fetchScatterData = () => {
    fetch("http://127.0.0.1:8000/scatterdata")
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((data) => {
        setScatterData(data);
        let total = 0;
        let accepted = 0;
        let rejected = 0;
        for (let p of data) {
          total += 1;
          if (p.decision) {
            accepted += 1;
          } else {
            rejected += 1;
          }
        }
        setTotalPeople(total);
        setAcceptedPeople(accepted);
        setRejectedPeople(rejected);
      });
  };

  // fetchDummyPersonData each time App component loads
  useEffect(() => {
    fetchReconsiderPersonsData();
    fetchScatterData();
  }, []);
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />
      <Grid container divider={<Divider orientation="vertical" flexItem />}>
        <Grid item xs={12} md={7.9} lg={7.9}>
          <Stack direction="column" alignItems="center">
            <Paper sx={{ p: 2 }}>
              <Stack direction="row" spacing={2}>
                <Number
                  number={totalPeople}
                  text="Total Candidates"
                  icon={
                    <PersonOutlineIcon
                      sx={{ color: theme.palette.text.secondary }}
                    />
                  }
                />
                <Number
                  number={accepedPeople}
                  text="Accepted"
                  icon={
                    <CheckCircleOutlineIcon
                      sx={{ color: theme.palette.text.secondary }}
                    />
                  }
                />
                <Number
                  number={rejectedPeople}
                  text="Rejected"
                  icon={
                    <NotInterestedIcon
                      sx={{ color: theme.palette.text.secondary }}
                    />
                  }
                />
                <Number
                  number={0}
                  text="Unseen"
                  icon={
                    <VisibilityOffIcon
                      sx={{ color: theme.palette.text.secondary }}
                    />
                  }
                />
                {/*<AppWidgetSummary
                  title="Weekly Sales"
                  total={714000}
                  icon={"ant-design:android-filled"}
                />
                <AppWidgetSummary
                  title="New Users"
                  total={1352831}
                  color="info"
                  icon={"ant-design:apple-filled"}
                />*/}
              </Stack>
            </Paper>
            <Paper sx={{ px: 10, py: 2 }}>
              <ScatterPlot data={scatterData}></ScatterPlot>
            </Paper>
          </Stack>
        </Grid>

        <Divider orientation="vertical" flexItem />

        <Grid item xs>
          <AppReconsiderList
            title="People to reconsider"
            list={reconsiderPersons.map((x) => ({
              id: x.Id,
              personId: x.Id,
              image: `/assets/images/avatars/${x.gender}.jpg`,
              decision: x.decision,
            }))}
          />
        </Grid>
      </Grid>
    </Card>
  );
}
