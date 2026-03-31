import * as z from 'zod';

export const vsCodeEvent = z.object({
  project_name: z.string().min(1).max(50),
  language: z.string().min(1).max(30),
  time: z.number().min(0).max(1000),
  branch: z.string().min(1).max(50),
  session_start: z.string().datetime(),
  session_id: z.string().min(6).max(50),
});

export const vsCodeEventArr = z.array(vsCodeEvent);

export type vsCodeEventType = z.infer<typeof vsCodeEventArr>;
