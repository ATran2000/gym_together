import { extendTheme } from "@chakra-ui/react";

const styles = {
  global: {
    body: {
      bg: "#2D2D39",
      color: "white",
    },
  },
};

const fonts = {
  heading: "Oswald, sans-serif",
  body: "Roboto, sans-serif",
};

const colors = {
  bg_color_light: '#898DB7',
}

const theme = extendTheme({
  styles,
  fonts,
  colors,
});

export default theme;
