import jwt from 'jsonwebtoken';

export const generateToken = (payload: any) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) return 'JWT Secret not defined';

  const token = jwt.sign(payload, secret, { expiresIn: '30Mins' });

  return token;
};

export const verifyToken = (token: any) => {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) return 'JWT Secret not defined';

    const decode = jwt.verify(token, secret);

    return decode;
  } catch (error) {
    return false;
  }
};

export const generateExtensionToken = (payload: any) => {
  const secret = process.env.JWT_EXTENSION_SECRET;

  if (!secret) return 'JWT extension Secret not defined';

  try {
    const token = jwt.sign(payload, secret, { expiresIn: '7Days' });

    return token;
  } catch (error) {
    return false;
  }
};

export const verifyExtensionToken = (token: any) => {
  const secret = process.env.JWT_EXTENSION_SECRET;
  if (!secret) return 'JWT extension Secret not defined';

  try {
    const decode = jwt.verify(token, secret);

    return decode;
  } catch (error) {
    return false;
  }
};
