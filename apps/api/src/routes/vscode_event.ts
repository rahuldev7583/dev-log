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
  try {
    const syncedEvent = [];
    const eventArr = req.body;

    if (!eventArr) {
      return res.status(400).json({ message: 'Empty events' });
    }

    for (let i = 0; i < eventArr.length; i++) {
      const new_event = await prisma.vsCodeEvent.upsert({
        where: {
          session_id: eventArr[i].session_id,
        },
        update: {
          time: eventArr[i].time,
        },
        create: {
          project_name: eventArr[i].project_name,
          language: eventArr[i].language,
          branch: eventArr[i].branch,
          time: eventArr[i].time,
          session_start: eventArr[i].session_start,
          session_id: eventArr[i].session_id,
          userId: req.user.id,
        },
      });

      syncedEvent.push({
        session_id: new_event.session_id,
        sync_status: 'synced',
      });
    }

    return res.json({
      message: 'Vs Code event synced successfully',
      syncedEvent,
    });
  } catch (error) {
    console.log({ error });

    return res.status(400).json({ message: 'Error ' });
  }
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
