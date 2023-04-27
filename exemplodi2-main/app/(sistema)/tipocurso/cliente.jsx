'use client'

import { useEffect } from "react"
import { useContext } from "react"
import { createContext } from "react"
import { useState } from "react"
import { Dropdown, Table } from "react-bootstrap"
import { MessageCallbackContext, TokenContext } from "../layout"
import TipoCursoAtualizacao from "./atualizacao"
import TipoCursoNovo from "./novo"
import TipoCursoRemover from "./remocao"

export const metadata = {
    title: 'Tipo de Curso'
}

export const AtualizarTipoCursoContext = createContext(null);

export default function Cliente(props) {

    const [grid, setGrid] = useState(null);
    const [atualizarGrid, setAtualizarGrid] = useState(null);
    const [operacao, setOperacao] = useState({ id: null, action: null });
    const messageCallback = useContext(MessageCallbackContext);
    const tokenCallback = useContext(TokenContext);

    let modal = null;

    if (operacao.action === "update") {
        modal = <TipoCursoAtualizacao id={operacao.id} />
    }
    else if (operacao.action === "delete") {
        modal = <TipoCursoRemover id={operacao.id} />
    }

    const fecharModals = () => {
        setOperacao({ id: null, action: null });
    }

    const pesquisar = () => {
        props.serverRequest({method: 'get', args: {token: tokenCallback.get()}}).then((result) => {
            if (result.success) {
                let finalGrid = result.data.map((p) =>
                    <tr key={p.id}>
                        <td>{p.nome}</td>
                        <td>{p.descricao}</td>
                        <td>
                            <Dropdown>
                                <Dropdown.Toggle>Opção</Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => setOperacao({ id: p.id, action: "update" })}>Atualizar</Dropdown.Item>
                                    <Dropdown.Item onClick={() => setOperacao({ id: p.id, action: "delete" })}>Remover</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </td>
                    </tr>
                );
                setGrid(finalGrid);
            }
            else
                messageCallback({ tipo: 'erro', texto: result.data });
        });
    }

    useEffect(() => {
        if (atualizarGrid === null)
            setAtualizarGrid(true);
        if (atualizarGrid) {
            setAtualizarGrid(false);
            pesquisar();
        }
    }, [atualizarGrid])

    return (
        <>
            <AtualizarTipoCursoContext.Provider value={{ atualizar: setAtualizarGrid, fechar: fecharModals, serverRequest: props.serverRequest }}>
                <TipoCursoNovo />
                {modal}
            </AtualizarTipoCursoContext.Provider>

            <Table striped hover>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Descrição</th>
                        <th>Opções</th>
                    </tr>
                </thead>
                <tbody>
                    {grid}
                </tbody>
            </Table>
        </>
    )
}