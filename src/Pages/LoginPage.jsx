import { useEffect, useState } from "react";
import BntLink from "../Components/BntLink";
import { useNavigate } from "react-router-dom";
import "../Styles/LoginPage.css"


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


        if(find && find.Online === false){
            const update = {...find, Online: true}
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
        <main className="WrapperMain">
            <form onSubmit={handleLogin} className="LoginForm">
                <div className="WrapperLoginInputs">
                    <h1>Faça seu login agora!</h1>
                    <div className="ContentInput">
                        <label htmlFor="EmailLogin" className="LabelInput">Email</label>
                        <input type="email" name="" id="EmailLogin" value={email} onChange={(e) => setEmail(e.target.value)}/>
                    </div>
                    <div className="ContentInput">
                        <label htmlFor="PasswordLogin" className="LabelInput">Senha</label>
                        <input type="password" id="PasswordLogin" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                    <div>
                        <button>Entrar</button>
                        <BntLink to={"/"} textBnt={"Não possui conta?"} />
                    </div>
                </div>
                
            </form>
            <div className="BackGroundDiv"></div>
        </main>
    )
}