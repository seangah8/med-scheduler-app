import { Request, Response, NextFunction } from "express"


export function validateRequest(schema: any) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, req.params, req.query)
    if (error) {
      return res.status(400).json({
        error: "Validation failed",
        details: error.details
      })
    }
    next()
  }
}
