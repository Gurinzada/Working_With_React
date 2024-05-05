import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"

export default function UserPage(){
    const [infos, setInfos] = useState([])
    const [task, setTask] = useState("")
    const [update, setUpdate] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [newTitle, setNewTitle] = useState("")

    
    const navigate = useNavigate()
    const {UserID} = useParams()

    const edit = (index) => {
        setEditMode(true)
        setNewTitle(infos[0].List[index])
    }

    const confirmEdit = async (e, index) => {
        e.preventDefault()
        const updatedInfos = {...infos[0]}

        updatedInfos.List[index] = newTitle
        setInfos([updatedInfos])

        await fetch(`http://localhost:3000/User/${UserID}`,{
            method:"PUT",
            body: JSON.stringify(updatedInfos),
            headers:{
                "Content-Type": "application/json"
            }
        })
        setUpdate(true)
        setEditMode(false)
    }

    const handleGetOut = async() => {
        const updatesInfos = {...infos[0]}

        updatesInfos.Online = false

        setInfos([updatesInfos])

        await fetch(`http://localhost:3000/User/${UserID}`,{
            method: "PUT",
            body: JSON.stringify(updatesInfos),
            headers: {
                "Content-Type": "application/json"
            }
        })

        setUpdate(true)
        navigate("/login")
    }

    const handleDeleteTask = async (index) => {
        // Copiar as informações atuais do usuário
        const updatedInfos = { ...infos[0] }
        
        // Remover a tarefa com base no índice
        updatedInfos.List.splice(index, 1);
    
        // Atualizar as informações do usuário com a nova lista de tarefas
        setInfos([updatedInfos]);
    
        // Enviar as informações atualizadas do usuário para o servidor
        await fetch(`http://localhost:3000/User/${UserID}`, {
            method: "PUT",
            body: JSON.stringify(updatedInfos),
            headers: {
                "Content-Type": "application/json"
            }
        })
        // Atualizar o estado de atualização para acionar o useEffect
        setUpdate(true)
    }
    

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Busca as informações atuais do usuário do servidor
        const existingInfos = await getInfos()

        // Adiciona a nova tarefa à lista existente
        const updatedList = [...existingInfos.List, task]

        // Atualiza as informações do usuário com a nova lista de tarefas
        const updatedInfos = { ...existingInfos, List: updatedList }

        // Envia as informações atualizadas do usuário para o servidor
        await fetch(`http://localhost:3000/User/${UserID}`, {
            method: "PUT",
            body: JSON.stringify(updatedInfos),
            headers: {
                "Content-Type": "application/json"
            }
        })
        setUpdate(true)
    }

    async function getInfos(){
       const myAnswer = await fetch(`http://localhost:3000/User/${UserID}`)
       const data = await myAnswer.json()
       return data
    }

    useEffect(() => {
        getInfos().then((res) => setInfos(() => [res]))
        console.log(infos)
        setUpdate(false)
    },[update])

    return(
        <div>
            <header>
                {infos.length > 0 ? infos.map((user) => (
                <h1>Seja bem vindo {user.FirstName}</h1>
            )):null}
                <div>
                    <button onClick={handleGetOut}>Sair</button>
                </div>
            </header>

            <main>
                <form action="" method="post" onSubmit={handleSubmit}>
                    <h3>Your List</h3>
                    <div>
                        <label htmlFor="Task">Tarefa</label>
                        <input type="text" name="" id="Task" placeholder="Qual é sua tarefa?" value={task} onChange={(e) => setTask(e.target.value)}/>
                    </div>
                    <button>Confirmar</button>
                </form>

                <section>
                    <h3>Tarefas</h3>
                    <ol>{infos.length > 0 ? infos.map((element) => (
                        <>
                        {element.List.map((tasks, index) =>(
                        <div key={index}>
                            <li>{tasks}</li>
                            <div>
                                <button>Completar</button>
                                <button onClick={() => handleDeleteTask(index)}>Deletar</button>
                                <button onClick={() => edit(index)}>Editar</button>
                            </div>
                            <div>{editMode === true ? (
                                <form onSubmit={(e) => confirmEdit(e, index)}>
                                    <div>
                                        <label htmlFor="EditInput">Editar</label>
                                        <input type="text" placeholder="Edite sua tarefa" id="EditInput" value={newTitle} onChange={(e) => setNewTitle(e.target.value)}/>
                                    </div>
                                    <div>
                                        <button>Confirmar</button>
                                    </div>
                                </form>
                            ):null}</div>
                        </div>
                        ))}
                        </>
                    )):null}</ol>
                </section>

            </main>
        </div>
    )
}