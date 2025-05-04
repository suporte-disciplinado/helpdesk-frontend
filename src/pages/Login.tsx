import React, { useState } from 'react';

import { Link } from 'react-router-dom';
import HomePageLayout from '../components/Layout/Login/LoginLayout';

import {
    Button,
    TextField,
    Grid,
    Typography,
    Snackbar,
    Alert,
    AlertColor,
} from '@mui/material';

import api from '../services/api';

const Login = () => {

    const [loading, setLoading] = useState(false);

    const [openAlert, setOpenAlert] = useState(false);
    const [msgAlert, setMsgAlert] = useState('');
    const [colorAlert, setColorAlert] = useState<AlertColor>('success');

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        if (loading) return;

        if (formData.email === '' || formData.password === '') {
            setOpenAlert(true);
            setMsgAlert('E-mail e senha obrigatórios!');
            setColorAlert('error');
            return;
        }

        setLoading(true);
        try {
            const dataResponse = await api.post(`/api/auth/login`, formData);
            const {name} = dataResponse.data.user;

            const basicToken = btoa(`${formData.email}:${formData.password}`);
            localStorage.setItem('serviceToken', basicToken);
            localStorage.setItem('name', name);

            window.location.pathname = '/tickets';            
        } catch (error:any) {
            setOpenAlert(true);
            setMsgAlert('Erro. Credenciais Inválidas!');
            setColorAlert('error');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseAlert = () => {
        setOpenAlert(false);
        setMsgAlert('');
    }

    return (
        <>
            <HomePageLayout>
                <Grid container spacing={2}>
                    <Grid size={12}>
                        <Typography variant="h5" component="h1" gutterBottom>
                            Acesse sua conta
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Não possui conta? <Link to="/register"> Cadastre-se !</Link>
                        </Typography>
                    </Grid>
                    <Grid size={12}>
                        <TextField
                            autoFocus
                            id="email"
                            name="email"
                            slotProps={{
                                inputLabel: {
                                shrink: true,
                                },
                            }}
                            label="E-mail"
                            variant="outlined"
                            fullWidth
                            size="small"
                            value={formData.email}
                            onChange={handleChange}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSubmit();
                                }
                            }}
                        />
                    </Grid>
                    <Grid size={12}>
                        <TextField
                            autoComplete='off'
                            id="password"
                            name="password"
                            slotProps={{
                                inputLabel: {
                                shrink: true,
                                },
                            }}
                            label="Senha"
                            variant="outlined"
                            fullWidth
                            size="small"
                            value={formData.password}
                            type="password"
                            onChange={handleChange}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSubmit();
                                }
                            }}
                        />
                    </Grid>
                    <Grid size={12}>
                        <Button variant="contained" color="info" 
                            onClick={handleSubmit}>Entrar</Button>
                    </Grid>
                </Grid>
            </HomePageLayout>

             <Snackbar
                open={openAlert}
                autoHideDuration={6000}
                onClose={handleCloseAlert}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseAlert}
                    severity={colorAlert}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {msgAlert}
                </Alert>
            </Snackbar>
        </>
    )
};

export default Login;