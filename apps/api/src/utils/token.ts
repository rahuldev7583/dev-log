import jwt from 'jsonwebtoken';

export const generateToken = (payload: any) => {
  const secret = process.env['JWT_SECRET'];

  if (!secret) return 'Secret not defined';

  const token = jwt.sign(payload, secret, { expiresIn: '30Mins' });

  return token;
};
