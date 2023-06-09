import { Helmet } from "react-helmet-async";
import { useTheme } from "@mui/material/styles";
import { AppReconsiderList } from "../sections/@dashboard/app";
import {
  Card,
  CardHeader,
  Grid,
  Container,
  Typography,
  CardContent,
} from "@mui/material";
import Iconify from "../components/iconify";

// sections
import {
  CandidatesPlot,
  AppConversionRates,
  AppTrafficBySite,
} from "../sections/@dashboard/app";

import GaugeChart from "../components/gaugeChart";
// data
import React, { useEffect, useState } from "react";

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const theme = useTheme();
  let [fairness, setFairness] = useState({
    groupfairness: [],
    overallscore: 0,
    influence: [],
    influencecolors: [],
  });
  // load example person from backend
  const [reconsiderPersons, setReconsiderPersons] = useState([]);
  const fetchReconsiderPersonsData = () => {
    fetch(`${window.BASE_BACKEND}reconsider`)
      .then((response) => {
        //console.log(response);
        return response.json();
      })
      .then((data) => {
        setReconsiderPersons(data);
      });
  };

  useEffect(() => {
    fetch(`${window.BASE_BACKEND}fairness`)
      .then((r) => r.json())
      .then((data) => {
        data.influencecolors = [];
        for (let i = 0; i < data.influence.length; i++) {
          data.influence[i].value *= 100;
          data.influence[i].label = data.influence[i].label
            .replace("_", " ")
            .replace("exp", "experience");
          if (
            ["gender", "age", "nationality"].indexOf(
              data.influence[i].label
            ) !== -1
          ) {
            data.influencecolors.push(theme.palette.error.main);
          } else {
            data.influencecolors.push(theme.palette.info.main); // TODO make look better visually
          }
        }
        setFairness(data);
      });
    fetchReconsiderPersonsData();
  }, [theme]);

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
                <GaugeChart value={Math.floor(fairness.overallscore)} />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates
              title="Fairness by Group"
              chartData={fairness.groupfairness}
              fakeittillyoumakeit={true}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates
              title="Influence by Group"
              subheader="How strong each property influenced your decision"
              chartData={fairness.influence}
              chartColors={fairness.influencecolors}
              borderRadius={4}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <AppReconsiderList
              title="People to reconsider"
              list={reconsiderPersons.map((x) => ({
                id: x.Id,
                personId: x.Id,
                image: `/assets/images/avatars/${x.gender}.jpg`,
                decision: x.decision,
                name: x.name,
                surname: x.surname
              }))}
            />
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <CandidatesPlot
              title="Fairness Explorer"
              subheader="An interactive plot to explore your blindspots. Candidates with similar demographics are closer to each other. Is there areas for improvement?"
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
