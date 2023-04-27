'use client'

import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import BusyButton from "../componentes/buusybutton";
import { useContext, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export const schema = yup.object({
    email: yup.string()
        .email('Utilize um e-mail válido')
        .required('Campo obrigatório'),
    senha: yup.string()
        .required('Campo obrigatório')
}).required();

export default function LoginCliente(props) {

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const [busy, setBusy] = useState(false);
    const [mensagemErro, setMensagemErro] = useState(null);
    const {data:session, status} = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();

    const onSubmit = (data) => {
        setBusy(true);
        signIn("credentials", { username: data.email, password: data.senha })
    }

    useEffect(()=>{
        if(status === "authenticated"){
            router.replace("/");
        }
        else if(status === "unauthenticated" && searchParams.has('error')){
            setMensagemErro(searchParams.get('error'));
            router.replace("/login");
        }
    },[status,mensagemErro])

    return (
        <>
            <div className="d-flex justify-content-center">
                <div className="m-0" style={{ position: 'absolute', top: '35%' }}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="container my-auto text-center">
                            <label className="row mx-2">
                                E-mail
                                <input type="email" className="form-control"  {...register("email")} />
                                <span className='text-danger'>{errors.email?.message}</span>
                            </label>
                            <label className="row mx-2 mt-2">
                                Senha
                                <input type="password" className="form-control"  {...register("senha")} />
                                <span className='text-danger'>{errors.senha?.message}</span>
                            </label>
                            <div className="mt-3">
                                <BusyButton variant="primary" type="submit" label="Salvar" busy={busy} />
                            </div>
                        </div>
                    </form>
                    <span className="text-danger">
                        {mensagemErro}
                    </span>
                </div>
            </div>
        </>
    )
}