import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Deliverable 1: these endpoints are stubbed. They accept the request data
// the frontend forms send, but do not touch a database or perform real
// authentication yet - that arrives with the MongoDB integration in
// Deliverable 2.

app.post('/api/auth/signup', (req, res) => {
  const { name, email } = req.body || {};

  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required.' });
  }

  return res.status(201).json({
    message: 'Account created (stubbed).',
    user: {
      id: 'stub-user-id',
      name,
      email,
    },
  });
});

app.post('/api/auth/signin', (req, res) => {
  const { email } = req.body || {};

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  return res.status(200).json({
    message: 'Signed in (stubbed).',
    user: {
      id: 'stub-user-id',
      email,
      name: 'Dummy User',
    },
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Doodlr backend (stubbed) listening on port ${PORT}`);
});
