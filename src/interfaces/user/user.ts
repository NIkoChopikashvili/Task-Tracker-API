export interface UserProfile {
  _id?: string;
  email: string;
  phone?: string;
  emailVerify?: boolean;
  password: string;
  phoneVerify?: boolean;
  verified?: boolean;
  nickname?: string;
  location?: string;
  birthDate?: Date;
}
