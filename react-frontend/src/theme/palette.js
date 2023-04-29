import { alpha } from "@mui/material/styles";

// ----------------------------------------------------------------------

// SETUP COLORS
const GREY = {
  0: "#FFFFFF",
  100: "#F9FAFB",
  200: "#F4F6F8",
  300: "#DFE3E8",
  400: "#C4CDD5",
  500: "#919EAB",
  600: "#637381",
  700: "#454F5B",
  800: "#212B36",
  900: "#161C24",
};

const PRIMARY = {
  lighter: "#c8facd", // Same
  light: "#c8facd",
  main: "#00ab55",
  dark: "#007b55",
  darker: "#005249",
  contrastText: "#fff",
};

const SECONDARY = {
  lighter: "#cafdf5", // Same
  light: "#cafdf5",
  main: "#00b8d9",
  dark: "#006c9c",
  darker: "#003768",
  contrastText: "#fff",
};

const INFO = {
  lighter: "#cafdf5", //Same
  light: "#cafdf5",
  main: "#00b8d9",
  dark: "#006c9c",
  darker: "#003768",
  contrastText: "#fff",
};

const SUCCESS = {
  // Same as primary
  lighter: "#c8facd", // Same
  light: "#c8facd",
  main: "#00ab55",
  dark: "#007b55",
  darker: "#005249",
  contrastText: "#fff",
};

const WARNING = {
  lighter: "#fff5cc", //Same
  light: "#fff5cc",
  main: "#ffab00",
  dark: "#b76e00",
  darker: "#7a4100",
  contrastText: "#fff",
};

const ERROR = {
  lighter: "#ffe9d5", //Same
  light: "#ffe9d5",
  main: "#ff5630",
  dark: "#b71d18",
  darker: "#7a0916",
  contrastText: "#fff",
};

const palette = {
  common: { black: "#000", white: "#fff" },
  primary: PRIMARY,
  secondary: SECONDARY,
  info: INFO,
  success: SUCCESS,
  warning: WARNING,
  error: ERROR,
  grey: GREY,
  divider: alpha(GREY[500], 0.24),
  text: {
    primary: GREY[800],
    secondary: GREY[600],
    disabled: GREY[500],
  },
  background: {
    paper: "#fff",
    default: GREY[100],
    neutral: GREY[200],
  },
  action: {
    active: GREY[600],
    hover: alpha(GREY[500], 0.08),
    selected: alpha(GREY[500], 0.16),
    disabled: alpha(GREY[500], 0.8),
    disabledBackground: alpha(GREY[500], 0.24),
    focus: alpha(GREY[500], 0.24),
    hoverOpacity: 0.08,
    disabledOpacity: 0.48,
  },
};

export default palette;
