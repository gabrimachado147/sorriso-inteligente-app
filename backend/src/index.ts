import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import analysisRoutes from './routes/analyses';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/analyses', analysisRoutes);

export default app;

if (require.main === module) {
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}
