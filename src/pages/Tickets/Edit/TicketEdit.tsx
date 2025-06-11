import { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

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
    Tabs,
    Tab,
    Box,
    Paper,
    Card,
    CardContent,
    CardHeader,
    Avatar,
    IconButton,
    Divider,
    Autocomplete,
} from '@mui/material';

import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';

import api from '../../../services/api';

import { TicketCategory } from '../../../types/TicketCategory';
import { TicketPriority } from '../../../types/TicketPriority';
import { TicketStatus } from '../../../types/TicketStatus';

interface Comment {
    id: number;
    user: {
        id: number;
        name: string;
    };
    comment: string;
    createdAt: string;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`ticket-tab-${index}`}
            aria-labelledby={`ticket-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ py: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const validationSchema = Yup.object({
    title: Yup.string()
        .required('Título é obrigatório')
        .min(3, 'Título deve ter no mínimo 3 caracteres'),
    description: Yup.string()
        .required('Descrição é obrigatória')
        .min(5, 'Descrição deve ter no mínimo 5 caracteres'),
    category: Yup.object().shape({
        id: Yup.number()
            .min(1, 'Categoria é obrigatória')
            .required('Categoria é obrigatória')
    }),
    assignedAgent: Yup.object().shape({
        id: Yup.number()
            .min(1, 'Responsável é obrigatório')
            .required('Responsável é obrigatório')
    })
});

const TicketEdit = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [tabValue, setTabValue] = useState(0);

    const [loading, setLoading] = useState(false);
    const [listCategories, setListCategories] = useState<TicketCategory[]>([]);
    const [listUsers, setListUsers] = useState<User[]>([]);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');

    const [openAlert, setOpenAlert] = useState(false);
    const [msgAlert, setMsgAlert] = useState('');
    const [colorAlert, setColorAlert] = useState<AlertColor>('success');

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };


    const formik = useFormik({
        initialValues: {
            id: null,
            assignedAgent: {
                id: null,
            },
            title: '',
            category: {
                id: 0,
            },
            description: '',
            priority: 'MEDIUM',
            status: 'OPEN',
            createdAt: null as string | null,
            updatedAt: null as string | null
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            if (loading) return;

            try {
                setLoading(true);
                
                const { createdAt, updatedAt, ...ticketData } = values;
                
                if (values.id) {
                    await api.put('/api/ticket', ticketData);
                    setMsgAlert('Ticket atualizado com sucesso!');
                } else {
                    await api.post('/api/ticket', ticketData);
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
        },
    });

    useEffect(() => {
        formik.resetForm();
        
        handleListCategories();
        handleListUsers();
        
        if (id) {
            loadTicket();
            loadComments();
        }
    }, [id]);

    const loadTicket = async () => {
        if (loading) return;

        setLoading(true);
        try {
            const response = await api.get(`/api/ticket/${id}`);
            formik.setValues(response.data);
        } catch (error) {
            setOpenAlert(true);
            setMsgAlert('Erro. Consulte o suporte técnico!');
            setColorAlert('error');
        } finally {
            setLoading(false);
        }
    }

    const loadComments = async () => {
        if (!id || loading) return;

        try {
            const response = await api.get(`/api/comment?idTicket=${id}`);
            setComments(response.data);
        } catch (error) {
            setMsgAlert('Erro ao carregar comentários!');
            setOpenAlert(true);
            setColorAlert('error');
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim() || loading || !id) return;

        setLoading(true);
        try {
            await api.post('/api/comment', {
                ticket: { id },
                comment: newComment.trim()
            });
            
            setMsgAlert('Comentário adicionado com sucesso!');
            setOpenAlert(true);
            setColorAlert('success');

            setNewComment('');
            loadComments();
        } catch (error) {
            setMsgAlert('Erro ao adicionar comentário!');
            setOpenAlert(true);
            setColorAlert('error');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteComment = async (commentId: number) => {
        if (loading) return;

        setLoading(true);
        try {
            await api.delete(`/api/comment/${commentId}`);
            
            setMsgAlert('Comentário excluído com sucesso!');
            setOpenAlert(true);
            setColorAlert('success');

            loadComments();
        } catch (error) {
            setMsgAlert('Erro ao excluir comentário!');
            setOpenAlert(true);
            setColorAlert('error');
        } finally {
            setLoading(false);
        }
    };

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

    const handleListUsers = async () => {
        if (loading) return;

        setLoading(true);
        try {
            const response = await api.get('/api/user');
            setListUsers(response.data);
        } catch (error) {
            setOpenAlert(true);
            setMsgAlert('Erro ao carregar usuários. Consulte o suporte técnico!');
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
                        {id ? `Alterar Chamado #${id}` : `Novo Chamado`}
                    </Typography>
                    <div>
                        <Button 
                            variant="outlined" 
                            color="info" 
                            startIcon={<SaveIcon />}
                            onClick={() => formik.handleSubmit()}
                            disabled={loading || !formik.isValid}
                            sx={{ mr: 1 }}
                        >
                            Salvar
                        </Button>
                        <Button 
                            variant="outlined" 
                            color="secondary" 
                            startIcon={<CancelIcon />}
                            onClick={() => navigate('/tickets')}
                        >
                            Cancelar
                        </Button>
                    </div>
                </div>

                <Paper sx={{ mb: 3 }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs 
                            value={tabValue} 
                            onChange={handleTabChange}
                            aria-label="ticket tabs"
                        >
                            <Tab label="Informações" />
                            <Tab label="Comentários" />
                        </Tabs>
                    </Box>

                    <TabPanel value={tabValue} index={0}>
                        <div className={styles.tab_ticket}>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, md: 8 }}>
                                    <TextField
                                        autoFocus
                                        fullWidth
                                        id="title"
                                        name="title"
                                        label="Título"
                                        size="small"
                                        value={formik.values.title}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.title && Boolean(formik.errors.title)}
                                        helperText={formik.touched.title && formik.errors.title}
                                        autoComplete="off"
                                        slotProps={{ inputLabel: { shrink: true } }} 
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <Autocomplete
                                        id="category"
                                        options={listCategories}
                                        getOptionLabel={(option) => option.name}
                                        value={listCategories.find(cat => cat.id === formik.values.category?.id) || null}
                                        onChange={(_, newValue) => {
                                            formik.setFieldValue('category', newValue ? { id: newValue.id } : { id: 0 });
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Categoria"
                                                size="small"
                                                fullWidth
                                                error={formik.touched.category?.id && Boolean(formik.errors.category?.id)}
                                                helperText={formik.touched.category?.id && formik.errors.category?.id}
                                                slotProps={{ inputLabel: { shrink: true } }} 
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid size={12}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={4}
                                        id="description"
                                        name="description"
                                        label="Descrição"
                                        size="small"
                                        value={formik.values.description}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.description && Boolean(formik.errors.description)}
                                        helperText={formik.touched.description && formik.errors.description}
                                        autoComplete="off"
                                        slotProps={{ inputLabel: { shrink: true } }} 
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <TextField
                                        select
                                        fullWidth
                                        id="priority"
                                        name="priority"
                                        label="Prioridade"
                                        size="small"
                                        value={formik.values.priority}
                                        onChange={formik.handleChange}
                                    >
                                        {Object.values(TicketPriority).map((priority) => (
                                            <MenuItem key={priority.id} value={priority.id}>
                                                {priority.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <TextField
                                        select
                                        fullWidth
                                        id="status"
                                        name="status"
                                        label="Status"
                                        size="small"
                                        value={formik.values.status}
                                        onChange={formik.handleChange}
                                    >
                                        {TicketStatus.map((status) => (
                                            <MenuItem key={status.id} value={status.id}>
                                                {status.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <Autocomplete
                                        id="assignedAgent"
                                        options={listUsers}
                                        getOptionLabel={(option) => option.name}
                                        value={listUsers.find(user => user.id === formik.values.assignedAgent?.id) || null}
                                        onChange={(_, newValue) => {
                                            formik.setFieldValue('assignedAgent', newValue ? { id: newValue.id } : { id: 0 });
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Responsável"
                                                size="small"
                                                fullWidth
                                                error={formik.touched.assignedAgent?.id && Boolean(formik.errors.assignedAgent?.id)}
                                                helperText={formik.touched.assignedAgent?.id && formik.errors.assignedAgent?.id}
                                                slotProps={{ inputLabel: { shrink: true } }} 
                                            />
                                        )}
                                    />
                                </Grid>
                                {id && (
                                    <>
                                        <Grid size={12}>
                                            <Box sx={{ 
                                                bgcolor: '#f8f9fa', 
                                                p: 2, 
                                                borderRadius: 1,
                                                mb: 2,
                                                border: '1px solid #e9ecef'
                                            }}>
                                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                                    Aberto por: {formik.values.user?.name || 'Não disponível'}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                                    Aberto em: {formik.values.createdAt ? 
                                                        new Date(formik.values.createdAt).toLocaleString('pt-BR', {
                                                            day: '2-digit',
                                                            month: '2-digit',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        }) : 'Não disponível'
                                                    }
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Última Atualização: {formik.values.updatedAt ? 
                                                        new Date(formik.values.updatedAt).toLocaleString('pt-BR', {
                                                            day: '2-digit',
                                                            month: '2-digit',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        }) : 'Não disponível'
                                                    }
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </>
                                )}
                            </Grid>
                        </div>
                    </TabPanel>

                    <TabPanel value={tabValue} index={1}>
                        <Box className={styles.tab_ticket}>
                            <Box className={styles.commentInput}>
                                <TextField
                                    disabled={!id}
                                    fullWidth
                                    multiline
                                    placeholder="Digite seu comentário..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    className={styles.commentTextField}
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleAddComment}
                                    disabled={!newComment.trim() || loading || !id}
                                    className={styles.sendButton}
                                >
                                    ENVIAR
                                </Button>
                            </Box>

                            <Divider sx={{ my: 3 }} />

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {comments.map((comment) => (
                                    <Card key={comment.id} className={styles.commentCard}>
                                        <CardHeader
                                            className={styles.commentHeader}
                                            avatar={
                                                <Avatar className={styles.commentAvatar}>
                                                    {comment.user.name.charAt(0)}
                                                </Avatar>
                                            }
                                            action={
                                                <IconButton 
                                                    aria-label="delete comment"
                                                    onClick={() => handleDeleteComment(comment.id)}
                                                    className={styles.deleteButton}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            }
                                            title={
                                                <Typography className={styles.commentUserName}>
                                                    {comment.user.name}
                                                </Typography>
                                            }
                                            subheader={
                                                <Typography className={styles.commentTime}>
                                                    {new Date(comment.createdAt).toLocaleString('pt-BR', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </Typography>
                                            }
                                        />
                                        <CardContent className={styles.commentContent}>
                                            <Typography className={styles.commentText}>
                                                {comment.comment}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Box>
                        </Box>
                    </TabPanel>
                </Paper>
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

export default TicketEdit;