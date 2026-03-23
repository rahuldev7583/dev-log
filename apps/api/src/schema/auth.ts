import * as z from 'zod';

export const signupSchema = z.object({
  name: z.string().min(3).max(12),
  email: z.email(),
  password: z.string().min(5),
});

export type signup = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(5),
});

export type Login = z.infer<typeof loginSchema>;
