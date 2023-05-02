import { useTheme } from "@mui/material/styles";
import { Box, Typography, Container, Paper } from "@mui/material";
import { arc } from "d3-shape";
import { scaleLinear } from "d3-scale";

export default function GaugeChart({ value }) {
  const theme = useTheme();

  /*const redArc = arc()
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
    */

  const redArc = arc()
    .innerRadius(1)
    .outerRadius(0.9)
    .startAngle(-Math.PI / 2)
    .endAngle(-Math.PI / 6)
    .padAngle(0.025)
    .cornerRadius(2)();

  const orangeArc = arc()
    .innerRadius(1)
    .outerRadius(0.9)
    .startAngle(-Math.PI / 6)
    .endAngle(Math.PI / 6)
    .padAngle(0.025)
    .cornerRadius(2)();

  const greenArc = arc()
    .innerRadius(1)
    .outerRadius(0.9)
    .startAngle(Math.PI / 6)
    .endAngle(Math.PI / 2)
    .padAngle(0.025)
    .cornerRadius(2)();

  const getBlobColor = (value) => {
    if (value >= 0 && value <= 33) return theme.palette.error.main;
    if (value > 33 && value <= 66) return theme.palette.warning.main;
    if (value >= 66) return theme.palette.success.main;
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

  let scorerate = "";
  if (value < 25) {
    scorerate = "Low ";
  } else if (value < 50) {
    scorerate = "Moderate ";
  } else if (value < 75) {
    scorerate = "Good ";
  } else {
    scorerate = "Excellent ";
  }

  return (
    <Paper sx={{ m: 5 }}>
      <svg viewBox={[-1, -1, 2, 1].join(" ")}>
        <path d={redArc} fill={theme.palette.error.main} />
        <path d={orangeArc} fill={theme.palette.warning.main} />
        <path d={greenArc} fill={theme.palette.success.main} />
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
        <Typography component="span">
          Your score is{" "}
          <Box
            sx={{
              display: "inline",
              color: "#023020",
              backgroundColor: "#DFF9D8",
              fontWeight: "bold",
            }}
          >
            {scorerate}
          </Box>
        </Typography>
        <br />
        <Typography
          component="span"
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
