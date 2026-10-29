import express from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import albumRoutes from './routes/albumRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import reportReasonRoutes from './routes/reportReasonRoutes.js';

dotenv.config({ quiet: true });

const app = express();
const PORT = process.env.PORT || 5000;

// The database connection lives in exactly one place: config/db.js.
await connectDB();

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
    credentials: true, // required so the session cookie is sent/received cross-origin
  }),
);
app.use(express.json({ limit: '10mb' })); // higher limit since post images are sent as base64 JSON

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'doodlr-dev-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      sameSite: 'lax',
    },
  }),
);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api', commentRoutes); // exposes /api/posts/:postId/comments and /api/comments/:id
app.use('/api/albums', albumRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/report-reasons', reportReasonRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Doodlr backend listening on port ${PORT}`);
});
