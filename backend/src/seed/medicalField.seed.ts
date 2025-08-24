import { faker } from '@faker-js/faker'
import { MedicalFieldMongoModel } from "../models/mongo/medicalField.model"

export async function seedMedicalFields(){

const fields = [
  { name: "Cardiology", details: "Cardiology helps with issues related to your heart and blood circulation. If you're dealing with chest discomfort, irregular heartbeat, or just need a heart checkup — this is the place to start." },
  { name: "Dermatology", details: "Dermatology focuses on your skin, hair, and nails. If something on your skin looks or feels off, a dermatologist can take a closer look." },
  { name: "Neurology", details: "Neurology handles conditions that affect the brain, spine, and nerves. If you've been experiencing dizziness, memory problems, or unusual sensations, a neurologist can help." },
  { name: "Pediatrics", details: "Pediatrics cares for babies, children, and teenagers. If your child is sick, needs a checkup, or you have concerns about their growth, this is where to go." },
  { name: "Oncology", details: "Oncology focuses on diagnosing and treating cancer. If you need cancer screening, a second opinion, or support during treatment, you’ll be in expert hands here." },
  { name: "Orthopedics", details: "Orthopedics treats injuries and pain in bones, muscles, and joints. If you’re struggling to move comfortably or recovering from an injury, this is the right place." },
  { name: "Ophthalmology", details: "Ophthalmology takes care of your vision and eye health. If your eyes feel strained, your vision has changed, or it’s just time for a checkup — book here." },
  { name: "Gynecology", details: "Gynecology is all about women’s reproductive health. If you need a routine exam, are having discomfort, or have questions about your cycle, this is the right field." },
  { name: "Obstetrics", details: "Obstetrics supports you through pregnancy and childbirth. If you're expecting or planning to become pregnant, this is where you’ll receive prenatal care and guidance." },
  { name: "Psychiatry", details: "Psychiatry helps with emotional and mental well-being. If you’re feeling overwhelmed, anxious, down, or just need to talk — you can get support here." },
  { name: "Radiology", details: "Radiology uses imaging like X-rays, MRIs, and CT scans to understand what’s happening inside. Your doctor may send you here for diagnostic tests or follow-ups." },
  { name: "Gastroenterology", details: "Gastroenterology looks after your digestive system. If you’ve been dealing with stomach pain, heartburn, or irregular bowel movements, this is a good step." },
  { name: "Endocrinology", details: "Endocrinology focuses on hormones and metabolism. If you have thyroid issues, diabetes, or unexplained changes in weight or energy, this field can help." },
  { name: "Nephrology", details: "Nephrology treats kidney-related problems. If you're experiencing swelling, high blood pressure, or abnormal lab results, this is where you can find answers." },
  { name: "Urology", details: "Urology deals with urinary and reproductive health, especially in men. If you have trouble urinating, bladder pain, or prostate concerns, this is the field for you." },
  { name: "Pulmonology", details: "Pulmonology helps with breathing and lung health. If you’ve had ongoing coughing, shortness of breath, or chest tightness, a pulmonologist can check it out." },
  { name: "Rheumatology", details: "Rheumatology treats joint pain and autoimmune issues. If you wake up stiff or have swelling that doesn’t go away, this could be the help you need." },
  { name: "Hematology", details: "Hematology focuses on blood disorders. If you’ve had unusual bruising, fatigue, or abnormal blood tests, this field can help find the cause." },
  { name: "Infectious Disease", details: "This field handles infections that are hard to treat or keep coming back. If you’ve had a long illness, travel exposure, or need special antibiotics, this is where to go." },
  { name: "Allergy and Immunology", details: "This field manages allergies and immune system issues. If you're dealing with sneezing, rashes, asthma, or frequent infections, it's time to check in here." },
  { name: "Anesthesiology", details: "Anesthesiology provides sedation and pain control for medical procedures. You might meet with them before surgery or if you need help managing chronic pain." },
  { name: "Emergency Medicine", details: "Emergency medicine is for sudden or severe health issues. For injuries, severe chest pain, or anything urgent — this is immediate care." },
  { name: "General Surgery", details: "General surgery covers many routine and urgent operations. If you’ve been told you may need surgery, this is where you’ll be evaluated and treated." },
  { name: "Plastic Surgery", details: "Plastic surgery can help with both appearance and reconstruction. If you're recovering from an injury or considering a cosmetic change, start here." },
  { name: "Vascular Surgery", details: "Vascular surgery focuses on blood flow in your veins and arteries. If you’ve had leg swelling, numbness, or poor circulation, this is the right stop." },
  { name: "Thoracic Surgery", details: "This specialty handles surgeries in the chest area. If you have a lung issue or a growth in the chest, this is where treatment begins." },
  { name: "Internal Medicine", details: "Internal medicine provides care for adult health and chronic conditions. Whether it's blood pressure, diabetes, or a strange symptom — they’re here to help." },
  { name: "Family Medicine", details: "Family medicine is your go-to for overall care at any age. Whether it’s a flu, a routine check, or managing a condition — this is your first step." },
  { name: "Geriatrics", details: "Geriatrics focuses on the health of older adults. If you're dealing with memory changes, mobility issues, or multiple medications, this is a good place to start." },
  { name: "Pathology", details: "Pathology works behind the scenes to analyze lab results and biopsies. You likely won’t book here directly, but your diagnosis often depends on it." },
  { name: "Occupational Medicine", details: "This field supports health and safety in the workplace. If you’ve been injured on the job or need a work-related exam, this is where to go." },
  { name: "Physical Medicine and Rehabilitation", details: "This field helps you recover movement and function. If you're healing from surgery, injury, or stroke, rehab starts here." },
  { name: "Nuclear Medicine", details: "Nuclear medicine uses small doses of radiation for imaging and treatment. You might come here for scans to check organs or spot disease early." },
  { name: "Sports Medicine", details: "Sports medicine treats exercise-related injuries and improves performance. If you're sore after training or recovering from a sports injury, this is the place." },
  { name: "Pain Management", details: "Pain management helps reduce ongoing or severe pain. If you're struggling with discomfort that won’t go away, they’ll work with you on relief." },
  { name: "Sleep Medicine", details: "Sleep medicine helps with insomnia, snoring, and sleep apnea. If you’re not sleeping well or feeling exhausted during the day, this is worth exploring." },
  { name: "Podiatry", details: "Podiatry focuses on the feet and ankles. If you have foot pain, bunions, or diabetic foot concerns, a podiatrist can help." },
  { name: "Genetics", details: "Genetics looks into inherited conditions and risks. If you have a family history of disease or want genetic screening, this is the field to turn to." },
  { name: "Medical Toxicology", details: "Toxicology deals with poisonings, overdoses, and harmful exposures. If you’ve had a bad reaction or need help with medication safety, this is where to go." },
  { name: "Critical Care Medicine", details: "Critical care is for the most serious, life-threatening conditions. It usually happens in the ICU and is coordinated by a hospital team." },
  { name: "Hospice and Palliative Care", details: "This field supports patients with serious or terminal illness. If you're seeking relief, comfort, or support near the end of life, this is a compassionate place to start." },
  { name: "Otolaryngology (ENT)", details: "ENT helps with problems in your ears, nose, and throat. If you’ve had ongoing sinus issues, throat pain, or hearing trouble, this is where to get checked." },
  { name: "Oral and Maxillofacial Surgery", details: "This specialty focuses on surgical care of the mouth, jaw, and face. If you need wisdom teeth removed or have facial trauma, start here." },
  { name: "Clinical Pharmacology", details: "This field studies how drugs work and affect the body. If you’ve had unusual medication reactions or need precise treatment, they can help." },
  { name: "Transplant Surgery", details: "Transplant surgery is for patients receiving donated organs. If you're preparing for or recovering from a transplant, this is your specialty team." },
  { name: "Bariatric Surgery", details: "Bariatric surgery supports weight loss for health reasons. If you’re considering surgery as part of your weight-loss journey, start with a consultation here." },
  { name: "Colorectal Surgery", details: "Colorectal surgery treats the colon, rectum, and related issues. If you’ve noticed bleeding, discomfort, or need a procedure, this is where you’ll get care." },
  { name: "Neonatology", details: "Neonatology cares for newborns who need extra attention. If your baby is premature or unwell after birth, this is the specialized care they’ll receive." },
  { name: "Reproductive Endocrinology", details: "This field helps with fertility and reproductive hormone issues. If you’re having trouble getting pregnant or dealing with cycle irregularities, this is a good first step." },
  { name: "Speech and Language Therapy", details: "Speech therapy helps with speaking, understanding, or swallowing. If you or your child is having trouble communicating clearly, this field can help." }
]



  const requiredInfos: string[] = [
    'Please bring a valid photo ID and your insurance card.',
    'Arrive 15 minutes early to complete registration.',
    'Bring a list of your current medications.',
    'Avoid eating or drinking 8 hours before your appointment.',
    'Bring any recent lab results or medical records.',
    'Prepare a list of symptoms and questions for the doctor.',
    'Wear comfortable clothing for physical examination.',
    'Bring referral documents if required by your insurance.',
    'Notify the clinic if you have a fever or symptoms of illness.',
    'Arrange for someone to accompany you if sedation is planned.',
  ]

  // assign random requiredInfo (50% chance of null)
  const enrichedFields = fields.map(field => ({
    ...field,
    requiredInfo: Math.random() < 0.5 ? null : faker.helpers.arrayElement(requiredInfos)
  }))

  const medicalFields = await MedicalFieldMongoModel.insertMany(enrichedFields)
  return medicalFields
}