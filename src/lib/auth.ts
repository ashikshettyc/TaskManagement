import jwt from 'jsonwebtoken';
const SECRET = process.env.JWT_SECRET || 'secret';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const signToken = (payload: any) => jwt.sign(payload, SECRET, { expiresIn: '7d' });
export const verifyToken = (token: string) => jwt.verify(token, SECRET);
