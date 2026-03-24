import * as z from 'zod';

export const vsCodeEvent = z.object({
  project_name: z.string().min(5).max(20),
  language: z.string().min(5).max(20),
  time: z.number().min(5).max(20),
  branch: z.string().min(3).max(20),
  session_start: z.iso.datetime(),
  session_end: z.iso.datetime(),
});

export type vsCodeEventType = z.infer<typeof vsCodeEvent>;
