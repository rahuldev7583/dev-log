import type { NextFunction, Request, Response } from "express";
import * as z from "zod";

export const validateData = (schema: z.ZodObject<any, any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {

            const error_msgs = result.error.issues.map(issue => ({
                message: `${issue.path.join(".")} is ${issue.message}`
            }));

            return res.status(400).json({
                error: "Invalid data",
                details: error_msgs
            });

        }

        next();
    }

}