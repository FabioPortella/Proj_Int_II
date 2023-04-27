'use client'

import { SessionProvider } from "next-auth/react";

export default function LoginContainer({ children }) {

    return (
        <>
            <SessionProvider>
                {children}
            </SessionProvider>
        </>
    )
}