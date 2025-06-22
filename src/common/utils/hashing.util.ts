import * as bcrypt from 'bcryptjs';

export const hashPassword = async (password: string): Promise<string> => {
  const SALT_ROUNDS = 10;
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  return hashedPassword;
};

export const comparePasswords = async (
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  const isValidPassword = await bcrypt.compare(plainPassword, hashedPassword);
  return isValidPassword;
};
