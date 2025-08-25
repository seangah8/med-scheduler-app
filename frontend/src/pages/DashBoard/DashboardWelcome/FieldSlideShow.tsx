import { useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import { MedicalFieldModel } from '@/models/medicalField.model'
import { medicalFieldService } from '../../../services/medicalField.service'
import 'swiper/css';

export function FieldSlideShow(){

    const [medicalFields, setMedicalFields] = useState<MedicalFieldModel[]>([])

    async function loadMedicalFields() {
        const fields = await medicalFieldService.getMedicalFields()
        if(fields) setMedicalFields(fields)
    }

    useEffect(()=>{
        loadMedicalFields()
    },[])

    return(
        <section className="field-slide-show">
            <Swiper
                modules={[Autoplay]}
                slidesPerView={3}
                spaceBetween={20}
                autoplay={{ delay: 5000 }}
                loop={true}
                breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                }}
            >

                {medicalFields.map(field => (
                    <SwiperSlide key={field._id}>
                        <div className="field-card">
                        <h3>{field.name}</h3>
                        <p>{field.details}</p>
                        </div>
                    </SwiperSlide>
                ))}

            </Swiper>
        </section>
    )
}