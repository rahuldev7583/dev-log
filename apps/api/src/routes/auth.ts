import express, { Router, type Request, type Response } from 'express';
import { prisma } from '../lib/prisma';
import { generateToken } from '../utils/token';
import { compare, genSalt, hash } from 'bcrypt';
import { validateData } from '../middleware/Validation';
import { loginSchema, signupSchema } from '../schema/auth';
import axios from 'axios';

const router: Router = express.Router();
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

router.get('/', (req, res) => {
  res.json({ message: 'Auth Routes' });
});

router.post(
  '/signup',
  validateData(signupSchema),
  async (req: Request, res: Response) => {
    const req_body = req.body;

    const user = await prisma.user.findFirst({
      where: {
        email: req_body.email,
      },
    });

    if (user) {
      return res.status(409).json({ message: 'User already exist' });
    }

    const salt = await genSalt(10);
    const password_hash = await hash(req_body.password, salt);

    const new_user = await prisma.user.create({
      data: {
        email: req_body.email,
        name: req_body.name,
        password: password_hash,
      },
    });

    const token = generateToken(new_user);

    return res
      .status(201)
      .json({ message: 'User created Successfully', token });
  },
);

router.post(
  '/login',
  validateData(loginSchema),
  async (req: Request, res: Response) => {
    const req_body = req.body;

    const user = await prisma.user.findFirst({
      where: {
        email: req_body.email,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User does not exist' });
    }

    if (!user.password) return 'password not available';

    const password_verify = await compare(req_body.password, user.password);

    if (!password_verify) {
      return res.status(403).json({ message: 'Incorrect password' });
    }

    const token = generateToken(user);

    return res.status(200).json({ message: 'LoggedIn Successfully', token });
  },
);

router.get('/google', (req, res) => {
  if (!GOOGLE_CLIENT_ID) return res.json('GOOGLE_CLIENT_ID not provided');

  const url = 'https://accounts.google.com/o/oauth2/v2/auth';

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: 'http://localhost:5000/api/auth/google/callback',
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent',
  });

  res.redirect(`${url}?${params.toString()}`);
});

router.get('/google/callback', async (req, res) => {
  const code = req.query.code;

  const resAuth = await axios.post('https://oauth2.googleapis.com/token', {
    client_id: GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_CLIENT_SECRET,
    code,
    redirect_uri: 'http://localhost:5000/api/auth/google/callback',
    grant_type: 'authorization_code',
  });

  const access_token = resAuth.data.access_token;

  const refresh_token = resAuth.data.refresh_token;
  const expires = resAuth.data.expires_in;

  const user_info = await axios.get(
    'https://www.googleapis.com/oauth2/v2/userinfo',
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    },
  );

  const exitingAcc = await prisma.account.findUnique({
    where: {
      provider_providerAccountId: {
        provider: 'google',
        providerAccountId: user_info.data.id,
      },
    },
    include: {
      userid: true,
    },
  });

  if (exitingAcc) {
    const user = await prisma.user.findFirst({
      where: {
        id: exitingAcc.userId,
      },
    });
    const token = generateToken(user);
    res.redirect(`http://localhost:3000/dashboard?token=${token}`);
  }

  const user = await prisma.user.findUnique({
    where: {
      email: user_info.data.email,
    },
  });

  if (!user) {
    const new_user = await prisma.user.create({
      data: {
        email: user_info.data.email,
        name: user_info.data.name,
        emailVerified: true,
      },
    });

    const new_acc = await prisma.account.create({
      data: {
        provider: 'google',
        providerAccountId: user_info.data.id,
        userId: new_user.id,
        access_token,
        refresh_token,
      },
    });
    const token = generateToken(new_user);
    res.redirect(`http://localhost:3000/dashboard?token=${token}`);
  }
});

router.get('/github', (req, res) => {
  if (!GITHUB_CLIENT_ID)
    return res.json({ message: 'Github client id not provided' });

  const url = 'https://github.com/login/oauth/authorize';
  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: 'http://localhost:5000/api/auth/github/callback',
    scope: 'read:user user:email',
  });

  res.redirect(`${url}?${params}`);
});

router.get('/github/callback', async (req, res) => {
  const code = req.query.code as string;

  const gitRes = await axios.post(
    'https://github.com/login/oauth/access_token',
    {
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: 'http://localhost:5000/api/auth/github/callback',
    },
    {
      headers: {
        Accept: 'application/json',
      },
    },
  );
  const access_token = gitRes.data.access_token;

  const git_user = await axios.get('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  const git_email = await axios.get('https://api.github.com/user/emails', {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  const primary_email = git_email.data.find((e: any) => e.primary && e.email);

  const exitingAcc = await prisma.account.findUnique({
    where: {
      provider_providerAccountId: {
        provider: 'github',
        providerAccountId: git_user.data.id,
      },
    },
    include: {
      userid: true,
    },
  });

  if (exitingAcc) {
    const user = await prisma.user.findFirst({
      where: {
        id: exitingAcc.userId,
      },
    });
    const token = generateToken(user);
    res.redirect(`http://localhost:3000/dashboard?token=${token}`);
  }

  const user = await prisma.user.findFirst({
    where: {
      email: primary_email.email,
    },
  });

  if (!user) {
    const new_user = await prisma.user.create({
      data: {
        email: primary_email.email,
        name: git_user.data.name || git_user.data.login,
        emailVerified: true,
      },
    });
    const new_acc = await prisma.account.create({
      data: {
        provider: 'google',
        providerAccountId: git_user.data.id,
        userId: new_user.id,
        access_token,
      },
    });
    const token = generateToken(new_user);
    res.redirect(`http://localhost:3000/dashboard?token=${token}`);
  }
});

export default router;
