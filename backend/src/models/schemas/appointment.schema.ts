

export const getAppointmentSchema = {
  validate: (_body: any, params: any) => {
    const errors: string[] = []

    if (!params.id || typeof params.id !== "string") {
      errors.push("id is required and must be a string")
    }

    return errors.length ? { error: { details: errors } } : { error: null }
  }
}



export const getAppointmentsSchema = {
  validate: (_body: any, _params: any, query: any = {}) => {
    const errors: string[] = []

    if (!query.status || typeof query.status !== "string") {
      errors.push("status is required and must be a string")
    }

    if (query.medicalFieldId && typeof query.medicalFieldId !== "string") {
      errors.push("medicalFieldId must be a string if provided")
    }

    if (query.startDate && isNaN(Date.parse(query.startDate))) {
      errors.push("startDate must be a valid date string if provided")
    }

    if (query.endDate && isNaN(Date.parse(query.endDate))) {
      errors.push("endDate must be a valid date string if provided")
    }

    return errors.length ? { error: { details: errors } } : { error: null }
  }
}


export const addAppointmentSchema = {
  validate: (body: any, _params: any) => {
    const errors: string[] = []

    if (!body.medicalFieldId || typeof body.medicalFieldId !== "string") {
      errors.push("medicalFieldId is required and must be a string")
    }

    if (!body.doctorId || typeof body.doctorId !== "string") {
      errors.push("doctorId is required and must be a string")
    }

    if (!body.date || isNaN(Date.parse(body.date))) {
      errors.push("date is required and must be a valid date string")
    }

    if (typeof body.virtual !== "boolean") {
      errors.push("virtual is required and must be a boolean")
    }

    return errors.length ? { error: { details: errors } } : { error: null }
  }
}

export const cancelAppointmentSchema = {
  validate: (_body: any, params: any) => {
    const errors: string[] = []

    if (!params.id || typeof params.id !== "string") {
      errors.push("id is required and must be a string")
    }

    return errors.length ? { error: { details: errors } } : { error: null }
  }
}



export const rescheduleAppointmentSchema = {
  validate: (_body: any, params: any) => {
    const errors: string[] = []

    if (!params.id || typeof params.id !== "string") {
      errors.push("id is required and must be a string")
    }

    if (!params.date || isNaN(Date.parse(params.date))) {
      errors.push("date is required and must be a valid date string")
    }

    return errors.length ? { error: { details: errors } } : { error: null }
  }
}



export const changeAppointmentMethodSchema = {
  validate: (_body: any, params: any) => {
    const errors: string[] = []

    if (!params.id || typeof params.id !== "string") {
      errors.push("id is required and must be a string")
    }

    if (
      typeof params.isVirtual !== "string" ||
      !["true", "false"].includes(params.isVirtual)
    ) {
      errors.push("isVirtual is required and must be 'true' or 'false'")
    }

    return errors.length ? { error: { details: errors } } : { error: null }
  }
}


export const getAllUnavailabilitySchema = {
  validate: (_body: any, params: any) => {
    const errors: string[] = []

    if (!params.fieldId || typeof params.fieldId !== "string") {
      errors.push("fieldId is required and must be a string")
    }

    if (!params.doctorId || typeof params.doctorId !== "string") {
      errors.push("doctorId is required and must be a string")
    }

    return errors.length ? { error: { details: errors } } : { error: null }
  }
}

export const getAppointmentPdfSchema = {
  validate: (_body: any, params: any) => {
    const errors: string[] = []

    if (!params.id || typeof params.id !== "string") {
      errors.push("id is required and must be a string")
    }

    return errors.length ? { error: { details: errors } } : { error: null }
  }
}





