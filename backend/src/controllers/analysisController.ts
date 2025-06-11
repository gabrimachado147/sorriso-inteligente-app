import { Request, Response } from 'express';

export const createAnalysis = (req: Request, res: Response) => {
  // TODO: handle image upload and analysis
  res.json({ message: 'Create analysis placeholder' });
};

export const listAnalyses = (req: Request, res: Response) => {
  // TODO: fetch analyses from DB
  res.json([]);
};
