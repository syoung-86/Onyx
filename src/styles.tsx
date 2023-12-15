import{Appearance, StyleSheet} from "react-native";
import { themeColors as darkTheme } from "./themes/Dark";
import { themeColors as lightTheme } from "./themes/Light";

const colorScheme = Appearance.getColorScheme();

export var themeColors = darkTheme;
if (colorScheme === 'dark'){
    themeColors = darkTheme;
} else {
    themeColors = lightTheme;

}

export const styles = StyleSheet.create({
  list: {
    color: themeColors.Text,
  },
  container : {
    flexDirection : 'row',
    dispaly: 'flex',
    borderColor: themeColors.Base,
    textAlign: 'center',
    alignItems: 'center',
  },

  calendar : {
    backgroundColor: themeColors.Base,
    borderColor: themeColors.Base,
    opacity: 1,
  },
  contentContainer : {
    justifyContent : 'center',
    alignItems : 'center',
    paddingTop: 50,
  },
  button : {
    padding : 10,
    color : themeColors.Text,
  },
  buttonText : {
    fontSize : 16,
    fontWeight : 'bold',
    color: themeColors.Text,
    backgroundColor: themeColors.Mantle,
    padding: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: themeColors.Mantle,
  },

  timerText : {
    fontSize : 48,
    fontWeight : 'bold',
  },
  input: {
    width: 200,
    height: 40,
    borderColor: themeColors.Surface0,
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    paddingTop: 10,
    color: themeColors.Text,
    backgroundColor: themeColors.Crust,
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
    background: themeColors.Crust,
    card: themeColors.Base,
    text: themeColors.Text,
    border: themeColors.Subtext1,
    notification: themeColors.Red,
  },
};
export const MyTheme = {
  dark: false,
  colors: {
    primary: themeColors.Blue,
    background: themeColors.Crust,
    card: themeColors.Surface1,
    text: themeColors.Text,
    border: themeColors.Subtext1,
    notification: themeColors.Red,
  },
};

export const CalendarTheme = {

  backgroundColor: styles.backgroundPane.backgroundColor,
  calendarBackground: styles.secondaryPanes.backgroundColor,
  textSectionTitleColor: styles.mainHeadline.color,
  textSectionTitleDisabledColor: styles.overlay1.backgroundColor,
  selectedDayBackgroundColor: themeColors.Blue,
  selectedDayTextColor: styles.bodyCopy.color,
  todayTextColor: styles.success.color,
  dayTextColor: styles.subtle.color,
  textDisabledColor: styles.overlay1.backgroundColor,
  dotColor: styles.overlay2.backgroundColor,
  selectedDotColor: styles.overlay2.backgroundColor,
  arrowColor: styles.overlay2.backgroundColor,
  disabledArrowColor: styles.overlay1.backgroundColor,
  monthTextColor: styles.overlay1.backgroundColor,
  indicatorColor: styles.overlay2.backgroundColor,
  textDayFontFamily: 'monospace',
  textMonthFontFamily: 'monospace',
  textDayHeaderFontFamily: 'monospace',
  textDayFontWeight: '300', // Adjusted to match the expected type
  textMonthFontWeight: 'bold',
  textDayHeaderFontWeight: '300',
  textDayFontSize: 16,
  textMonthFontSize: 16,
  textDayHeaderFontSize: 16,
}

export const graphColors = Object.values(themeColors).slice(0,14);
