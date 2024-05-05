import { useState } from "react"
import { useNavigate } from "react-router-dom"
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
        <main>
            <form method="post" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="FirstName">Primeiro Nome</label>
                    <input type="text" name="" id="FirstName" required value={myName} on onChange={(e) => setMyName(e.target.value)}/>
                    <label htmlFor="SecondName">Sobrenome</label>
                    <input type="text" name="" id="SecondName" required value={mySecondName} onChange={(e) => setMySecondName(e.target.value)}/>
                </div>
                <div>
                    <label htmlFor="inputEmail">Email</label>
                    <input type="email" name="" id="inputEmail" required value={myEmail} onChange={(e) => setMyEmail(e.target.value)}/>
                </div>
                <div>
                    <label htmlFor="Password">Senha</label>
                    <input type="password" name="" id="Password" required value={myPassword} onChange={(e) => setMyPassord(e.target.value)}/>
                    <label htmlFor="PasswordConfirm">Confirme sua Senha</label>
                    <input type="password" name="" id="PasswordConfirm" value={myPassordConfirmation} onChange={(e) => setMyPasswordConfirmation(e.target.value)}/>
                </div>
                <div>
                    <label htmlFor="Gender">Genêro</label>
                    <select name="" id="Gender" value={myGender} onChange={(e) => setMyGender(e.target.value)}>
                        <option value="" disabled selected>Selecione uma opção</option>
                        <option value="F">Feminino</option>
                        <option value="M">Masculino</option>
                    </select>
                </div>

                <div>
                    <button type="submit">Cadastrar</button>
                </div>
            </form>
            <section>
            <BntLink textBnt={"Já possui conta?"} to={"/login"} classNameBnt={"BntLinkTo"} classNameLink={"LinkTo"}/>
            </section>
        </main>
    )
}