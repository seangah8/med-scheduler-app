import { useNavigate } from "react-router-dom"
import { FieldSlideShow } from "./FieldSlideShow"

export function DashboardWelcome() {
  const navigate = useNavigate()  

  return (
    <section className="dashboard-welcome">
      <h1>Welcome to Shiba <span>Connect</span></h1>

      <button onClick={() => navigate("/booking-appointment")}>
        Create Appointment +
      </button>

      <FieldSlideShow/>

    </section>
  )
}
