import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { 
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    TextField,
    Box,
    Paper,
    Divider,
    Snackbar,
    Alert,
    AlertColor,
    Tooltip
} from '@mui/material';

import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

import api from '../../../services/api';
import AlertDialog from '../../../baseComponents/AlertDialog';

import { TicketCategory } from '../../../types/TicketCategory';

interface TicketCategoryProps {
    open: boolean;
    onClose: () => void;
}

const validationSchema = Yup.object({
    name: Yup.string()
        .required('Nome é obrigatório')
        .min(3, 'Categoria deve ter no mínimo 3 caracteres'),
    description: Yup.string()
        .required('Descrição é obrigatória')
        .min(5, 'Descrição deve ter no mínimo 5 caracteres'),
});

const TicketCategoryDialog: React.FC<TicketCategoryProps> = ({ open, onClose }) => {
    
    const [listCategories, setListCategories] = useState<TicketCategory[]>();
    const [categorySelected, setCategorySelected] = useState<TicketCategory>();

    const [loading, setLoading] = useState(false);
    
    const [openAlert, setOpenAlert] = useState(false);
    const [msgAlert, setMsgAlert] = useState('');
    const [colorAlert, setColorAlert] = useState<AlertColor>('success');

    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    const formik = useFormik({
        initialValues: {
            name: '',
            description: ''
        },
        validationSchema: validationSchema,
        onSubmit: async (values: { name: string; description: string }, { resetForm }: { resetForm: () => void }) => {
            if (loading) return;

            try {
                setLoading(true);
                await api.post('/api/category', values);
                
                setMsgAlert('Categoria cadastrada com sucesso!');
                setOpenAlert(true);
                setColorAlert('success');

                handleListCategories();
                resetForm();
            } catch (error) {
                setOpenAlert(true);
                setMsgAlert('Erro. Consulte o suporte técnico!');
                setColorAlert('error');
            } finally {
                setLoading(false);
            }
        },
    });

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Nome', flex: 1 },
        { field: 'description', headerName: 'Descrição', flex: 2 },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Ações',
            width: 100,
            getActions: ({row}: {row: TicketCategory}) => {
                return [
                    <Tooltip title="Excluir" placement="bottom" arrow>
                        <GridActionsCellItem
                            key={1}
                            id="btDeleteCategory"
                            icon={<DeleteIcon />}
                            label="Excluir"
                            onClick={() => handleDeleteCategory(row)}
                            color="error"
                        />
                    </Tooltip>
                ];
            }
        },
    ];

    useEffect(() => {
        if (open) {
            formik.resetForm();
            handleListCategories();
        }
    }, [open]);

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
    };

    const handleDeleteCategory = (row: any) => {
        setOpenConfirmDialog(true);
        setCategorySelected(row);
    };

    const handleConfirmDelete = async () => {
        if (!categorySelected || loading) return;

        try {
            setLoading(true);
            await api.delete(`/api/category/${categorySelected.id}`);

            setMsgAlert('Categoria removida com sucesso!');
            setOpenAlert(true);
            setColorAlert('success');

            handleListCategories();
        } catch (error) {
            setOpenAlert(true);
            setMsgAlert('Erro ao remover a categoria!');
            setColorAlert('error');
        } finally {
            setLoading(false);
            setOpenConfirmDialog(false);
            setCategorySelected(undefined);
        }
    };

    const handleCloseAlert = () => {
        setOpenAlert(false);
        setMsgAlert('');
    };

    return (
        <>
            <Dialog 
                open={open} 
                onClose={onClose}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    <Typography variant="h6">Gerenciar Categorias</Typography>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ 
                        mb: 2, 
                        mt: 2, 
                        display: 'flex', 
                        gap: 2,
                        '& .MuiButton-root': {
                            height: '40px',
                            minWidth: '140px',
                            whiteSpace: 'nowrap'
                        }
                    }}>
                        <TextField
                            fullWidth
                            id="name"
                            name="name"
                            label="Categoria"
                            size="small"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                            autoComplete="off"
                        />
                        <TextField
                            fullWidth
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
                        />
                        <Button
                            disabled={loading || !formik.isValid}
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => formik.handleSubmit()}
                        >
                            Adicionar
                        </Button>
                    </Box>

                    <Divider sx={{ my: 2 }} />
                    
                    <Paper sx={{ height: 400, width: '100%' }}>
                        <DataGrid
                            rows={listCategories || []}
                            rowSelection={false}
                            columns={columns}
                            initialState={{ 
                                pagination: { 
                                    paginationModel: { page: 0, pageSize: 10 } 
                                }, 
                            }}
                            density="compact"
                            pageSizeOptions={[5, 10, 25, 50]}
                            loading={loading}
                            slotProps={{
                                loadingOverlay: {
                                    variant: 'skeleton',
                                    noRowsVariant: 'skeleton',
                                },
                            }}
                            sx={{
                                border: 0,
                                fontSize: '12px',
                                '& .MuiDataGrid-columnHeaderTitle': {
                                    fontWeight: 'bold',
                                    color: '#333',
                                    fontSize: '12px',
                                },
                                '& .MuiDataGrid-cell': {
                                    fontSize: '12px', 
                                },
                                '& .MuiTablePagination-displayedRows, & .MuiTablePagination-selectLabel': {
                                    fontSize: '13px', 
                                },
                            }}
                        />
                    </Paper>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="primary">
                        Fechar
                    </Button>
                </DialogActions>
            </Dialog>

            <AlertDialog
                open={openConfirmDialog}
                setOpen={setOpenConfirmDialog}
                callbackConfirm={handleConfirmDelete}
                textTitle="Confirmar Exclusão"
                textMessage="Tem certeza que deseja excluir esta categoria?"
            />

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

export default TicketCategoryDialog;
