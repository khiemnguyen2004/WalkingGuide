import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { getUserNotifications, getUnreadCount, markAllAsRead, updateNotification } from '../api/notificationApi';

const NotificationIcon = () => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await getUserNotifications(user.id);
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await getUnreadCount(user.id);
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await updateNotification(notificationId, { is_read: true });
      setNotifications(prev => 
        prev.map(notif => 
          notif.notification_id === notificationId 
            ? { ...notif, is_read: true }
            : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead(user.id);
      setNotifications(prev => prev.map(notif => ({ ...notif, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'tour_reminder':
        return 'bi bi-calendar-event text-warning';
      case 'tour_completion':
        return 'bi bi-check-circle text-success';
      case 'tour_created':
        return 'bi bi-plus-circle text-primary';
      default:
        return 'bi bi-bell text-info';
    }
  };

  if (!user) return null;

  return (
    <div className="position-relative">
      <button
        className="btn rounded-circle p-0 d-flex align-items-center justify-content-center border-0 position-relative"
        style={{ width: 48, height: 48, background: 'none', boxShadow: 'none' }}
        onClick={() => setShowDropdown(!showDropdown)}
        aria-label="Notifications"
      >
        <i className="bi bi-bell" style={{ fontSize: 24, color: '#1a5bb8' }}></i>
        {unreadCount > 0 && (
          <span 
            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
            style={{ fontSize: '0.7rem', transform: 'translate(-50%, -50%)' }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div 
          className="dropdown-menu show position-absolute"
          style={{ 
            minWidth: 350, 
            maxWidth: 400, 
            maxHeight: 500, 
            overflowY: 'auto',
            right: 0,
            left: 'auto',
            zIndex: 1000,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            border: 'none',
            borderRadius: '12px'
          }}
        >
          <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
            <h6 className="mb-0 fw-bold">Thông báo</h6>
            {unreadCount > 0 && (
              <button 
                className="btn btn-sm btn-outline-primary"
                onClick={handleMarkAllAsRead}
              >
                Đánh dấu đã đọc
              </button>
            )}
          </div>

          <div className="p-0">
            {loading ? (
              <div className="text-center p-3">
                <div className="spinner-border spinner-border-sm text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center p-4 text-muted">
                <i className="bi bi-bell-slash" style={{ fontSize: '2rem' }}></i>
                <p className="mt-2 mb-0">Không có thông báo nào</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification.notification_id}
                  className={`p-3 border-bottom ${!notification.is_read ? 'bg-light' : ''}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleMarkAsRead(notification.notification_id)}
                >
                  <div className="d-flex align-items-start">
                    <div className="me-3 mt-1">
                      <i className={getNotificationIcon(notification.type)} style={{ fontSize: '1.2rem' }}></i>
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start">
                        <p className="mb-1" style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                          {notification.content}
                        </p>
                        {!notification.is_read && (
                          <span className="badge bg-primary rounded-pill ms-2" style={{ fontSize: '0.6rem' }}>
                            Mới
                          </span>
                        )}
                      </div>
                      <small className="text-muted">
                        {formatDate(notification.created_at)}
                      </small>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-2 text-center">
              <small className="text-muted">
                {notifications.length} thông báo
              </small>
            </div>
          )}
        </div>
      )}

      {/* Click outside to close */}
      {showDropdown && (
        <div 
          className="position-fixed" 
          style={{ top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }}
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default NotificationIcon; 