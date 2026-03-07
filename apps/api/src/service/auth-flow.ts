import {
  authAccountsService,
  businessesService,
  businessMembershipsService,
  invitesService,
  userSessionsService,
  usersService,
} from "@codemit/db/services";

import { generateToken, hashPassword, hashToken, verifyPassword } from "../utils/security";

type SessionResult = {
  accessToken: string;
  expiresAt: Date;
};

const SESSION_DAYS = 14;

const createSession = async (userId: string): Promise<SessionResult> => {
  const accessToken = generateToken(32);
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  await userSessionsService.createOne({
    userId,
    tokenHash: hashToken(accessToken),
    expiresAt,
  });

  return { accessToken, expiresAt };
};

const createDefaultWorkspace = async (
  userId: string,
  businessName: string,
  businessCategory = "General",
) => {
  const business = await businessesService.createOne({
    ownerUserId: userId,
    name: businessName,
    category: businessCategory,
    aiFaq: "",
  });

  if (!business) {
    throw new Error("Failed to create default workspace");
  }

  await businessMembershipsService.createOne({
    businessId: business.id,
    userId,
    role: "OWNER",
  });

  return business;
};

export const registerOwner = async (input: {
  fullName: string;
  email: string;
  password: string;
  businessName?: string;
  businessCategory?: string;
}) => {
  const existing = await usersService.findByEmail(input.email);
  if (existing) throw new Error("Email already registered");

  const user = await usersService.createOne({
    fullName: input.fullName,
    email: input.email,
    passwordHash: hashPassword(input.password),
  });

  if (!user) throw new Error("Failed to create user");

  await authAccountsService.createOne({
    userId: user.id,
    provider: "LOCAL",
    providerUserId: input.email.toLowerCase(),
    email: input.email.toLowerCase(),
  });

  const business = await createDefaultWorkspace(
    user.id,
    input.businessName?.trim() || `${input.fullName}'s Workspace`,
    input.businessCategory?.trim() || "General",
  );

  const session = await createSession(user.id);
  return { user, business, session };
};

export const loginLocal = async (input: { email: string; password: string }) => {
  const user = await usersService.findByEmail(input.email);
  if (!user?.passwordHash) throw new Error("Invalid email or password");

  if (!verifyPassword(input.password, user.passwordHash)) {
    throw new Error("Invalid email or password");
  }

  const session = await createSession(user.id);
  return { user, session };
};

export const loginGoogle = async (input: {
  googleId: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
}) => {
  const existingAccount = await authAccountsService.findGoogleAccountByProviderId(input.googleId);

  let user = existingAccount
    ? await usersService.findById(existingAccount.userId)
    : null;

  if (!user) {
    const userByEmail = await usersService.findByEmail(input.email);

    if (userByEmail) {
      user = userByEmail;
    } else {
      user = await usersService.createOne({
        fullName: input.fullName,
        email: input.email,
        avatarUrl: input.avatarUrl,
      });
    }

    if (!user) throw new Error("Failed to resolve user");

    await authAccountsService.createOneIgnoreConflict({
        userId: user.id,
        provider: "GOOGLE",
        providerUserId: input.googleId,
        email: input.email,
      });
  }

  const ownerMembership = await businessMembershipsService.findOwnerMembershipByUser(user.id);

  let business = null;
  if (!ownerMembership) {
    business = await createDefaultWorkspace(user.id, `${input.fullName}'s Workspace`, "General");
  }

  const session = await createSession(user.id);
  return { user, business, session };
};

export const getSessionUser = async (accessToken: string) => {
  const tokenHash = hashToken(accessToken);
  const session = await userSessionsService.findValidByTokenHash(tokenHash);
  if (!session) return null;

  const user = await usersService.findById(session.userId);

  if (!user) return null;
  return { user, session };
};

export const expireInviteIfNeeded = async (inviteId: string) => {
  const invite = await invitesService.findById(inviteId);

  if (!invite) return null;
  if (invite.status !== "PENDING") return invite;
  if (invite.expiresAt > new Date()) return invite;

  const updated = await invitesService.setExpired(invite.id);
  return updated ?? invite;
};
