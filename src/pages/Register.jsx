import Txt from '../baseComponents/Txt'
import { Link } from 'react-router-dom'
import HomePageLayout from '../layout/HomePageLayout'

export default function Register(props){
    return (
        <HomePageLayout>
                {/* Formulario de Registro */}
                <Txt bold h1> Cadastro </Txt>
                <Txt light h2> Crie sua conta</Txt>
                <Txt size='16px' span> 
                    Possui uma conta? <Link to="/login"> Faça login.</Link>
                </Txt>
        </HomePageLayout>
    )
}