export const USER_ROLE = ["MANAGER", "EMPLOYEE", "OWNER"] as const;

export const SUBS_PLAN = ["FREE", "PRO", "BASIC"] as const;

export const STATUS_BUSINESS_PROFILE = [
  "ACTIVE",
  "SUSPENDED",
  "DELETED",
] as const;

export const PAYMENT_STATUS = [
  "IN_PROGRESS",
  "COMPLETED",
  "REJECTED",
  "IN_REVIEW",
] as const;

export const PAYMENT_TYPE = ["INCOME", "OUTCOME"] as const;

export const PAYMENT_RESOURCE = [
  "SUBSCRIPTION",
  "EXTRA_BOT",
  "INSTAGRAM_BOT",
] as const;

export const CHAT_ROLE = ["CLIENT", "SYSTEM", "MANAGER"] as const;

export const CLIENT_STATUS = ["ACTIVE", "INACTIVE"] as const;

export const INVITE_STATUS = [
  "PENDING",
  "USED",
  "EXPIRED",
  "CANCELLED",
] as const;

export const USER_TYPES = ["ADMIN", ...USER_ROLE] as const;
