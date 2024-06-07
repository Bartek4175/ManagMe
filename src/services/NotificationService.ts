import { Observable, BehaviorSubject } from 'rxjs';

export type ISOString = string;

export type AppNotification = {
  title: string;
  message: string;
  date: ISOString;
  priority: 'low' | 'medium' | 'high';
  read: boolean;
};

class NotificationService {
  private notifications: AppNotification[] = [];
  private notificationsSubject: BehaviorSubject<AppNotification[]> = new BehaviorSubject<AppNotification[]>([]);
  private unreadCountSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  send(notification: AppNotification) {
    this.notifications.push(notification);
    this.notificationsSubject.next(this.notifications.slice()); // Emit a new value
    this.updateUnreadCount();
    if (notification.priority === 'medium' || notification.priority === 'high') {
      this.showNotificationDialog(notification);
    }
  }

  list(): Observable<AppNotification[]> {
    return this.notificationsSubject.asObservable();
  }

  unreadCount(): Observable<number> {
    return this.unreadCountSubject.asObservable();
  }

  private updateUnreadCount() {
    const unreadCount = this.notifications.filter(notification => !notification.read).length;
    this.unreadCountSubject.next(unreadCount);
  }

  private showNotificationDialog(notification: AppNotification) {
    // Implementacja okna dialogowego z powiadomieniami
    alert(`Notification: ${notification.title} - ${notification.message}`);
  }

  markAsRead(notification: AppNotification) {
    const index = this.notifications.findIndex(n => n === notification);
    if (index !== -1) {
      this.notifications[index].read = true;
      this.notificationsSubject.next(this.notifications.slice()); // Emit a new value
      this.updateUnreadCount();
    }
  }
}

export const notificationService = new NotificationService();
