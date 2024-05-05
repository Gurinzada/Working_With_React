import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../Styles/Register.css"
import BntLink from "../Components/BntLink"

async function getMyData(){
    const userInfo = await fetch('http://localhost:3000/User')
    const dataUser = await userInfo.json()

    return dataUser
}

export default function RegisterPage(){

    const [myName, setMyName] = useState('')
    const [mySecondName, setMySecondName] = useState('')
    const [myEmail, setMyEmail] = useState('')
    const [myPassword, setMyPassord] = useState('')
    const [myPassordConfirmation, setMyPasswordConfirmation] = useState('')
    const [myGender, setMyGender] = useState('')
    const navigate = useNavigate()

    const handleChangePassword = () => {
        const inputPassword = document.getElementById('Password')
        const eye = document.getElementById("Eye")
        if(inputPassword.type === "password"){
            inputPassword.type = "text"
            eye.classList.add(`Close`)
        } else{
            inputPassword.type = "password"
            eye.classList.remove(`Close`)
        }
    }

    function regexPassowrd(password, passwordConfirm){
        const regex = /^(?=.*[\W_]).{8,}$/gm
        const valueOne = regex.test(password)

        if(password === passwordConfirm && valueOne){
            return true
        } else{
            return false
        }
    }

    async function alreadyCreated(email){
      const data = await getMyData()
      const exist = data.find((user) => user.Email === email)

      if(exist){
        return false
      } else{
        return true
      }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const actualDate = new Date()
        const myConfirm = regexPassowrd(myPassword, myPassordConfirmation)
        const confirmEmail = await alreadyCreated(myEmail)

       if(myConfirm && confirmEmail){
        const userInfo = {
            FirstName: myName,
            SecondName: mySecondName,
            Email: myEmail,
            Password: myPassword,
            Gender: myGender,
            Creation: actualDate,
            List:[],
            Online: true
        }

        try {
           const newUser = await fetch('http://localhost:3000/User', {
                method: "POST",
                body: JSON.stringify(userInfo),
                headers: {
                    "Content-Type": "aplication/json"
                }
            })
            // const data = await getMyData()
            // navigate(`/user/${data.id}`)

            const getNew = await newUser.json()
            navigate(`/user/${getNew.id}`)
            
           }
            catch {
            throw new Error(`An error has ocurred`)
        }

    }
}

    return(
        <main className="WrapperRegister">
            <form method="post" onSubmit={handleSubmit} className="FormList">
                <h1 className="TitleForms">Registrar</h1>
                <div className="Wrapper">
                    <div className="ContentInput">
                        <label htmlFor="FirstName" className="LabelInput">Primeiro Nome</label>
                        <input type="text" name="" id="FirstName" required value={myName} on onChange={(e) => setMyName(e.target.value)}/>
                    </div>
                    <div className="ContentInput">
                        <label htmlFor="SecondName" className="LabelInput">Sobrenome</label>
                        <input type="text" name="" id="SecondName" required value={mySecondName} onChange={(e) => setMySecondName(e.target.value)}/>
                    </div>                
                </div>
                <div className="Wrapper">
                    <div className="ContentInput">
                        <label htmlFor="inputEmail" className="LabelInput">Email</label>
                        <input type="email" name="" id="inputEmail" required value={myEmail} onChange={(e) => setMyEmail(e.target.value)} placeholder="exemplo@email.com"/>
                    </div>
                </div>
                <div className="Wrapper">
                    <div className="ContentInput">
                        <label htmlFor="Password" className="LabelInput">Senha</label>
                        <input type="password" name="" id="Password" required value={myPassword} onChange={(e) => setMyPassord(e.target.value)} className="PasswordInput"/>
                        <div className="Change" onClick={handleChangePassword} id="Eye"></div>
                    </div>
                    <div className="ContentInput">
                        <label htmlFor="PasswordConfirm" className="LabelInput">Confirme sua Senha</label>
                        <input type="password" name="" id="PasswordConfirm" value={myPassordConfirmation} onChange={(e) => setMyPasswordConfirmation(e.target.value)}/>
                    </div>
                </div>
                <div className="Wrapper">
                    <div className="ContentInput">
                        <label htmlFor="Gender" className="LabelInput">Genêro</label>
                        <select name="" id="Gender" value={myGender} onChange={(e) => setMyGender(e.target.value)}>
                            <option value="" disabled selected>Selecione uma opção</option>
                            <option value="F">Feminino</option>
                            <option value="M">Masculino</option>
                        </select>
                    </div>
                </div>

                <div>
                    <button type="submit" className="SignUpFor">Cadastrar</button>
                </div>
                <div>
                    <BntLink textBnt={"Já possui conta?"} to={"/login"} classNameBnt={"BntLinkTo"} classNameLink={"LinkTo"}/>
                </div>
            </form>
            <section className="HeroBackground">
                
                    <div className="WrapperTitle"><h1 className="TitleBack">Bem vindo a TaskSync</h1></div>
                    <div className="WrapperP">
                        <p className="Message">Guarde suas tarefas no melhor lugar possível!</p>
                        <p className="Message">E nunca mais esqueça nada!</p>
                    </div>
            </section>
            
        </main>
    )
}