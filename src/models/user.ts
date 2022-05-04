import { UserProfile } from "../interfaces/user/user";
import { getDb } from "../config/db-setup";

export default class User implements UserProfile {
  constructor(
    readonly email: string,
    readonly name: string,
    readonly password: string,
    readonly phone: string,
    readonly team?: string
  ) {}

  async addUser(): Promise<string | unknown> {
    return await getDb().db().collection("TT_Users").insertOne({
      email: this.email,
      name: this.name,
      password: this.password,
      phone: this.phone,
      phoneVerify: false,
      emailVerify: false,
      verified: false,
      createdAt: new Date(),
      team: this.team,
    });
  }

  static async checkEmailExists(email: string): Promise<UserProfile | null> {
    const user = await getDb()
      .db()
      .collection("TT_Users")
      .findOne<UserProfile>({ email });

    console.log(user);
    return user;
  }
}
