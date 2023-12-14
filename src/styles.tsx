import{StyleSheet} from "react-native";
import { themeColors } from "./themes/catppuchin-mocha";

export const styles = StyleSheet.create({
  container : {
    flexDirection : 'row',
    alignItems : 'flex-start',
    justifyContent : 'center',
    height : 'auto',            // Adjust the height as needed
    borderBottomWidth : 2,      // Add a border to underline the current page
    borderBottomColor : 'blue', // Color for the underline
  },
  contentContainer : {
    justifyContent : 'center',
    alignItems : 'center',
  },
  button : {
    padding : 10,
    marginHorizontal : 10, // Adjust the spacing between buttons
    color : 'gray',
  },
  buttonText : {
    fontSize : 16,
    fontWeight : 'bold',
  },

  timerText : {
    fontSize : 48,
    fontWeight : 'bold',
  },
  input: {
    width: 200,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  // Background Elements
  backgroundPane: {
    backgroundColor: themeColors.Base,
  },
  secondaryPanes: {
    backgroundColor: themeColors.Crust, // or Mantle for a different background
  },
  surfaceElements: {
    backgroundColor: themeColors.Surface0, // or Surface1, Surface2 for different levels
  },
    overlay0: {
      backgroundColor: themeColors.Overlay0,
    },
    overlay1: {
      backgroundColor: themeColors.Overlay1,
    },
    overlay2: {
      backgroundColor: themeColors.Overlay2,
    },

  // Text Elements
    bodyCopy: {
      color: themeColors.Text,
    },
    mainHeadline: {
      color: themeColors.Text,
    },
    subHeadlinesLabels: {
      color: themeColors.Subtext0, // or Subtext1 for a different level
    },
    subtle: {
      color: themeColors.Overlay1,
    },
    linksURLs: {
      color: themeColors.Blue,
    },
    success: {
      color: themeColors.Green,
    },
    warnings: {
      color: themeColors.Yellow,
    },
    errors: {
      color: themeColors.Red,
    },
    tagsPills: {
      color: themeColors.Blue,
    },
    selectionBackground: {
      backgroundColor: `${themeColors.Surface2}80`, // 40%-60% opacity
    },
    cursor: {
      color: themeColors.Rosewater,
    },
});


export const NavigationTheme = {
  dark: false,
  colors: {
    primary: themeColors.Blue,
    background: themeColors.Surface0,
    card: themeColors.Surface1,
    text: themeColors.Text,
    border: themeColors.Subtext1,
    notification: themeColors.Red,
  },
};
export const MyTheme = {
  dark: false,
  colors: {
    primary: themeColors.Blue,
    background: themeColors.Surface0,
    card: themeColors.Surface1,
    text: themeColors.Text,
    border: themeColors.Subtext1,
    notification: themeColors.Red,
  },
};
