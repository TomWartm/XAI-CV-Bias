import PropTypes from "prop-types";
import ReactApexChart from "react-apexcharts";
import { AppOrderTimeline, AppWidgetSummary } from "./";
// @mui

import { faker } from "@faker-js/faker";
import {
  Grid,
  Card,
  CardHeader,
  Box,
  Divider,
  CardContent,
  Paper,
} from "@mui/material";
// components
import { useChart } from "../../../components/chart";
import Typography from "src/theme/overrides/Typography";

// ----------------------------------------------------------------------

CandidatesPlot.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  chartData: PropTypes.array.isRequired,
  chartLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default function CandidatesPlot({
  title,
  subheader,
  chartLabels,
  chartData,
  ...other
}) {
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

  return (
    <Card>
      <Grid container>
        <Grid item xs={12} md={8} lg={8}>
          <Card>
            <CardHeader title={title} subheader={subheader} />
            <CardContent>
              <span>
                {" "}
                4000 candidates 304 seen 34 accepted 270 rejected (TODO pretty
                boxes)
              </span>
              <Box sx={{ p: 3, pb: 1 }} dir="ltr">
                <ReactApexChart
                  type="line"
                  series={chartData}
                  options={chartOptions}
                  height={364}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/*
        <Grid item xs={2} md={2} lg={2}>
          <Divider orientation="vertical" flexItem />
        </Grid>
        */}

        <Grid item xs={12} md={4} lg={4}>
          <AppOrderTimeline
            title="People to reconsider"
            list={[...Array(5)].map((_, index) => ({
              id: faker.datatype.uuid(),
              title: [
                "1983, orders, $4220",
                "12 Invoices have been paid",
                "Order #37745 from September",
                "New order placed #XF-2356",
                "New order placed #XF-2346",
              ][index],
              type: `order${index + 1}`,
              time: faker.date.past(),
            }))}
          />
        </Grid>
      </Grid>
    </Card>
  );
}
