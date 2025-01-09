import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

let notificationConfigured = false;

export async function initializeNotifications() {
  if (notificationConfigured) return;
  
  try {
    // Configurar cómo se manejan las notificaciones
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    // Solicitar permisos (solo en iOS)
    if (Platform.OS === 'ios') {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('No se otorgaron permisos de notificación');
        return;
      }
    }

    notificationConfigured = true;
  } catch (error) {
    console.log('Error al inicializar notificaciones:', error);
  }
}

export async function scheduleNotification(taskId, taskText, date) {
  if (!notificationConfigured) {
    await initializeNotifications();
  }

  try {
    if (!taskId || !taskText || !date) {
      console.log('Faltan datos para programar la notificación');
      return;
    }

    // Cancelar notificación existente si la hay
    await cancelNotification(taskId);

    // Programar nueva notificación
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: '¡Tarea Pendiente!',
        body: `Tienes que realizar: ${taskText}`,
        data: { taskId },
      },
      trigger: {
        date: new Date(date),
      },
    });

    return identifier;
  } catch (error) {
    console.log('Error al programar notificación:', error);
  }
}

export async function cancelNotification(taskId) {
  try {
    const notifications = await Notifications.getAllScheduledNotificationsAsync();
    const notification = notifications.find(n => n.content.data?.taskId === taskId);
    if (notification) {
      await Notifications.cancelScheduledNotificationAsync(notification.identifier);
    }
  } catch (error) {
    console.log('Error al cancelar notificación:', error);
  }
}

export async function updateNotification(taskId, taskText, date) {
  try {
    await cancelNotification(taskId);
    if (date) {
      await scheduleNotification(taskId, taskText, date);
    }
  } catch (error) {
    console.log('Error al actualizar notificación:', error);
  }
} 