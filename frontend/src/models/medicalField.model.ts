
export interface MedicalFieldModel {
    _id: string
    name: string
    details: string
    requiredInfo: string | null
}

export interface SwipMedicalFieldModal {
    title: string
    description: string
    imageUrl: string
}