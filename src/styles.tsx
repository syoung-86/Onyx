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
    display: 'flex',
    borderColor: themeColors.Base,
    textAlign: 'center',
    alignItems: 'center',
  },

  calendar : {
    backgroundColor: themeColors.Base,
    borderColor: themeColors.Base,
    opacity: 1,
  },
  todoContainer: {
  },
  contentContainer : {
    alignItems: 'center',
    paddingTop: 10,
  },
  button : {
    padding : 10,
    color : themeColors.Text,
  },

  strikethrough: {
    fontSize : 15,
    fontWeight : 'bold',
    textDecorationLine : 'line-through',
    color: themeColors.Mauve,
  },
  toolbarButton : {
    fontSize : 15,
    fontWeight : 'bold',
    color: themeColors.Mauve,
  },
  buttonText : {
    fontSize : 16,
    fontWeight : 'bold',
    color: themeColors.Mauve,
    backgroundColor: themeColors.Mantle,
    padding: 5,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: themeColors.Base,
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundColor: themeColors.Base,
  },

  toolbarItem: {
      padding: 5,
alignItems: 'center', // Center content horizontally
  justifyContent: 'center', // Center content vertically
  width: 30, // Set a fixed width
  height: 30, // Set a fixed height
  },
  markdownToolbar:{
  flexDirection: 'row',
  flexWrap: 'wrap',
  padding: 15,
  height: 80,
  width: 300,
  backgroundColor: themeColors.Base,
  color: themeColors.Text,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: themeColors.Overlay0,
  },
  markdownInput: {
    width: 400,
    height: 200,
    borderColor: themeColors.Surface0,
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    paddingTop: 10,
    color: themeColors.Text,
    backgroundColor: themeColors.Base,
  },
  textInput: {
    width: 200,
    height: 40,
    borderColor: themeColors.Surface0,
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    paddingTop: 10,
    color: themeColors.Text,
    backgroundColor: themeColors.Base,
  },
  // Background Elements
  backgroundPane: {
    backgroundColor: themeColors.Text,
    color: themeColors.Text,
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
  dark: true,
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

export const markdownStyles =StyleSheet.create( {
  // The main container
  body: {
    backgroundColor: themeColors.Mantle,
      },

  // Headings
  heading1: {
    flexDirection: 'row',
    fontSize: 32,
    color: themeColors.Text,
    fontWeight : 'bold',
  },
  heading2: {
    flexDirection: 'row',
    fontSize: 24,
    color: themeColors.Text,
    fontWeight : 'bold',
  },
  heading3: {
    flexDirection: 'row',
    fontSize: 18,
    color: themeColors.Text,
    fontWeight : 'bold',
  },
  heading4: {
    flexDirection: 'row',
    fontSize: 16,
    color: themeColors.Text,
    fontWeight : 'bold',
  },
  heading5: {
    flexDirection: 'row',
    fontSize: 13,
    color: themeColors.Text,
    fontWeight : 'bold',
  },
  heading6: {
    flexDirection: 'row',
    fontSize: 11,
    color: themeColors.Text,
    fontWeight : 'bold',
  },

  // Horizontal Rule
  hr: {
    backgroundColor: themeColors.Overlay0,
    height: 1,
  },

  // Emphasis
  strong: {
    fontWeight: 'bold',
    color: themeColors.Text,
  },
  em: {
    fontStyle: 'italic',
    color: themeColors.Text,
  },
  s: {
    textDecorationLine: 'line-through',
    color: themeColors.Text,
  },

  // Blockquotes
  blockquote: {
    backgroundColor: themeColors.Base,
    borderColor: '#CCC',
    borderLeftWidth: 4,
    marginLeft: 5,
    paddingHorizontal: 5,
    color: themeColors.Text,
  },

  // Lists
  bullet_list: {},
  ordered_list: {},
  list_item: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    color: themeColors.Text,
  },
  // @pseudo class, does not have a unique render rule
  bullet_list_icon: {
    marginLeft: 10,
    marginRight: 10,
  },
  // @pseudo class, does not have a unique render rule
  bullet_list_content: {
    flex: 1,
  },
  // @pseudo class, does not have a unique render rule
  ordered_list_icon: {
    marginLeft: 10,
    marginRight: 10,
  },
  // @pseudo class, does not have a unique render rule
  ordered_list_content: {
    flex: 1,
  },

  // Code
  code_inline: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    backgroundColor: themeColors.Crust,
    padding: 10,
    borderRadius: 4,
    fontFamily: 'monospace',
    color: themeColors.Text,
  },
  code_block: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    backgroundColor: themeColors.Surface0,
    padding: 10,
    borderRadius: 4,
    fontFamily: 'monospace',
    colorScheme: themeColors,
    color: themeColors.Text,
  },
  fence: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    backgroundColor: themeColors.Surface0,
    padding: 10,
    borderRadius: 4,
    fontFamily: 'monospace',
    color: themeColors.Text,
  },

  // Tables
  table: {
    borderWidth: 1,
    borderColor: themeColors.Overlay2,
    borderRadius: 3,
  },
  thead: {},
  tbody: {},
  th: {
    flex: 1,
    padding: 5,
  },
  tr: {
    borderBottomWidth: 1,
    borderColor: themeColors.Overlay2,
    flexDirection: 'row',
  },
  td: {
    flex: 1,
    padding: 5,
  },

  // Links
  link: {
    textDecorationLine: 'underline',
  },
  blocklink: {
    flex: 1,
    borderColor: themeColors.Blue,
    borderBottomWidth: 1,
  },

  // Images
  image: {
    flex: 1,
  },

  // Text Output
  text: {},
  textgroup: {},
  paragraph: {
    marginTop: 10,
    marginBottom: 10,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    color: themeColors.Text,
    width: '100%',
  },
  hardbreak: {
    width: '100%',
    height: 1,
  },
  softbreak: {},

  // Believe these are never used but retained for completeness
  pre: {},
  inline: {},
  span: {},
});
