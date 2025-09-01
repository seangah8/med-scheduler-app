
export const getSoonestAvailableDoctorSchema = {
  validate: (body: any, _params: any) => {
    const errors: string[] = []

    if (!body.doctorsId || !Array.isArray(body.doctorsId)) {
      errors.push("doctorsId is required and must be an array of strings")
    } else if (!body.doctorsId.every((id: any) => typeof id === "string")) {
      errors.push("doctorsId must contain only strings")
    }

    if (!body.fieldId || typeof body.fieldId !== "string") {
      errors.push("fieldId is required and must be a string")
    }

    return errors.length ? { error: { details: errors } } : { error: null }
  }
}

