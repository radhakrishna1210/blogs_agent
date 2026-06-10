import { Router } from 'express';
import { adminRouter } from './admin.js';
import { categoriesRouter } from './categories.js';
import { blogsRouter } from './blogs.js';
import { healthRouter } from './health.js';
import { meRouter } from './me.js';
import { topicsRouter } from './topics.js';
import { uploadRouter } from './upload.js';
import { subscribersRouter } from './subscribers.js';

export const apiRouter = Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/categories', categoriesRouter);
apiRouter.use('/blogs', blogsRouter);
apiRouter.use('/me', meRouter);
apiRouter.use('/admin', adminRouter);
apiRouter.use('/topics', topicsRouter);
apiRouter.use('/upload', uploadRouter);
apiRouter.use('/subscribers', subscribersRouter);
