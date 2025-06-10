import { useState } from "react";

import {
    Typography, 
    Button,
    Grid,
} from '@mui/material';

import Layout from "../../components/Layout/Layout";
import styles from './Tables.module.css';

import TicketCategoryDialog from "./Dialog/TicketCategoryDialog";

import FormatListBulletedAddIcon from '@mui/icons-material/FormatListBulletedAdd';

const Tables = () => {
    const [openDialog, setOpenDialog] = useState(false);

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };
    
    return(
        <>
            <Layout>
                <div className={styles.pageHeader}>
                    <Typography variant="h6" className={styles.title}>
                        Tabelas
                    </Typography>
                </div>

                <div className={styles.card}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 8 }}>
                            <Typography variant="h6">
                                Categorias
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                Gerencie as categorias de chamados disponíveis.
                            </Typography>
                            <Button
                                variant="outlined" 
                                color="info" 
                                startIcon={<FormatListBulletedAddIcon />}
                                onClick={handleOpenDialog}
                            >
                                Categorias de Chamados
                            </Button>
                        </Grid>
                    </Grid>
                </div>
                
                <TicketCategoryDialog 
                    open={openDialog}
                    onClose={handleCloseDialog}
                />
                
            </Layout>
        </>
    );
};

export default Tables;
