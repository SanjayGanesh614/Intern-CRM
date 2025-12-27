import { Notification } from '../models/Notification';
import { sendEmail } from './emailService';
export const createNotification = async (userId, title, message, type = 'info', options = {}) => {
    try {
        const notification = await Notification.create({
            user_id: userId,
            title,
            message,
            type,
            link: options.link,
            related_entity_id: options.related_entity_id
        });
        // Email logic
        if (options.send_email && options.user_email) {
            await sendEmail(options.user_email, `New Notification: ${title}`, `<p>${message}</p><p><a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}${options.link || ''}">View in App</a></p>`);
        }
        return notification;
    }
    catch (error) {
        console.error('Error creating notification:', error);
        throw error;
    }
};
export const getUnreadNotifications = async (userId) => {
    return Notification.find({ user_id: userId, is_read: false })
        .sort({ created_at: -1 })
        .limit(20);
};
export const markAsRead = async (notificationId) => {
    return Notification.findOneAndUpdate({ notification_id: notificationId }, { is_read: true }, { new: true });
};
export const markAllAsRead = async (userId) => {
    return Notification.updateMany({ user_id: userId, is_read: false }, { is_read: true });
};
