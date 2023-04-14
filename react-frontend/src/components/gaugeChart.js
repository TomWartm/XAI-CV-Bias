import { useTheme } from "@mui/material/styles";
import { Box, Typography, Container, Paper } from "@mui/material";
import { arc } from "d3-shape";
import { scaleLinear } from "d3-scale";

export default function GaugeChart({ value }) {
  const theme = useTheme();

  const redArc = arc()
    .innerRadius(1)
    .outerRadius(0.9)
    .startAngle(-Math.PI / 2)
    .endAngle(-Math.PI / 4)
    .padAngle(0.025)
    .cornerRadius(2)();

  const orangeArc = arc()
    .innerRadius(1)
    .outerRadius(0.9)
    .startAngle(-Math.PI / 4)
    .endAngle(0)
    .padAngle(0.025)
    .cornerRadius(2)();

  const greenArc = arc()
    .innerRadius(1)
    .outerRadius(0.9)
    .startAngle(0)
    .endAngle(Math.PI / 4)
    .padAngle(0.025)
    .cornerRadius(2)();

  const blueArc = arc()
    .innerRadius(1)
    .outerRadius(0.9)
    .startAngle(Math.PI / 4)
    .endAngle(Math.PI / 2)
    .padAngle(0.025)
    .cornerRadius(2)();

  const getBlobColor = (value) => {
    if (value >= 0 && value <= 25) return theme.palette.error.main;
    if (value > 25 && value <= 50) return theme.palette.warning.main;
    if (value > 50 && value <= 75) return theme.palette.success.main;
    if (value >= 75) return theme.palette.primary.main;
  };

  const percentScale = scaleLinear()
    .domain([0, 100]) // min and max values
    .range([0, 1]);
  const percent = percentScale(value);
  const angleScale = scaleLinear()
    .domain([0, 1])
    .range([-Math.PI / 2, Math.PI / 2])
    .clamp(true);
  const angle = angleScale(percent);
  const markerLocation = getCoordsOnArc(angle, 1 - (1 - 0.9) / 2);

  return (
    <Paper sx={{ py: 5 }}>
      <svg viewBox={[-1, -1, 2, 1].join(" ")}>
        <path d={redArc} fill={theme.palette.error.main} />
        <path d={orangeArc} fill={theme.palette.warning.main} />
        <path d={greenArc} fill={theme.palette.success.main} />
        <path d={blueArc} fill={theme.palette.primary.main} />
        <circle
          cx={markerLocation[0]}
          cy={markerLocation[1]}
          r="0.07"
          strokeWidth="0.04"
          fill="white"
          stroke={getBlobColor(value)}
        />
        <text // TODO: fix text position
          x="-0.3"
          y="-0.01"
          fill={getBlobColor(value)}
          style={{ color: "red", fontSize: "0.5px" }}
        >
          {value}
        </text>
      </svg>
      <Container align="center" style={{ padding: 10 }}>
        <Typography component="div">
          Your score is{" "}
          <Box
            sx={{
              display: "inline",
              color: "#023020",
              backgroundColor: "#DFF9D8",
              fontWeight: "bold",
            }}
          >
            Excellent
          </Box>
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: theme.palette.text.secondary }}
        >
          You've imporved by{" "}
          <Box
            sx={{
              display: "inline",
              color: "#green",
              fontWeight: "bold",
            }}
          >
            1.23%
          </Box>{" "}
          since last month
        </Typography>
      </Container>
    </Paper>

    /*<Box
      sx={{
        p: 22,
      }}
    >
      {" "}
    </Box>*/
  );
}

const getCoordsOnArc = (angle, offset = 10) => [
  Math.cos(angle - Math.PI / 2) * offset,
  Math.sin(angle - Math.PI / 2) * offset,
];
