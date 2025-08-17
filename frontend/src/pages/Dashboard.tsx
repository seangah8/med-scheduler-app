import { authActions } from "../store/actions/auth.actions"

export function Dashboard(){

    return(
        <section className="dashboard">
            <h1>Dashboard Page</h1>
            <button onClick={authActions.logout}>logout</button>
        </section>
    )
}