import PropTypes from "prop-types";
import ReactApexChart from "react-apexcharts";
// @mui
import { Box, Card, CardHeader } from "@mui/material";
// utils
import { fNumber } from "../../../utils/formatNumber";
// components
import { useChart } from "../../../components/chart";

// ----------------------------------------------------------------------

AppConversionRates.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  chartData: PropTypes.array.isRequired,
};

export default function AppConversionRates({
  title,
  subheader,
  chartData,
  chartColors,
  borderRadius = 8,
  ...other
}) {
  const chartLabels = chartData.map((i) => i.label);

  const chartSeries = chartData.map((i) => i.value);

  // Adding some dummy rows teporarily
  /*
  chartLabels.push("Gender & Age");
  chartSeries.push(90);
  chartLabels.push("Gender & National...");
  chartSeries.push(89);
  chartLabels.push("Nationality & Age");
  chartSeries.push(74);
  chartLabels.push("Gender & Age & Na..");
  chartSeries.push(73);
  */

  let distributed = false;
  if (chartColors != undefined) {
    distributed = true;
  }

  const chartOptions = useChart({
    tooltip: {
      marker: { show: false },
      y: {
        formatter: (seriesName) => fNumber(seriesName),
        title: {
          formatter: () => "",
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "40%",
        borderRadius: borderRadius,
        distributed: distributed,
      },
    },
    colors: chartColors,
    xaxis: {
      categories: chartLabels,
    },
    legend: {
      show: false,
    },
  });

  return (
    <Card {...other} sx={{ height: "100%" }}>
      <CardHeader title={title} subheader={subheader} />

      <Box sx={{ mx: 3 }} dir="ltr">
        <ReactApexChart
          type="bar"
          series={[{ data: chartSeries }]}
          options={chartOptions}
          height={364}
        />
      </Box>
    </Card>
  );
}
