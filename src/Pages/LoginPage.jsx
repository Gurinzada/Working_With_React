import { useEffect, useState } from "react";
import BntLink from "../Components/BntLink";
import { useNavigate } from "react-router-dom";


async function getInfos(){
    const user = await fetch(`http://localhost:3000/User`)
    const data = await user.json()
    return data
}

export default function LoginPage(){
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [infos, setMyInfos] = useState()
    const navigate = useNavigate()

    useEffect(() => {
        getInfos().then((res) => setMyInfos(res))
        console.log(infos)
    })

    const handleLogin = async (e) => {
        e.preventDefault()
        const find = infos.find((user) => user.Email === email && user.Password === password)

        const update = {...find, Online: true}

        if(find && find.Online === false){
            await fetch(`http://localhost:3000/User/${find.id}`,{
                method:"PUT",
                body: JSON.stringify(update),
                headers: {
                    "Content-Type": "application/json"
                }
            })

            navigate(`/user/${find.id}`)
        }
    }

    return (
        <main>
            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor="EmailLogin">Email</label>
                    <input type="email" name="" id="EmailLogin" value={email} onChange={(e) => setEmail(e.target.value)}/>
                    <label htmlFor="PasswordLogin">Senha</label>
                    <input type="password" id="PasswordLogin" value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <div>
                    <button>Entrar</button>
                    <BntLink to={"/"} textBnt={"Não possui conta?"} />
                </div>
            </form>
        </main>
    )
}