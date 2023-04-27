'use client'

import Link from "next/link";
import { createContext, useContext } from "react";
import { Container, Nav, NavDropdown, Navbar } from "react-bootstrap";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import context from "react-bootstrap/esm/AccordionContext";

const MySwal = withReactContent(Swal);
export const MessageCallbackContext = createContext(null);
export const TokenContext = createContext(null);

export default function Layout({ children }) {

    const { data: session, status } = useSession();
    const router = useRouter();

    const handleMessageCallback = (msg) => {
        if (msg.tipo !== 'nada') {
            let icon = '';
            if (msg.tipo === 'sucesso')
                icon = 'success';
            else if (msg.tipo === 'erro')
                icon = 'error';

            MySwal.fire({
                position: 'top-end',
                icon: icon,
                title: msg.texto,
                showConfirmButton: false,
                timer: 3500,
                toast: true
            })
        }
    }

    const handleSair = () => {
        signOut();
    }

    const getToken = () => {
        return session.apiToken;
    }

    useEffect(() => {
        if (status === "unauthenticated")
            router.replace("/login");
    }, [status])

    if (status === "loading")
        return <p>Loading ... </p>
    else if (status === "authenticated")
        return (
            <>
                <Navbar bg="dark" variant="dark" expand="lg">
                    <Container>
                        <Navbar.Brand href="#home">Exemplo de Projeto</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                <Link href="/" legacyBehavior passHref>
                                    <Nav.Link>Home</Nav.Link>
                                </Link>
                                <Link href="/tipocurso" legacyBehavior passHref>
                                    <Nav.Link>Tipo de Curso</Nav.Link>
                                </Link>
                            </Nav>
                            <Nav>
                                <NavDropdown title="Usuário" id="collasible-nav-dropdown">
                                    <NavDropdown.Item href="" onClick={handleSair}>Sair</NavDropdown.Item>
                                </NavDropdown>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
                <MessageCallbackContext.Provider value={handleMessageCallback}>
                    <TokenContext.Provider value={{get: getToken}}>
                        {children}
                    </TokenContext.Provider>
                </MessageCallbackContext.Provider>
            </>
        )
}