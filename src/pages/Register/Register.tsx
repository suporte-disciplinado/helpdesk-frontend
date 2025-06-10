import { Link } from 'react-router-dom';
import HomePageLayout from '../../components/Layout/Login/LoginLayout';
import styles from "./Register.module.css";
import { handleInputChange } from "../../utils/actions";
import {
    Typography,
    Grid,
    TextField,
    Button,
    Snackbar,
    Alert,
    AlertColor
} from '@mui/material';
import { useState } from 'react';
import { FormData } from './types';
import apiService from "../../services/api";

const textInputClasses = {
    root: styles.textInput
};

const Register = () => {
    const [form, setForm] = useState<FormData>({
        name: '',
        password: '',
        email: '',
        role: 'USER'
    });

    const [loading, setLoading] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    const [colorAlert, setColorAlert] = useState<AlertColor>("success");
    const [msgAlert, setMsgAlert] = useState("");

    const handleSubmit = async () => {
        if (loading) return;

        setLoading(true);
        try {
            const response = await apiService.post("/api/auth/register", form);
            console.log(response);
            handleAlert("Sucesso: Usuário cadastrado com sucesso!", true, "success");
        } catch (error: any) {
            handleAlert(error.message, true, "error");
        } finally {
            setForm({
                name: "",
                password: "",
                email: "",
                role: "USER"
            });
            setLoading(false);
        }
    }

    const handleAlert = (message:string, state:boolean, color:AlertColor) => {
        setOpenAlert(state);
        setMsgAlert(message);
        setColorAlert(color);
    }

    return (
        <>
            <HomePageLayout>
                <Grid container spacing={2}>
                    <Grid size={12}>
                        <Typography variant='h5' component="h1">Cadastre uma Conta</Typography>
                        <Typography component="p" gutterBottom color='textSecondary'>
                            Possui uma conta? <Link to="/login"> Faça login.</Link>
                        </Typography>
                    </Grid>
                    <Grid component="form"
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit();
                        }}
                        size={12}
                    >
                        <TextField
                            id='nameInput'
                            slotProps={{
                                inputLabel: {
                                    shrink: true
                                }
                            }}
                            autoFocus
                            label='Nome'
                            size='small'
                            required
                            fullWidth
                            disabled={loading}
                            classes={textInputClasses}
                            value={Object.keys(form).length === 0 ? "" : form.name}
                            onChange={(e) => handleInputChange("name", e.target.value, form, setForm)}
                        ></TextField>
                        <TextField
                            id='emailInput'
                            slotProps={{
                                inputLabel: {
                                    shrink: true
                                }
                            }}
                            autoFocus
                            label='E-mail'
                            size='small'
                            required
                            fullWidth
                            type='email'
                            disabled={loading}
                            classes={textInputClasses}
                            value={Object.keys(form).length === 0 ? "" : form.email}
                            onChange={(e) => handleInputChange("email", e.target.value, form, setForm)}
                        ></TextField>
                        <TextField
                            id='passwordInput'
                            slotProps={{
                                inputLabel: {
                                    shrink: true
                                }
                            }}
                            autoFocus
                            label='Senha'
                            size='small'
                            required
                            fullWidth
                            type='password'
                            disabled={loading}
                            classes={textInputClasses}
                            value={Object.keys(form).length === 0 ? "" : form.password}
                            onChange={(e) => handleInputChange("password", e.target.value, form, setForm)}
                        ></TextField>
                        <Button
                            type='submit'
                            variant='contained'
                        >
                            <Typography component="p" fontSize={15}>
                                Registrar
                            </Typography>
                        </Button>
                    </Grid>
                </Grid>
            </HomePageLayout>
            <Snackbar
                open={openAlert}
                autoHideDuration={6000}
                onClose={() => handleAlert("", false, colorAlert)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => handleAlert("", false, colorAlert)}
                    severity={colorAlert}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {msgAlert}
                </Alert>
            </Snackbar>
        </>
    )
}

export default Register;