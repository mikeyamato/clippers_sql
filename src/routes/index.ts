import express, { Request, Response } from 'express';

import { router as testRouter } from './test';
import { router as dbRouter } from './database';

export const router = express.Router();

router.use('/test', testRouter);  // purely to test if routes work
router.use('/db', dbRouter);

router.all('*', (req: Request, res: Response) => {
	res.status(404).send({msg: "not found"});
})