import { UserProfile } from "../interfaces/user/user";
import { getDb } from "../config/db-setup";

export default class Client implements UserProfile {
  constructor(
    readonly email: string,
    readonly nickname: string,
    readonly password: string,
    readonly phone: string,
    readonly personalId: string,
    readonly activity: string
  ) {}

  async addUser(): Promise<string | unknown> {
    return await getDb().db().collection("client").insertOne({
      email: this.email,
      nickname: this.nickname,
      password: this.password,
      phone: this.phone,
      phoneVerify: false,
      emailVerify: false,
      verified: false,
      createdAt: new Date(),
    });
  }
}
