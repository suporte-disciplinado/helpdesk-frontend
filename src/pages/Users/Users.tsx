import { useEffect, useState } from "react";

import Layout from "../../components/Layout/Layout";
import AlertDialog from "../../baseComponents/AlertDialog";
import UserEdit from "./UserEdit";

import styles from './Users.module.css';

import { 
    DataGrid, GridActionsCellItem, GridColDef 
} from '@mui/x-data-grid';

import {
    Typography, 
    Button,
    TextField,
    Grid,
    Tooltip,
    Snackbar,
    Alert,
    AlertColor
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SearchIcon from '@mui/icons-material/Search';

import api from '../../services/api';

const Users = () => {
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [userSelected, setUserSelected] = useState(null);
    const [searchText, setSearchText] = useState('');

    const [openDialogDelete, setOpenDialogDelete] = useState(false);
    const [openDialogEdit, setOpenDialogEdit] = useState(false);
    const [typeDialogEdit, setTypeDialogEdit] = useState('');

    const [openAlert, setOpenAlert] = useState(false);
    const [msgAlert, setMsgAlert] = useState('');
    const [colorAlert, setColorAlert] = useState<AlertColor>('success');

    const paginationModel = { page: 0, pageSize: 10 };

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Nome', width: 150 },
        { field: 'email', headerName: 'E-mail', minWidth: 150, flex: 1 },
        {
          field: 'role',
          headerName: 'Perfil',
          width: 100,
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Ações',
            width: 100,
            getActions: ({row}) => {
                return [
                    <Tooltip title="Editar" placement="bottom" arrow>
                        <GridActionsCellItem
                            key={1}
                            icon={<EditIcon />}
                            label="Editar"
                            onClick={editUser(row)}
                            color="info"
                        />
                    </Tooltip>,
                    <Tooltip title="Excluir" placement="bottom" arrow>
                        <GridActionsCellItem
                            key={2}
                            icon={<DeleteIcon />}
                            label="Excluir"
                            onClick={deleteUser(row)}
                            color="error"
                        />
                    </Tooltip>
                ];
            }
        },
      ];

    useEffect(() => {
        listUsers();
    }, []);

    const listUsers = async () => {
        if (loading) return;

        setLoading(true);
        try {
            const axiosConfig = {
                params: {
                    search: searchText,
                },
            }
            const rows = await api.get(`/api/user`, axiosConfig);
            setUsers(rows.data);
        } catch (error) {
            setOpenAlert(true);
            setMsgAlert('Erro. Consulte o suporte técnico!');
            setColorAlert('error');
        } finally {
            setLoading(false);
        }
    }

    const newUser = () => {
        setOpenDialogEdit(true);
        setTypeDialogEdit('new');
        setUserSelected(null);
    }

    const editUser = (row: any) => () => {
        setOpenDialogEdit(true);
        setTypeDialogEdit('edit');
        setUserSelected(row);
    }
    const confirmEditUser = async (user: any) => {
        if (loading) return;

        setLoading(true);
        try {
            if (typeDialogEdit == 'edit') {
                if (!userSelected) return;

                user.id = userSelected.id;
                await api.put(`/api/user`, user);
                setMsgAlert('Usuário editado com sucesso!');
            } else {
                await api.post(`/api/user`, user);
                setMsgAlert('Usuário cadastrado com sucesso!');
            }
            
            setOpenDialogEdit(false);
            listUsers();

            setOpenAlert(true);
            setColorAlert('success');
        } catch (error) {
            setOpenAlert(true);
            setMsgAlert('Erro. Consulte o suporte técnico!');
            setColorAlert('error');
        } finally {
            setLoading(false);
        }
    }

    const deleteUser = (row: any) => () => {
        setOpenDialogDelete(true);
        setUserSelected(row);
    }
    const confirmDeleteUser = async () => {
        if (loading) return;
        if (!userSelected) return;

        setLoading(true);
        try {
            await api.delete(`/api/user/${userSelected.id}`);
            
            setOpenDialogDelete(false);
            listUsers();

            setOpenAlert(true);
            setMsgAlert('Usuário excluído com sucesso!');
            setColorAlert('success');
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
                        Gestão de Usuários
                    </Typography>
                    <Button variant="contained" color="info" startIcon={<AddIcon />}
                        onClick={newUser}>
                        Novo Usuário
                    </Button>
                </div>

                <div className={styles.card}>
                    <div className={styles.searchContainer}>
                        <Grid container spacing={2}>
                            <Grid size={4}>
                                <TextField fullWidth label="Localizar" variant="outlined" size="small" 
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            listUsers();
                                        }
                                    }}
                                />
                            </Grid>

                            <Grid size={2}>
                                <Button fullWidth variant="contained" color="info" startIcon={<SearchIcon />}
                                    onClick={listUsers}
                                >
                                    Localizar
                                </Button>
                            </Grid>
                        </Grid>
                    </div>
                    
                    <hr/>

                    <DataGrid
                        rows={users}
                        rowSelection={false}
                        columns={columns}
                        initialState={{ 
                            pagination: { paginationModel }, 
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
                            '& .MuiDataGrid-columnHeaderTitle': {
                                fontWeight: 'bold',
                                color: '#333',
                            },
                        }}
                    />
                </div>
            </Layout>

            <UserEdit
                open={openDialogEdit}
                setOpen={setOpenDialogEdit}
                callbackConfirm={(user) => confirmEditUser(user)}
                userSelected={userSelected}
                textTitle={typeDialogEdit == "edit" ? "Editar Usuário" : "Novo Usuário"}
            />

            <AlertDialog
                open={openDialogDelete}
                setOpen={setOpenDialogDelete}
                callbackConfirm={confirmDeleteUser}
                textTitle="Excluir Usuário"
                textMessage="Você tem certeza que deseja excluir este usuário?"
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

export default Users;