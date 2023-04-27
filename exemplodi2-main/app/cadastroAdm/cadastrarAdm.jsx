"use client";

import React from 'react';
import { Button, Container } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import zxcvbn from "zxcvbn"; // biblioteca para criação de seha "forte"

const schema = yup.object({
    nome: yup.string()
        .min(10, 'O nome deve possuir, no mínimo, 10 caracteres')
        .max(45, 'O nome deve possuir, no máximo, 45 caracteres')
        .required('O nome do curso é obrigatório'),

    dataNascimento: yup.date()
        .required('A data de nascimento é obrigatória')
        .typeError('A data de nascimento é obrigatória'),

    email: yup.string()
        .email('Digite um e-mail válido')
        .required('O e-mail é obrigatório'),

    senha: yup.string()
        .test("Informe uma Senha-forte", "A senha deve ser forte 8 caracteres com maiúsculo, minúsculo, número e um caractere especial", (value) => {
            const result = zxcvbn(value);
            return result.score >= 3; // pontuação mínima para uma senha ser considerada forte = contém uma combinação de caracteres maiúsculos, minúsculos, números e um caractere especial e comprimento de 8 caracteres.
        })
        .required('A senha é obrigatória'),

}).required();

const CadastroAdm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className='container'>
        <h2>Cadastrando Administrador</h2>
        <form className="row g-3" onSubmit={handleSubmit(onSubmit)}>

            <div className="form-floating mt-2 col-md-8">                
            <input type="text" className="form-control" {...register("nome")}/>
            <label>Nome</label>
            <span className='text-danger'>{errors.nome?.message}</span>
            </div>

            <div className="form-floating mt-2 col-md-4">
            <input type="date" className="form-control" {...register("dataNascimento")} />
            <label>Data de Nascimento</label>
            <span className="text-danger">{errors.dataNascimento?.message}</span>
            </div>

            <div className="form-floating mt-2 col-md-6">
            <input type="email" className="form-control" {...register("email")} />
            <label>E-mail</label>
            <span className='text-danger'>{errors.email?.message}</span>
            </div>
            
            <div className="form-floating mt-2 col-md-6">
                <input type="password" className="form-control" {...register("senha")} />
                <label>Senha</label>
                <span className='text-danger'>{errors.senha?.message}</span>
            </div>

            <Button type="submit" variant="primary">
            Cadastrar
            </Button>

        </form>
        
    </div>
  );
};

export default CadastroAdm;