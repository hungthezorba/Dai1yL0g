export type UserProfile = {
  id: string;
  displayName: string;
  username: string;
  timezone: string;
  birthYear: number;
  avatarUrl: string | null;
};

export type ProfileSetupInput = {
  displayName: string;
  username: string;
  timezone: string;
  birthYear: number;
};
