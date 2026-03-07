export type InviteStartSuccess = {
  status: "success";
  data: {
    onboardingUrl: string;
    inviteId: string;
    businessId: string;
  };
};

export type InviteStartError = {
  status: "error";
  message: string;
};

export type InviteStartResponse = InviteStartSuccess | InviteStartError;
