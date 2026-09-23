import { app } from '../server/app';

// Vercel Serverless Function entrypoint
export default function handler(req: any, res: any) {
  return app(req, res);
}
