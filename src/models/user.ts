import { UserProfile } from "../interfaces/user/user";
import { getDb } from "../config/db-setup";
import { ObjectId } from "mongodb";

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

    return user;
  }

  static async userProfile(userId: string): Promise<UserProfile | null> {
    const userProfile = await getDb()
      .db()
      .collection("TT_Users")
      .findOne<UserProfile>({ _id: new ObjectId(userId) });

    return userProfile;
  }

  static async verifyEmail(
    email: string
  ): Promise<Array<number | null | unknown>> {
    try {
      await getDb()
        .db()
        .collection("TT_User")
        .updateOne({ email }, { $set: { emailVerify: true } });
      return ["success", null];
    } catch (error) {
      return [null, error];
    }
  }

  static async findEmailCode(email: string, emailCode: number): Promise<any> {
    try {
      const code = await getDb()
        .db()
        .collection("TT_User")
        .findOne({ email, emailCode });
      return [code.emailCode, null];
    } catch (err) {
      console.log(err);
      return [null, err];
    }
  }
}
