import * as React from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface AlertDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    callbackConfirm: () => void;
    textTitle: string;
    textMessage: string;
  }

const AlertDialog: React.FC<AlertDialogProps> = ({ open, setOpen, textTitle, textMessage, callbackConfirm }) => {
  
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {textTitle}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {textMessage}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={callbackConfirm}>Confimar</Button>
                    <Button onClick={handleClose} autoFocus color="inherit">
                        Cancelar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default AlertDialog;
