import express, { Router, type Request, type Response } from 'express';
import { prisma } from '../lib/prisma';
import {
  generateExtensionToken,
  generateToken,
  verifyExtensionToken,
} from '../utils/token';
import { compare, genSalt, hash } from 'bcrypt';
import { validateData } from '../middleware/Validation';
import { loginSchema, signupSchema } from '../schema/auth';
import axios from 'axios';
import { validateUser } from '../middleware/auth';

const router: Router = express.Router();
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

const SERVER_URL = process.env.SERVER_URL;
const APP_URL = process.env.APP_URL;

router.get('/', (req, res) => {
  res.json({ message: 'Auth Routes' });
});

router.post(
  '/signup',
  validateData(signupSchema),
  async (req: Request, res: Response) => {
    try {
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
    } catch (error) {
      console.log({ error });

      return res.status(400).json({ message: 'Signup failed' });
    }
  },
);

router.post(
  '/login',
  validateData(loginSchema),
  async (req: Request, res: Response) => {
    try {
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
    } catch (error) {
      console.log({ error });
      return res.status(400).json({ message: 'Login failed' });
    }
  },
);

router.get('/google', (req, res) => {
  if (!GOOGLE_CLIENT_ID) return res.json('GOOGLE_CLIENT_ID not provided');

  try {
    const url = 'https://accounts.google.com/o/oauth2/v2/auth';

    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: `${SERVER_URL}/api/auth/google/callback`,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'consent',
    });

    res.redirect(`${url}?${params.toString()}`);
  } catch (error) {
    console.log({ error });

    return res.status(400).json({ message: 'Google Authentication failed' });
  }
});

router.get('/google/callback', async (req, res) => {
  const code = req.query.code;

  try {
    const resAuth = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      code,
      redirect_uri: `${SERVER_URL}/api/auth/google/callback`,
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
      res.redirect(`${APP_URL}/dashboard?token=${token}`);
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
      res.redirect(`${APP_URL}/dashboard?token=${token}`);
    }
  } catch (error) {
    console.log({ error });
    return res.status(400).json({ message: 'Google Auth callback failed' });
  }
});

router.get('/github', (req, res) => {
  if (!GITHUB_CLIENT_ID)
    return res.json({ message: 'Github client id not provided' });

  try {
    const url = 'https://github.com/login/oauth/authorize';
    const params = new URLSearchParams({
      client_id: GITHUB_CLIENT_ID,
      redirect_uri: `${SERVER_URL}/api/auth/github/callback`,
      scope: 'read:user user:email',
    });

    res.redirect(`${url}?${params}`);
  } catch (error) {
    console.log({ error });
    return res.status(400).json({ message: 'Github Authentication failed' });
  }
});

router.get('/github/callback', async (req, res) => {
  const code = req.query.code as string;

  try {
    const gitRes = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: `${SERVER_URL}/api/auth/github/callback`,
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
          providerAccountId: git_user.data.id.toString(),
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
      res.redirect(`${APP_URL}/dashboard?token=${token}`);
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
          provider: 'github',
          providerAccountId: git_user.data.id.toString(),
          userId: new_user.id,
          access_token,
        },
      });

      const token = generateToken(new_user);

      res.redirect(`${APP_URL}/dashboard?token=${token}`);
    }
  } catch (error) {
    console.log({ error });
    return res.status(400).json({ message: 'Github Auth callback failed' });
  }
});

router.get('/extension/authorize', validateUser, (req: any, res) => {
  try {
    const ext_token = generateExtensionToken({
      user: req.user,
      type: 'extension',
    });

    return res.json({
      message: 'Extension authorize token generated Successfully',
      extToken: ext_token,
    });
  } catch (error) {
    console.log({ error });
    return res.status(400).json({ message: 'Extension Authentication failed' });
  }
});

router.post('/extension/verify', (req: any, res) => {
  const req_body = req.body;
  const ext_token = req_body.extToken;

  const data: any = verifyExtensionToken(ext_token);
  if (!data) {
    return res.status(400).json({
      message: 'Extension authorize token invalid',
    });
  }
  return res.json({
    message: 'Extension authorize token verified Successfully',
    email: data.user.email,
  });
});

router.get('/me', validateUser, (req: any, res) => {
  try {
    const user = req.user;

    return res
      .status(200)
      .json({ message: 'User fetched Successfully', user: user.email });
  } catch (error) {
    return res.status(400).json({ message: 'Invalid User' });
  }
});

export default router;
