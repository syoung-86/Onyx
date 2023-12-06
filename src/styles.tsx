import{StyleSheet} from "react-native";

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
});
