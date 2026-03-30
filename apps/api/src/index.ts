import express from 'express';
import authRoutes from './routes/auth';
import vscodeRoutes, { user_router } from './routes/vscode_event';
import cors from 'cors';
import { validateExtension, validateUser } from './middleware/auth';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());

app.use(cors());
app.use(cookieParser());

app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/vscode-event', validateExtension, vscodeRoutes);
app.use('/api/user/vscode-event', validateUser, user_router);

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
