import BusyButton from "@/app/componentes/buusybutton";
import { useContext, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { MessageCallbackContext, TokenContext } from "../layout";
import { AtualizarTipoCursoContext } from "./cliente";

export default function TipoCursoRemover(props) {

    const [modalShow, setModalShow] = useState(true);
    const [busy, setBusy] = useState(false);

    const atualizarCallback = useContext(AtualizarTipoCursoContext);
    const messageCallback = useContext(MessageCallbackContext);
    const tokenCallback = useContext(TokenContext);

    const { handleSubmit } = useForm();

    const handleClose = () => {
        atualizarCallback.fechar();
        setModalShow(false);
    }

    const onSubmit = () => {
        setBusy(true);
        atualizarCallback.serverRequest({method: 'delete', args: {id: props.id, token: tokenCallback.get()}}).then((result) => {
            setBusy(false);
            if (result.success) {
                handleClose();
                atualizarCallback.atualizar(true);
                messageCallback({ tipo: 'sucesso', texto: result.data });
            }
            else{
                messageCallback({tipo: 'erro', texto: result.data});
            }
        });
    }

    return (
        <Modal size="md" centered show={modalShow}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Modal.Header>
                    <Modal.Title>Remoção de Tipo de Curso</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Deseja realmente remover este tipo de curso?
                </Modal.Body>
                <Modal.Footer>
                    <BusyButton variant="danger" type="submit" label="Remover" busy={busy} />
                    <Button variant="secondary" onClick={handleClose}>Fechar</Button>
                </Modal.Footer>
            </form>
        </Modal>
    )
}