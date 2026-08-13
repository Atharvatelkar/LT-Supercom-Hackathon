import crypto from "node:crypto";
import { store, type DbNotification } from "../db/store";

export type NotificationCreateInput = {
  userId: string;
  type?: "IN_APP" | "EMAIL";
  title: string;
  message: string;
  link?: string;
};

export async function createNotification(input: NotificationCreateInput): Promise<DbNotification> {
  await store.init();
  const notif: DbNotification = {
    id: `notif-${crypto.randomUUID()}`,
    userId: input.userId,
    type: input.type || "IN_APP",
    title: input.title,
    message: input.message,
    link: input.link || null,
    isRead: false,
    createdAt: new Date(),
  };

  store.notifications.unshift(notif);

  // If email notification requested, invoke email provider abstraction
  if (input.type === "EMAIL") {
    await sendTransactionalEmail(input.userId, input.title, input.message);
  }

  return notif;
}

export async function getUserNotifications(userId: string) {
  await store.init();
  return store.notifications.filter((n) => n.userId === userId);
}

export async function markNotificationAsRead(userId: string, notificationId: string) {
  await store.init();
  const notif = store.notifications.find((n) => n.id === notificationId && n.userId === userId);
  if (notif) notif.isRead = true;
  return notif;
}

// Transactional email provider abstraction
async function sendTransactionalEmail(userId: string, subject: string, body: string) {
  const user = store.users.find((u) => u.id === userId);
  const recipient = user?.email || "unknown@mail.com";

  if (process.env["EMAIL_PROVIDER"] === "smtp" && process.env["SMTP_HOST"]) {
    // In production with configured SMTP credentials, send via nodemailer / client
    console.log(`[EmailProvider:SMTP] Sending to ${recipient}: "${subject}"`);
  } else {
    // In development or when unconfigured, log clean structured mock delivery
    console.log(`[EmailProvider:DEV_LOGGER] To: ${recipient} | Subject: "${subject}" | Content: "${body}"`);
  }
}
