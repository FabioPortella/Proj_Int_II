import BusyButton from "@/app/componentes/buusybutton";
import { useEffect, useState, useContext } from "react";
import { Button, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { schema } from "./novo";
import { MessageCallbackContext, TokenContext } from "../layout";
import { AtualizarTipoCursoContext } from "./cliente";

export default function TipoCursoAtualizacao(props) {

    const [modalShow, setModalShow] = useState(true);
    const [busy, setBusy] = useState(false);
    const [primeiroAcesso, setPrimeiroAcesso] = useState(null);

    const messageCallback = useContext(MessageCallbackContext);
    const atualizarCallback = useContext(AtualizarTipoCursoContext);
    const tokenCallback = useContext(TokenContext);

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const handleClose = () => {
        atualizarCallback.fechar();
        setModalShow(false);
    }

    const onSubmit = (data) => {
        setBusy(true);
        data.id = props.id;
        data.token = tokenCallback.get();
        atualizarCallback.serverRequest({method: 'put', args: data}).then((result) => {
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

    useEffect(() => {
        if (modalShow === false) {
            reset({ nome: '', descricao: '' })
        }
    }, [modalShow]);

    useEffect(() => {
        if (primeiroAcesso === null)
            setPrimeiroAcesso(true);
    
        if (primeiroAcesso) {
            setPrimeiroAcesso(false);
            atualizarCallback.serverRequest({method: 'get', args: {id: props.id, token: tokenCallback.get()}}).then(
                (result) => {
                    if (result.success)
                        reset({ nome: result.data.nome, descricao: result.data.descricao });
                    else {
                        handleClose();
                        messageCallback({tipo: 'erro', texto: result.data});
                    }
                }
            );
        }
    }, [primeiroAcesso]);

    return (
        <Modal size="md" centered show={modalShow}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Modal.Header>
                    <Modal.Title>Atualização de Tipo de Curso</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <label className="row mx-2">
                        Nome
                        <input type="text" className="form-control"  {...register("nome")} />
                        <span className='text-danger'>{errors.nome?.message}</span>
                    </label>
                    <label className="row mx-2 mt-2">
                        Descrição
                        <textarea className="form-control" style={{ height: '120px' }}  {...register("descricao")} />
                        <span className='text-danger'>{errors.descricao?.message}</span>
                    </label>
                </Modal.Body>
                <Modal.Footer>
                    <BusyButton variant="success" type="submit" label="Salvar" busy={busy} />
                    <Button variant="secondary" onClick={handleClose}>Fechar</Button>
                </Modal.Footer>
            </form>
        </Modal>
    )
}