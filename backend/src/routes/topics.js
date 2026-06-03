import { Router } from 'express';
import { topics } from '../data/topics.js';

export const topicsRouter = Router();

topicsRouter.get('/', (_req, res) => {
  res.json({
    ok: true,
    count: topics.length,
    topics,
  });
});
