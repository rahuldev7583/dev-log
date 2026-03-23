import express, { Router, type Request, type Response } from "express";
import { prisma } from "../lib/prisma";
import { generateToken } from "../utils/token";
import { compare, genSalt, hash } from "bcrypt";
import { validateData } from "../middleware/Validation";
import { loginSchema, signupSchema } from "../schema/auth";

const router: Router = express.Router();

router.get("/", (req, res) => {
    res.json({ message: "Auth Routes" })
})

router.post("/signup", validateData(signupSchema), async (req: Request, res: Response) => {

    const req_body = req.body;

    const user = await prisma.user.findFirst({
        where: {
            email: req_body.email
        }
    });

    if (user) {
        return res.status(409).json({ message: "User already exist" });
    }

    const salt = await genSalt(10);
    const password_hash = await hash(req_body.password, salt);

    const new_user = await prisma.user.create({
        data: {
            email: req_body.email,
            name: req_body.name,
            password: password_hash
        }
    })

    const token = generateToken(new_user);

    return res.status(201).json({ message: "User created Successfully", token });
})

router.post("/login", validateData(loginSchema), async (req: Request, res: Response) => {

    const req_body = req.body;

    const user = await prisma.user.findFirst({
        where: {
            email: req_body.email
        }
    });

    if (!user) {
        return res.status(404).json({ message: "User does not exist" })
    }

    if (!user.password) return "password not available"

    const password_verify = await compare(req_body.password, user.password);

    if (!password_verify) {
        return res.status(403).json({ message: "Incorrect password" })
    }

    const token = generateToken(user);

    return res.status(200).json({ message: "LoggedIn Successfully", token });
})

export default router;