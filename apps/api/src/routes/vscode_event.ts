import express, { Router } from 'express';
import { validateData } from '../middleware/Validation';
import { vsCodeEvent, vsCodeEventArr } from '../schema/vs-code-event';
import { prisma } from '../lib/prisma';

const router: Router = express.Router();

export const user_router: Router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Vs Code Event endpoints' });
});

router.post('/add', validateData(vsCodeEventArr), async (req: any, res) => {
  const eventArr = req.body;

  if (!Array.isArray(eventArr) || eventArr.length === 0) {
    return res.status(400).json({ message: 'Invalid or empty events array' });
  }

  const syncedEvent: any[] = [];
  const failedEvent: any[] = [];

  for (let i = 0; i < eventArr.length; i++) {
    const rawEvent = eventArr[i];

    const parsed = vsCodeEvent.safeParse(rawEvent);

    if (!parsed.success) {
      failedEvent.push({
        session_id: rawEvent?.session_id,
        status: 'validation_failed',
        error: parsed.error.flatten(),
      });
      continue;
    }

    const e = parsed.data;

    try {
      const newEvent = await prisma.vsCodeEvent.upsert({
        where: {
          session_id: e.session_id,
        },
        update: {
          time: e.time,
        },
        create: {
          project_name: e.project_name,
          language: e.language || 'unknown',
          branch: e.branch || 'unknown',
          time: e.time,
          session_start: new Date(e.session_start),
          session_id: e.session_id,
          userId: req.user.id,
        },
      });

      syncedEvent.push({
        session_id: newEvent.session_id,
        status: 'synced',
      });
    } catch (err: any) {
      console.log(' DB error:', err.message);

      failedEvent.push({
        session_id: e.session_id,
        status: 'db_failed',
        error: err.message,
      });
    }
  }

  return res.json({
    message: 'Vs Code event sync completed',
    success_count: syncedEvent.length,
    failed_count: failedEvent.length,
    syncedEvent,
    failedEvent,
  });
});

user_router.get('/', async (req: any, res) => {
  const user = req.user;

  try {
    const events = await prisma.vsCodeEvent.findMany({
      where: {
        userId: user.id,
      },
    });

    return res.json({
      message: 'Vs Code events fetched successfully',
      data: events,
    });
  } catch (error) {
    console.log({ error });
    return res.json({ message: 'Vs Code event fetching failed' });
  }
});

export default router;
