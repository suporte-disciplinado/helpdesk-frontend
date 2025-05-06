import { Link } from 'react-router-dom';
import HomePageLayout from '../../components/Layout/Login/LoginLayout';
import styles from "./Register.module.css";
import {
    Typography
} from '@mui/material';

const Register = () => {
    return (
        <HomePageLayout>
                <Typography> Cadastro </Typography>
                <Typography> Crie sua conta</Typography>
                <Typography> 
                    Possui uma conta? <Link to="/login"> Faça login.</Link>
                </Typography>
        </HomePageLayout>
    )
}

export default Register;