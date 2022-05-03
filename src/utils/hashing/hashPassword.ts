import bcrypt from "bcrypt";

export const hashPassword: (
  password: string
) => Promise<string | never> = async (password) => {
  const hashedPwd = await bcrypt.hash(password, 12);
  return hashedPwd;
};
