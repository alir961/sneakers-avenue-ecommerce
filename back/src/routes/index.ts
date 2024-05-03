import { Router, Request, Response } from 'express';

const router = Router();

router.get('/api', (req: Request, res: Response): void => {
    res.status(200).json({ message: 'Welcome to Express API' });
});

export { router as globalRouter };
