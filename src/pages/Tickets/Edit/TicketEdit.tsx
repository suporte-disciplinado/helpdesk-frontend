import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';

import Layout from "../../../components/Layout/Layout";
import styles from './Ticket.module.css';

import {
    Typography, 
    Button,
    TextField,
    MenuItem,
    Grid,
    Snackbar,
    Alert,
    AlertColor,
} from '@mui/material';

import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

import api from '../../../services/api';
import { TicketCategory } from '../../../types/TicketCategory';
import { TicketPriority } from '../../../types/TicketPriority';

const Profile = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [disabledButtons, setDisabledButtons] = useState(false);

    const [listCategories, setListCategories] = useState<TicketCategory[]>([]);

    const [openAlert, setOpenAlert] = useState(false);
    const [msgAlert, setMsgAlert] = useState('');
    const [colorAlert, setColorAlert] = useState<AlertColor>('success');

    const { id } = useParams<{ id: string }>();
    const idTicket = id;

    const [formData, setFormData] = useState({
        id: null,
        user: {
            id: 1,
        },
        assignedAgent: {
            id: 1,
        },
        title: '',
        category: {
            id: 0,
        },
        description: '',
        priority: 'MEDIUM',
        status: 'OPEN',
    });

    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (idTicket) {
            console.log('idTicket', idTicket);
            handleListCategories();
            loadTicket();
        }
    }, [idTicket]);

    const loadTicket = async () => {
        if (loading) return;

        setLoading(true);
        setDisabledButtons(false);
        try {
            const rows = await api.get(`/api/ticket/${idTicket}`);
            setFormData(rows.data);

            setDisabledButtons(false);
        } catch (error) {
            setOpenAlert(true);
            setMsgAlert('Erro. Consulte o suporte técnico!');
            setColorAlert('error');
            setDisabledButtons(true);
        } finally {
            setLoading(false);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
         if (name === 'category') {
            setFormData(prev => ({
            ...prev,
            category: {
                ...prev.category,
                id: Number(value)
            }
            }));
        } else {
            setFormData(prev => ({
            ...prev,
            [name]: value
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (loading) return;
        if (!formData.title || !formData.description) return;

        try {
            setLoading(true);
            
            if (formData.id) {
                await api.put(`/api/ticket`, formData);
                setMsgAlert('Ticket atualizado com sucesso!');
            } else {
                await api.post(`/api/ticket`, formData);
                setMsgAlert('Ticket cadastrado com sucesso!');
            }

            setOpenAlert(true);
            setColorAlert('success');

            setTimeout(() => {
                navigate('/tickets');
            }, 500);
        } catch (error) {
            setOpenAlert(true);
            setMsgAlert('Erro. Consulte o suporte técnico!');
            setColorAlert('error');
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate('/tickets');
    }

    const handleListCategories = async () => {
        if (loading) return;

        setLoading(true);
        try {
            const rows = await api.get('/api/category');
            setListCategories(rows.data);
        } catch (error) {
            setOpenAlert(true);
            setMsgAlert('Erro. Consulte o suporte técnico!');
            setColorAlert('error');
        } finally {
            setLoading(false);
        }
    }

    const handleCloseAlert = () => {
        setOpenAlert(false);
        setMsgAlert('');
    }
    
    return(
        <>
            <Layout>
                <div className={styles.pageHeader}>
                    <Typography variant="h6" className={styles.title}>
                        {idTicket ? `Alterar Ticket` : `Novo Ticket`}
                    </Typography>
                    <div>
                        <Button variant="outlined" color="info" startIcon={<SaveIcon />}
                            onClick={() => formRef.current?.requestSubmit()}
                            disabled={loading || disabledButtons}
                            sx={{ mr: 1 }}>
                            Salvar
                        </Button>
                        <Button variant="outlined" color="secondary" startIcon={<CancelIcon />}
                            onClick={handleBack}>
                            Cancelar
                        </Button>
                    </div>
                </div>

                <div className={styles.card}>
                    <form ref={formRef}  onSubmit={handleSubmit} autoComplete="off">
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 8 }}>
                                <TextField
                                    autoFocus
                                    required
                                    id="title"
                                    name="title"
                                    label="Título"
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    value={formData.title}
                                    onChange={handleChange}
                                />
                            </Grid>
                             <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    select
                                    id="category"
                                    name="category"
                                    label="Categoria"
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    value={formData.category.id}
                                    onChange={handleChange}
                                >
                                    <MenuItem key={0} value={0}>Nenhuma</MenuItem>
                                    {listCategories.map((item) => (
                                        <MenuItem key={item.id} value={item.id}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid size={12}>
                                <TextField
                                    required
                                    id="description"
                                    name="description"
                                    label="Descrição"
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    value={formData.description}
                                    type="email"
                                    minRows={8}
                                    multiline
                                    onChange={handleChange}
                                />
                            </Grid>
                             <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    required
                                    select
                                    id="priority"
                                    name="priority"
                                    label="Prioridade"
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    value={formData.priority}
                                    onChange={handleChange}
                                >
                                    {TicketPriority.map((item) => (
                                        <MenuItem key={item.id} value={item.id}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
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