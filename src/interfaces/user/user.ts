export interface UserProfile {
  _id?: string;
  email: string;
  phone?: string;
  emailVerify?: boolean;
  password: string;
  phoneVerify?: boolean;
  verified?: boolean;
  name?: string;
  location?: string;
  birthDate?: Date;
  team?: string;
}
