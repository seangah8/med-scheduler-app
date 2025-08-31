import { toast } from 'react-toastify'
import { httpService } from "./http.service"
import { MedicalFieldModel, SwipMedicalFieldModal } from "@/models/medicalField.model"

export const medicalFieldService = {
    getMedicalFields,
    getMedicalFieldSwipList,
}


async function getMedicalFields() : Promise<MedicalFieldModel[] | null> {
    try{
        const medicalFields = await httpService.get
            <MedicalFieldModel[]>('medical-field/')
        return medicalFields
        
    } catch(err){
        import.meta.env.MODE === "development"
        ? console.error('Could not get medical fields:', err)
        : toast.error("Something went wrong, please try again.")
        return null
    }
}

function getMedicalFieldSwipList() : SwipMedicalFieldModal[]{
    const swipList : SwipMedicalFieldModal[] = [
        {
            title: "Cardiology",
            description: "Experiencing chest pain, palpitations, or high blood pressure? Book a heart check-up today.",
            imageUrl: 'https://static.wixstatic.com/media/523368_66f98e0bb4224a3b987f103c2d47a1f1~mv2.jpeg/v1/fill/w_568,h_284,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/523368_66f98e0bb4224a3b987f103c2d47a1f1~mv2.jpeg'
        },
        {
            title: "Dermatology",
            description: "Got a rash, acne, or unusual skin issue? Our skin specialists can help.",
            imageUrl: 'https://www.myglowtheory.com/wp-content/uploads/2022/10/what-is-dermatology.jpg'
        },
        {
            title: "Neurology",
            description: "Frequent headaches, dizziness, or nerve pain? Get a neurological assessment.",
            imageUrl: 'https://jpmcbrunei.com/wp-content/uploads/2024/11/Neurology-Header.webp'
        },
        {
            title: "Pediatrics",
            description: "Your child feeling unwell or due for a check-up? Book with a pediatrician now.",
            imageUrl: "https://blog.boardvitals.com/wp-content/uploads/2022/09/pediatrician-vs-pdp.png"
        },
        {
            title: "Oncology",
            description: "Need a cancer screening or ongoing treatment? Consult our oncology experts.",
            imageUrl: "https://media.licdn.com/dms/image/sync/v2/D4D27AQG_raTR4uJ_Kw/articleshare-shrink_800/B4DZddsxYeG8AI-/0/1749623707443?e=2147483647&v=beta&t=zTaNKF6dVarkp8CVCXV1jkR_PYqZ2nPBnh9h_jcI5Qk"
        },
        {
            title: "Orthopedics",
            description: "Dealing with joint pain, back issues, or injuries? Book with an orthopedic specialist.",
            imageUrl: "https://ortho.ucsd.edu/_images/education-training/sq-educating-leaders.jpg"
        },
        {
            title: "Ophthalmology",
            description: "Blurred vision, eye discomfort, or need a routine exam? Get your eyes checked today.",
            imageUrl: "https://www.evergreeneye.com/wp-content/uploads/shutterstock_326052383.jpg"
        },
        {
            title: "Obstetrics",
            description: "Pregnant or planning a pregnancy? Schedule an appointment with our OB team.",
            imageUrl: "https://sa1s3optim.patientpop.com/assets/images/provider/photos/2316924.jpg"
        },
        {
            title: "Psychiatry",
            description: "Feeling anxious, stressed, or low? Speak with a mental health professional.",
            imageUrl: "https://c8y.doxcdn.com/image/upload/c_fill,fl_progressive,h_800,q_auto,w_1600/ejnx2rkhaqaywb5klpit.webp"
        },
        {
            title: "Gastroenterology",
            description: "Having stomach pain, digestion issues, or heartburn? Book a GI consultation now.",
            imageUrl: "https://uofmhealthwest.org/wp-content/uploads/2020/03/Gastroenterology-1-1024x427.jpg"
        },

    ]
    
    return swipList

}