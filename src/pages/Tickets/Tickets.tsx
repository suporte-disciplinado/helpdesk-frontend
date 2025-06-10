import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import Layout from "../../components/Layout/Layout";
import AlertDialog from "../../baseComponents/AlertDialog";
//import UserEdit from "./UserEdit";

import styles from './Tickets.module.css';

import { 
    DataGrid, GridActionsCellItem, GridColDef, GridValueGetter 
} from '@mui/x-data-grid';

import {
    Typography, 
    Button,
    TextField,
    Grid,
    Tooltip,
    Snackbar,
    Alert,
    AlertColor,
    Chip,
    MenuItem
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SearchIcon from '@mui/icons-material/Search';

import api from '../../services/api';

import { TicketStatus } from '../../types/TicketStatus';

const Tickets = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [tickets, setTickets] = useState([]);
    const [ticketSelected, setTicketSelected] = useState(null);

    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState('OPEN');

    const [openDialogDelete, setOpenDialogDelete] = useState(false);

    const [openAlert, setOpenAlert] = useState(false);
    const [msgAlert, setMsgAlert] = useState('');
    const [colorAlert, setColorAlert] = useState<AlertColor>('success');

    const paginationModel = { page: 0, pageSize: 10 };

    const columns: GridColDef[] = [
        { 
            field: 'id', 
            headerName: 'ID', 
            width: 50,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => {
                return (
                    <Link 
                        to={`/ticket/${params.row.id}`} 
                    >
                        {params.row.id}
                    </Link>
                );
            },
        },
        { field: 'title', headerName: 'Título', minWidth: 200, flex: 1 },
        {   
            field: 'category', 
            headerName: 'Categoria', 
            width: 200, 
            valueGetter: (category) => {
                return (category?.name || '') as GridValueGetter
            }
        },
        {   
            field: 'assignedAgent', 
            headerName: 'Responsável', 
            width: 150, 
            valueGetter: (user) => {
                return (user?.name || '') as GridValueGetter
            }
        },
        {   
            field: 'status', 
            headerName: 'Status', 
            width: 140, 
            renderCell: (params) => (
                <Chip
                    sx={{ fontSize: '11px', width: '100%', textAlign: 'center' }}
                    label={getStatusName(params.value)}
                    color={
                        params.value === 'OPEN'
                        ? 'primary'
                        : params.value === 'IN_PROGRESS'
                        ? 'warning'
                        : params.value === 'RESOLVED'
                        ? 'success'
                        : 'default'
                    }
                    size="small"
                />
            )
        },
        {   
            field: 'user', 
            headerName: 'Aberto por', 
            width: 150, 
            valueGetter: (user) => {
                return (user?.name || '') as GridValueGetter
            }
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
                            id="btEditTicket"
                            icon={<EditIcon />}
                            label="Editar"
                            onClick={editTicket(row)}
                            color="info"
                        />
                    </Tooltip>,
                    <Tooltip title="Excluir" placement="bottom" arrow>
                        <GridActionsCellItem
                            key={2}
                            id="btDeleteTicket"
                            icon={<DeleteIcon />}
                            label="Excluir"
                            onClick={deleteTicket(row)}
                            color="error"
                        />
                    </Tooltip>
                ];
            }
        },
      ];

    const getStatusName = (statusId: string) =>
        TicketStatus.find((item) => item.id === statusId)?.name || statusId;

     useEffect(() => {
        listTickets();
    }, []);

    const listTickets = async () => {
        if (loading) return;

        setLoading(true);
        try {
            const rows = await api.get(`/api/ticket?search=${searchText}`);
            setTickets(rows.data);
        } catch (error) {
            setOpenAlert(true);
            setMsgAlert('Erro. Consulte o suporte técnico!');
            setColorAlert('error');
        } finally {
            setLoading(false);
        }
    }

    const newTicket = () => {
        navigate('/ticket');
    }

    const editTicket = (row: any) => () => {
        navigate(`/ticket/${row.id}`);
    }

    const deleteTicket = (row: any) => () => {
        setOpenDialogDelete(true);
        setTicketSelected(row);
    }
    const confirmDeleteTicket = async () => {
        if (loading) return;
        if (!ticketSelected) return;

        setLoading(true);
        try {
            await api.delete(`/api/ticket/${ticketSelected.id}`);
            
            setOpenDialogDelete(false);
            listTickets();

            setOpenAlert(true);
            setMsgAlert('Ticket excluído com sucesso!');
            setColorAlert('success');
        } catch (error) {
            setOpenAlert(true);
            setMsgAlert('Erro. Consulte o suporte técnico!');
            setColorAlert('error');
        } finally {
            setLoading(false);
            setTicketSelected(null);
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
                        Gestão de Chamados
                    </Typography>
                    <Button variant="contained" color="info" startIcon={<AddIcon />}
                        onClick={newTicket}>
                        Novo Ticket
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
                                            listTickets();
                                        }
                                    }}
                                />
                            </Grid>

                            <Grid size={2}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Status"
                                    size="small"
                                    value={statusFilter}
                                    onChange={(e) => {
                                        setStatusFilter(e.target.value);
                                        listTickets();
                                    }}
                                    SelectProps={{
                                        displayEmpty: true,
                                    }}
                                >
                                    <MenuItem value="">Todos</MenuItem>
                                    {TicketStatus.map((status) => (
                                        <MenuItem key={status.id} value={status.id}>
                                            {status.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid size={2}>
                                <Button fullWidth variant="contained" color="info" startIcon={<SearchIcon />}
                                    onClick={listTickets}
                                >
                                    Localizar
                                </Button>
                            </Grid>
                        </Grid>
                    </div>
                    
                    <hr/>

                    <DataGrid
                        rows={tickets}
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
                </div>
            </Layout>

            <AlertDialog
                open={openDialogDelete}
                setOpen={setOpenDialogDelete}
                callbackConfirm={confirmDeleteTicket}
                textTitle="Excluir Ticket"
                textMessage="Você tem certeza que deseja excluir este ticket?"
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

export default Tickets;