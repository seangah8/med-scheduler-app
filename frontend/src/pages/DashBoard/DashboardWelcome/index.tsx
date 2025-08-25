import { useNavigate } from "react-router-dom"
import { FieldSlideShow } from "./FieldSlideShow"

export function DashboardWelcome() {
  const navigate = useNavigate()  

  return (
    <section className="dashboard-welcome">
      <h1>Welcome To Shiba Connect!</h1>

      <button onClick={() => navigate("/booking-appointment")}>
        Book your first appointment here!
      </button>

      <h2>Explore Our Medical Specialties</h2>

      <FieldSlideShow/>

      {/* <button onClick={() => navigate("/booking-appointment")}>
        View All Specialties →
      </button> */}
    </section>
  )
}
