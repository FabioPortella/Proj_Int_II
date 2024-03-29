import 'bootstrap/dist/css/bootstrap.min.css'
import LoginContainer from './componentes/loginContainer'

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <LoginContainer>
          {children}
        </LoginContainer>
      </body>
    </html>
  )
}
