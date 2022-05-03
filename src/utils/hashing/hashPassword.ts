import bcrypt from "bcrypt";

export const hashPassword: (
  password: string
) => Promise<string | never> = async (password) => {
  const hashedPwd = await bcrypt.hash(password, 12);
  return hashedPwd;
};

export const comparePassword: (
  password: string,
  userPwd: string
) => Promise<boolean> = async (password, userPwd) => {
  try {
    const isCorrect = await bcrypt.compare(password, userPwd);
    return isCorrect;
  } catch (error) {
    console.log(error);
    return false;
  }
};
