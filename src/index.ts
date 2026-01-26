import express from 'express';
import cors from 'cors';
import route from './routes/route';
import { setupSwagger } from './config/swagger.setup';

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Setup Swagger documentation
setupSwagger(app);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the Elite Cron API' });
});

app.use('/api/v1', route);

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
  console.log(`Swagger documentation available at http://localhost:${port}/api-docs`);
  console.log(`Swagger JSON spec available at http://localhost:${port}/api-docs.json`);
});