import { extendTheme } from "@chakra-ui/react";
import "react-calendar/dist/Calendar.css"; // Need this import in order to style react-calendar

const styles = {
  global: {
    body: {
      bg: "#2D2D39",
      color: "white",
    },
    ".custom-calendar": {
      maxWidth: "100%",
      backgroundColor: "#898DB7",
      padding: "20px",
      borderRadius: "8px",
      color: "white",
      fontFamily: "Roboto, sans-serif",
    },
    ".custom-calendar button": {
      borderRadius: "3px",
      color: "white",
    },
    ".react-calendar__month-view__days__day--neighboringMonth": {
      opacity: 0.5,
    },
    ".react-calendar__tile--now": {
      backgroundColor: "#2D2D39",
    },
    ".react-calendar__tile--range": {
      boxShadow: "0 0 6px 2px black",
      backgroundColor: "#51546E",
    },
    ".react-calendar__tile:enabled:hover, .react-calendar__tile:enabled:focus": {
        backgroundColor: "#51546E",
      },
    ".react-calendar__navigation button:enabled:hover": {
      backgroundColor: "#51546E",
    },
    ".react-calendar__navigation button:enabled:focus": {
      backgroundColor: "#898DB7",
    },
  },
};

const fonts = {
  heading: "Oswald, sans-serif",
  body: "Roboto, sans-serif",
};

const colors = {
  bg_color_light: "#898DB7",
};

const theme = extendTheme({
  styles,
  fonts,
  colors,
});

export default theme;
