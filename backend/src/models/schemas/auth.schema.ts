
export const sendOTPSchema = {
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



export const verifyOTPSchema = {
  validate: (body: any, _params: any) => {
    const errors: string[] = []
    const phoneRegex = /^05\d{8}$/

    if (!body.phone || typeof body.phone !== "string") {
      errors.push("phone is required and must be a string")
    } else if (!phoneRegex.test(body.phone)) {
      errors.push("phone must match format 05xxxxxxxx")
    }

    if (!body.password || typeof body.password !== "string") {
      errors.push("password (OTP code) is required and must be a string")
    }

    return errors.length ? { error: { details: errors } } : { error: null }
  }
}

