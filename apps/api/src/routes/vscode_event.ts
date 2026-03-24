import express, { Router } from 'express';
import { validateData } from '../middleware/Validation';
import { vsCodeEvent } from '../schema/vs-code-event';
import { prisma } from '../lib/prisma';

const router: Router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Vs Code Event endpoints' });
});

router.post('/add', validateData(vsCodeEvent), async (req: any, res) => {
  const req_body = req.body;

  const session_start = new Date(req_body.session_start);
  const session_end = new Date(req_body.session_end);

  if (session_end <= session_start) {
    return res
      .status(400)
      .json({ message: 'Session start must be smaller than session end' });
  }

  const event = await prisma.vsCodeEvent.findFirst({
    where: {
      session_start: req_body.session_start,
    },
  });

  if (event) {
    return res.status(400).json({
      message: 'Event with this session start time already exist',
    });
  }

  const new_event = await prisma.vsCodeEvent.create({
    data: {
      project_name: req_body.project_name,
      language: req_body.language,
      branch: req_body.branch,
      time: req_body.time,
      session_start: req_body.session_start,
      session_end: req_body.session_end,
      userId: req.user.id,
    },
  });

  res.json({ message: 'Vs Code event created successfully', data: new_event });
});

router.get('/get', async (req, res) => {
  const events = await prisma.vsCodeEvent.findMany();

  res.json({ message: 'Vs Code events fetched successfully', data: events });
});

export default router;
