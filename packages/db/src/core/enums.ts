import { pgEnum } from "drizzle-orm/pg-core";
import {
  CHAT_ROLE,
  CLIENT_STATUS,
  MEMBERS_ROLE,
  PAYMENT_RESOURCE,
  PAYMENT_STATUS,
  PAYMENT_TYPE,
  STATUS_BUSINESS_PROFILE,
  SUBS_PLAN,
  SYSTEM_ROLE,
} from "../helpers/constants";

// Business profile enums
export const BusinessProfileStatus = pgEnum(
  "business_profile_status",
  STATUS_BUSINESS_PROFILE,
);

// Payment enums
export const PaymentStatus = pgEnum("payment_status", PAYMENT_STATUS);
export const PaymentType = pgEnum("payment_type", PAYMENT_TYPE);
export const PaymentResource = pgEnum("payment_resource", PAYMENT_RESOURCE);

// User enums
export const SubscriptionPlanEnum = pgEnum("subscription_plan", SUBS_PLAN);

// Chat and client enums
export const ChatRole = pgEnum("chat_role", CHAT_ROLE);

// Client enums
export const ClientStatus = pgEnum("client_status", CLIENT_STATUS);
export const UserStatusEnum = pgEnum("user_status", [
  "ACTIVE",
  "INACTIVE",
  "SUSPENDED",
]);

export const MembersRole = pgEnum("members_role", MEMBERS_ROLE);
export const UserSystemRole = pgEnum("user_system_role", SYSTEM_ROLE);
