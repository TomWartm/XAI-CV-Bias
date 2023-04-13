import PropTypes from "prop-types";
import ReactApexChart from "react-apexcharts";
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
import { useChart } from "../../../components/chart";
import { useTheme } from "@mui/material/styles";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import React, { useEffect, useState } from "react";
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
  const chartOptions = useChart({
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
  });

  // load example person from backend
  const [dummyPersons, setDummyPersons] = useState([]);
  const fetchDummyPersonsData = () => {
    fetch("http://127.0.0.1:8000/person/random/5")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setDummyPersons(data);
      });
  };
  // fetchDummyPersonData each time App component loads
  useEffect(() => {
    fetchDummyPersonsData();
  }, []);
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />
      <Grid container divider={<Divider orientation="vertical" flexItem />}>
        <Grid item xs={12} md={8} lg={8}>
          <Paper sx={{ p: 3 }}>
            <Stack direction="row" spacing={2}>
              <Number
                number={4000}
                text="Total Candidates"
                icon={
                  <PersonOutlineIcon
                    sx={{ color: theme.palette.text.secondary }}
                  />
                }
              />
              <Number
                number={56}
                text="Accepted"
                icon={
                  <CheckCircleOutlineIcon
                    sx={{ color: theme.palette.text.secondary }}
                  />
                }
              />
              <Number
                number={3944}
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
            <Box sx={{ p: 3, pb: 1 }} dir="ltr">
              <ReactApexChart
                type="line"
                series={chartData}
                options={chartOptions}
                height={364}
              />
            </Box>
          </Paper>
        </Grid>

        {/*
        <Grid item xs={2} md={2} lg={2}>
          <Divider orientation="vertical" flexItem />
        </Grid>
        */}
        <Divider orientation="vertical" flexItem />

        <Grid item xs>
          {/*<Grid item xs={12} md={4} lg={4}>*/}
          <Paper sx={{ p: 3 }}>
            <AppReconsiderList
              title="People to reconsider"
              list={dummyPersons.map((x) => ({
                id: x.Id,
                title: x.Id,
                image: `/assets/images/avatars/${x.gender}.jpg`,
                decision: x.decision,
              }))}
            />
          </Paper>
        </Grid>
      </Grid>
    </Card>
  );
}
