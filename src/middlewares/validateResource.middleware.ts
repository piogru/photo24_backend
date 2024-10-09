import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";

const validateResource =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
        user: req.user,
      });
      next();
    } catch (e: any) {
      return res.status(422).send(e.errors);
    }
  };

export default validateResource;
