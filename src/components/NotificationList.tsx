import React, { useEffect, useState } from 'react';
import { notificationService, AppNotification } from '../services/NotificationService';
import { Link } from 'react-router-dom';

const NotificationList: React.FC = () => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    const subscription = notificationService.list().subscribe(setNotifications);
    return () => subscription.unsubscribe();
  }, []);

  const markAsRead = (notification: AppNotification) => {
    notificationService.markAsRead(notification);
  };

  return (
    <div className="notification-list container mt-4">
      <h2>Powiadomienia</h2>
      {notifications.length === 0 ? (
        <p>Brak powiadomień</p>
      ) : (
        <ul className="list-group">
          {notifications.map((notification, index) => (
            <li key={index} className={`list-group-item ${notification.read ? '' : 'list-group-item-info'}`}>
              <h5>{notification.title}</h5>
              <p>{notification.message}</p>
              <p><small>{notification.date}</small></p>
              {!notification.read && (
                <button
                  className="btn btn-primary"
                  onClick={() => markAsRead(notification)}
                >
                  Oznacz jako przeczytane
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
      <Link to="/" className="btn btn-secondary mt-3">Wróć do strony głównej</Link>
    </div>
  );
};

export default NotificationList;
