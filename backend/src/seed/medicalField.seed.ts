import { MedicalFieldMongoModel } from "../models/mongo/medicalField.model"

export async function seedMedicalFields(){

const fieldNames = [
  'Cardiology',
  'Dermatology',
  'Neurology',
  'Pediatrics',
  'Oncology',
  'Orthopedics',
  'Ophthalmology',
  'Gynecology',
  'Obstetrics',
  'Psychiatry',
  'Radiology',
  'Gastroenterology',
  'Endocrinology',
  'Nephrology',
  'Urology',
  'Pulmonology',
  'Rheumatology',
  'Hematology',
  'Infectious Disease',
  'Allergy and Immunology',
  'Anesthesiology',
  'Emergency Medicine',
  'General Surgery',
  'Plastic Surgery',
  'Vascular Surgery',
  'Thoracic Surgery',
  'Internal Medicine',
  'Family Medicine',
  'Geriatrics',
  'Pathology',
  'Occupational Medicine',
  'Physical Medicine and Rehabilitation',
  'Nuclear Medicine',
  'Sports Medicine',
  'Pain Management',
  'Sleep Medicine',
  'Podiatry',
  'Genetics',
  'Medical Toxicology',
  'Critical Care Medicine',
  'Hospice and Palliative Care',
  'Otolaryngology (ENT)',
  'Oral and Maxillofacial Surgery',
  'Clinical Pharmacology',
  'Transplant Surgery',
  'Bariatric Surgery',
  'Colorectal Surgery',
  'Neonatology',
  'Reproductive Endocrinology',
  'Speech and Language Therapy',
]  

  const medicalFields = await MedicalFieldMongoModel.insertMany(
    fieldNames.map(name => ({ name }))
  )

  return medicalFields
}