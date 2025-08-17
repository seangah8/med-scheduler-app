import { authService } from "../services/auth.service";

export function Dashboard(){

    return(
        <section className="dashboard">
            <h1>Dashboard Page</h1>
            <button onClick={authService.logout}>logout</button>
        </section>
    )
}