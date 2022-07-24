import {
  NotificationType, Notification, NotificationSetting, User,
} from '../entities';

type Context = {
  recipient: User,
  sender: User,
  type: string,
  body: string,
  url: string,
  title: string,
  comment_id?: number,
  post_id?: number,
}

export async function sendNotification({
  recipient, sender, type, body, url, title, comment_id, post_id,
}: Context) {
  try {
    // find notification type
    const notificationType = await NotificationType.findOne({ type_name: type });
    if (!notificationType) throw Error('Notification type does not exist');

    // check if recipient allows notifications for
    const recipientNotificationSetting = await NotificationSetting.findOne({
      user_id: recipient.id,
      notification_type_id: notificationType.id,
    });
    if (!recipientNotificationSetting.value) return;

    // create notification
    await Notification.create({
      title,
      body,
      url,
      notification_type_id: notificationType.id,
      recipient_id: recipient.id,
      sender_id: sender.id,
      comment_id,
      post_id,
    }).save();
  } catch (err) {
    throw Error(err.message);
  }
}
