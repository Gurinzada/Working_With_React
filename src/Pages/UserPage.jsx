import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../Styles/UserPage.css";

export default function UserPage() {
    const [infos, setInfos] = useState([])
    const [task, setTask] = useState("")
    const [update, setUpdate] = useState(false)
    const [editMode, setEditMode] = useState([])
    const [newTitle, setNewTitle] = useState("")
    const [editIndex, setEditIndex] = useState(null); // Adicionando um estado para controlar o índice do item editado
    const [complete, setComplete] = useState(false)
    const [textBnt, setTextBnt] = useState("Completar")

    const navigate = useNavigate()
    const { UserID } = useParams()

    const handleComplete = (index) => {
        const myDivBackground = document.getElementById(`DivNumb${index}`)
        if(complete === false){
            myDivBackground.classList.add("Green")
            setComplete(true)
            setTextBnt("Incompleto")
        } else{
            myDivBackground.classList.remove("Green")
            setComplete(false)
            setTextBnt("Completar")
        }
    }

    const edit = (index) => {
        setEditMode(true)
        setNewTitle(infos[0].List[index])
        setEditIndex(index) // Atualizando o índice do item editado
    }

    const confirmEdit = async (e, index) => {
        e.preventDefault();
        const updatedInfos = { ...infos[0] }

        updatedInfos.List[index] = newTitle
        setInfos([updatedInfos])

        await fetch(`http://localhost:3000/User/${UserID}`, {
            method: "PUT",
            body: JSON.stringify(updatedInfos),
            headers: {
                "Content-Type": "application/json"
            }
        });
        setUpdate(true)
        setEditMode(false)
        setEditIndex(null) // Reseta o índice do item editado
    }

    const handleGetOut = async () => {
        const updatesInfos = { ...infos[0] }

        updatesInfos.Online = false

        setInfos([updatesInfos])

        await fetch(`http://localhost:3000/User/${UserID}`, {
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
        updatedInfos.List.splice(index, 1)

        // Atualizar as informações do usuário com a nova lista de tarefas
        setInfos([updatedInfos])

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
        });
        setUpdate(true)
        setTask("")
    }

    async function getInfos() {
        const myAnswer = await fetch(`http://localhost:3000/User/${UserID}`)
        const data = await myAnswer.json()
        return data
    }

    useEffect(() => {
        getInfos().then((res) => setInfos(() => [res]))
        setUpdate(false)
    }, [update])

    return (
        <div className="WrapperUser">
            <header className="Header">
                {infos.length > 0 ? infos.map((user) => (
                    <h1>Seja bem vindo {user.FirstName}</h1>
                )) : null}
                <div>
                    <button onClick={handleGetOut} className="Bnt">Sair</button>
                </div>
            </header>

            <main className="MainUser">
                <form action="" method="post" onSubmit={handleSubmit} className="FormUser">
                    <h2>Your List</h2>
                    <div className="InputWrapper">
                        <label htmlFor="Task" className="LabelInput">Tarefa</label>
                        <input type="text" name="" id="Task" placeholder="Qual é sua tarefa?" value={task} onChange={(e) => setTask(e.target.value)} />
                    </div>
                    <button className="Bnt">Adicionar</button>
                </form>

                <section className="SectionTasks">
                    <h3>Tarefas</h3>
                    <ol className="List">
                        {infos.length > 0 ? infos.map((element) => (
                            <>
                                {element.List.map((tasks, index) => (
                                    <div key={index} id={`DivNumb${index}`} className="DivTasks">
                                        <li>{tasks}</li>
                                        <div className="WrapperBnts">
                                            <button className="Bnt" onClick={() => handleComplete(index)}>{textBnt}</button>
                                            <button onClick={() => handleDeleteTask(index)} className="Bnt">Deletar</button>
                                            <button onClick={() => edit(index)} className="Bnt">Editar</button>
                                        </div>
                                        <div>
                                            {editMode && editIndex === index ? ( // Verifica se o editMode está ativo e se o índice do item editado corresponde ao índice atual
                                                <form onSubmit={(e) => confirmEdit(e, index)} className="FormEdit">
                                                    <div className="WrapperEdit">
                                                        <label htmlFor="EditInput" className="LabelInput">Editar</label>
                                                        <input type="text" placeholder="Edite sua tarefa" id="EditInput" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="InputEdit"/>
                                                    </div>
                                                    <div>
                                                        <button className="Bnt">Confirmar</button>
                                                    </div>
                                                </form>
                                            ) : null}
                                        </div>
                                    </div>
                                ))}
                            </>
                        )) : null}
                    </ol>
                </section>
            </main>
            <footer className="Footer">
                <div>
                    <p>Nos da TaskSync agradecemos sua presença!</p>
                </div>
                <h6>TaskSync- 2024 &copy;</h6>
            </footer>
        </div>
    );
}
