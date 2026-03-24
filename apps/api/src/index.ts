import express from 'express';
import authRoutes from './routes/auth';
import vscodeRoutes from './routes/vscode_event';
import cors from 'cors';
import { validateUser } from './middleware/auth';

const app = express();

app.use(express.json());

app.use(cors());

app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/vscode-event', validateUser, vscodeRoutes);

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
