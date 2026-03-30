import * as z from 'zod';

export const vsCodeEvent = z.object({
  project_name: z.string().min(5).max(20),
  language: z.string().min(4).max(20),
  time: z.number().min(0.00001).max(20),
  branch: z.string().min(3).max(20),
  session_start: z.iso.datetime(),
  session_id: z.string().min(6).max(36),
});

export const vsCodeEventArr = z.array(vsCodeEvent);

export type vsCodeEventType = z.infer<typeof vsCodeEventArr>;
