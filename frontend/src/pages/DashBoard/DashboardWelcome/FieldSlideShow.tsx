import { useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import { SwipMedicalFieldModal } from '@/models/medicalField.model'
import { medicalFieldService } from '../../../services/medicalField.service'
import 'swiper/css';

export function FieldSlideShow(){

    const [medicalFields, setMedicalFields] = useState<SwipMedicalFieldModal[]>([])
    
    useEffect(()=>{
        const fields = medicalFieldService.getMedicalFieldSwipList()
        if(fields) setMedicalFields(fields)
    },[])

    return(
        <section className="field-slide-show">
            <Swiper
                key={medicalFields.length}
                modules={[Autoplay]}
                slidesPerView={3}
                autoplay={{ delay: 5000 }}
                loop={true}
                breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                }}
            >

                {medicalFields.map((field, index) => (
                    <SwiperSlide key={field.title}>
                        <div className="field-card">
                            <div className='card-back' 
                                style={{backgroundColor: index%2 ? '#00006A' : '#FF007A'}}
                            />
                            <img src={field.imageUrl}/>
                            <h3>{field.title}</h3>
                            <p>{field.description}</p>
                        </div>
                    </SwiperSlide>
                ))}

            </Swiper>
        </section>
    )
}