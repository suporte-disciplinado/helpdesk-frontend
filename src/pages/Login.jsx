import Txt from '../baseComponents/Txt'
import { Link } from 'react-router-dom'
import HomePageLayout from '../layout/HomePageLayout'

export default function Login(props){
    return (
        <HomePageLayout>
                {/* Formulario de Login */}
                <Txt bold h1> Home </Txt>
                <Txt light h2> Seja bem vindo</Txt>
                <Txt size='16px' span> 
                    Não possui conta? <Link to="/register"> Cadastre-se !</Link>
                </Txt>
        </HomePageLayout>
    )
}