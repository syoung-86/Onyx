import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export const setupNotificationChannel = async (channelId: string, channelName: string, channelDescription: string) => {
  if (Platform.OS === 'android') {
    const channel = {
      id: channelId,
      name: channelName,
      description: channelDescription,
      sound: 'default',
      importance: Notifications.AndroidImportance.MAX,
    };

    await Notifications.setNotificationChannelAsync(channelId, channel);
  }
};

export const scheduleNotification = async (channelId: string, title: string, body: string, delaySeconds = 1) => {
  const schedulingOptions = {
    content: {
      title: title,
      body: body,
      sound: true,
    },
    trigger: {
        channelId: channelId,
        seconds: delaySeconds
    },
  };

  console.log("Scheduled Notifcation: ", schedulingOptions);
  const notifId = await Notifications.scheduleNotificationAsync(schedulingOptions);
  return notifId;
};

export const cancelNotification = async (notifId: string) => {
    console.log("cancelled notif: ",notifId );
await Notifications.cancelScheduledNotificationAsync(notifId);
}
export default scheduleNotification;


