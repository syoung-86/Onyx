import React from 'react';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { themeColors } from './styles';

export const toastConfig = {
  success: ({ text1, props }) => (
    <BaseToast
      {...props}
      style={{ 
        borderLeftColor: themeColors.Green, 
        backgroundColor: themeColors.Mantle, // Example background color
        padding: 10
      }}
      contentContainerStyle={{ 
        paddingHorizontal: 15 
      }}
      text1Style={{
        fontSize: 15,
        fontWeight: '400',
        color: themeColors.Text // Example text color
      }}
      text1={text1}
    />
  ),
  // ... other types if needed
  error: (props) => (
    <ErrorToast
      {...props}
      style={{ 
        borderLeftColor: themeColors.Red, 
        backgroundColor: themeColors.Mantle, 
        padding: 10
      }}
      contentContainerStyle={{ 
        paddingHorizontal: 15 
      }}
      text1Style={{
        fontSize: 15,
        fontWeight: '400',
        color: themeColors.Text // Example text color
      }}
    />
  ),
};
    export const showSuccessToast = (msg: string) => {
        Toast.show({
            type: 'success',
            text1: msg,
            position: "bottom",
        });
    };

export default showSuccessToast;
