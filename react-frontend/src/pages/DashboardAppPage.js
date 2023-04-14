import { Helmet } from "react-helmet-async";

import {
  Card,
  CardHeader,
  Grid,
  Container,
  Typography,
  CardContent,
} from "@mui/material";

// sections
import { CandidatesPlot, AppConversionRates } from "../sections/@dashboard/app";

import GaugeChart from "../components/gaugeChart";
// data
import React, { useEffect, useState } from "react";

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  let [fairness, setFairness] = useState({
    "groups": [],
    "overallscore": 0
})
  useEffect(() => {
    fetch("http://127.0.0.1:8000/fairness")
    .then((r) => r.json())
    .then((data) => {
      console.log(data)
      setFairness(data)
    })
  }, [])

  return (
    <>
      <Helmet>
        <title> Dashboard | Bias Assessment </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={4}>
            <Card sx={{ height: "100%" }}>
              <CardHeader title="Overall Fairness" />
              <CardContent>
                <GaugeChart value={fairness.overallscore} />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates
              title="Fairness by Group"
              subheader="(+43%) than last month"
              chartData={fairness.groups}
            />
          </Grid>

          <Grid item xs={12} md={12} lg={12}>
            <CandidatesPlot
              title="Fairness Scatterplot"
              subheader="A plot of candidates' qualifications against potential bias"
              chartLabels={[
                "01/01/2003",
                "02/01/2003",
                "03/01/2003",
                "04/01/2003",
                "05/01/2003",
                "06/01/2003",
                "07/01/2003",
                "08/01/2003",
                "09/01/2003",
                "10/01/2003",
                "11/01/2003",
              ]}
              chartData={[
                {
                  name: "Team A",
                  type: "column",
                  fill: "solid",
                  data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                },
                {
                  name: "Team B",
                  type: "area",
                  fill: "gradient",
                  data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                },
                {
                  name: "Team C",
                  type: "line",
                  fill: "solid",
                  data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                },
              ]}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
