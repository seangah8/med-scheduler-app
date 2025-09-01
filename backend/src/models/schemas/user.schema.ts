import mongoose from "mongoose"


export const getUserSchema = {
  validate: (_body: any, params: any) => {
    const errors: string[] = []
    const phoneRegex = /^05\d{8}$/

    if (!params.phone || typeof params.phone !== "string") {
      errors.push("phone is required and must be a string")
    } else if (!phoneRegex.test(params.phone)) {
      errors.push("phone must match format 05xxxxxxxx")
    }

    return errors.length ? { error: { details: errors } } : { error: null }
  }
}


export const addUserSchema = {
  validate: (body: any, _params: any) => {
    const errors: string[] = []
    const phoneRegex = /^05\d{8}$/

    if (!body.phone || typeof body.phone !== "string") {
      errors.push("phone is required and must be a string")
    } else if (!phoneRegex.test(body.phone)) {
      errors.push("phone must match format 05xxxxxxxx")
    }

    return errors.length ? { error: { details: errors } } : { error: null }
  }
}



export const makeUserRegularSchema = {
  validate: (body: any, _params: any) => {
    const errors: string[] = []

    if (!body.userId || typeof body.userId !== "string") {
      errors.push("userId is required and must be a string")
    } else if (!mongoose.Types.ObjectId.isValid(body.userId)) {
      errors.push("userId must be a valid ObjectId")
    }

    return errors.length ? { error: { details: errors } } : { error: null }
  }
}


