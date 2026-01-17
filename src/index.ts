import express from 'express';
import cors from 'cors';
import route from './routes/route';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the Elite Cron API' });
});

app.use('/api/v1', route);

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});