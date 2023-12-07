import * as Notifications from 'expo-notifications';

export const scheduleNotification = (seconds: number) => {
    const schedulingOptions = {
        content: {
            title: 'This is a notification',
            body: 'This is the body',
            sound: true,
            priority: Notifications.AndroidNotificationPriority.MAX,
            color: 'blue',
        },
        trigger: {
            seconds: seconds,
        },
    };
    Notifications.scheduleNotificationAsync(schedulingOptions);
};

export default scheduleNotification;
