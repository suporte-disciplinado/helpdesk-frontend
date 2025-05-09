import { useEffect, useRef, useState } from "react";

import Layout from "../../components/Layout/Layout";
import styles from './Profile.module.css';

import {
    Typography, 
    Button,
    TextField,
    Grid,
    Snackbar,
    Alert,
    AlertColor,
} from '@mui/material';

import SaveIcon from '@mui/icons-material/Save';

import api from '../../services/api';

const Profile = () => {

    const [loading, setLoading] = useState(false);

    const [openAlert, setOpenAlert] = useState(false);
    const [msgAlert, setMsgAlert] = useState('');
    const [colorAlert, setColorAlert] = useState<AlertColor>('success');

    const [formData, setFormData] = useState({
        id: null,
        name: '',
        email: ''
    });

    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        if (loading) return;

        setLoading(true);
        try {
            const rows = await api.get(`/api/user/profile`);
            setFormData(rows.data);
        } catch (error) {
            setOpenAlert(true);
            setMsgAlert('Erro. Consulte o suporte técnico!');
            setColorAlert('error');
        } finally {
            setLoading(false);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (loading) return;
        if (!formData.name || !formData.email) return;

        try {
            await api.put(`/api/user`, formData);
            setMsgAlert('Perfil salvo com sucesso!');

            setOpenAlert(true);
            setColorAlert('success');
        } catch (error) {
            setOpenAlert(true);
            setMsgAlert('Erro. Consulte o suporte técnico!');
            setColorAlert('error');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseAlert = () => {
        setOpenAlert(false);
        setMsgAlert('');
    }
    
    return(
        <>
            <Layout>
                <div className={styles.pageHeader}>
                    <Typography variant="h6" className={styles.title}>
                        Perfil
                    </Typography>
                    <Button variant="outlined" color="info" startIcon={<SaveIcon />}
                        onClick={() => formRef.current?.requestSubmit()}>
                        Salvar
                    </Button>
                </div>

                <div className={styles.card}>
                    <form ref={formRef}  onSubmit={handleSubmit} autoComplete="off">
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    autoFocus
                                    required
                                    id="name"
                                    name="name"
                                    label="Nome"
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    required
                                    id="email"
                                    name="email"
                                    label="E-mail"
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    value={formData.email}
                                    type="email"
                                    onChange={handleChange}
                                />
                            </Grid>
                        </Grid>
                    </form>
                </div>
                
            </Layout>

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
    );

};

export default Profile;