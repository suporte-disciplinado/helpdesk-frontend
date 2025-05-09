import React from 'react';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';

interface UserEditProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    callbackConfirm: (data: any) => void;
    textTitle: string;
    userSelected: any;
}

const UserEdit: React.FC<UserEditProps> = ({ open, setOpen, textTitle, callbackConfirm, userSelected }) => {

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Dialog
        fullWidth
        maxWidth="sm"
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            component: 'form',
            onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const formJson = Object.fromEntries((formData as any).entries());

              callbackConfirm(formJson);
            },
          },
        }}
      >
        <DialogTitle>{textTitle}</DialogTitle>
        <DialogContent>
            <TextField
                autoFocus
                required
                size='small'
                margin="dense"
                id="name"
                name="name"
                label="Nome"
                type="text"
                fullWidth
                variant="standard"
                defaultValue={userSelected?.name}
            />
          
            <TextField
                required
                size='small'
                margin="dense"
                id="email"
                name="email"
                label="E-mail"
                type="email"
                fullWidth
                variant="standard"
                defaultValue={userSelected?.email}
            />

            <TextField
                required
                select
                size='small'
                margin="dense"
                id="role"
                name="role"
                label="Perfil"
                type="text"
                fullWidth
                variant="standard"
                defaultValue={userSelected?.role}
            >
                <MenuItem value="ADMIN">ADMIN</MenuItem>
                <MenuItem value="USER">USER</MenuItem>
            </TextField>

            <div hidden={userSelected != null}>
                <TextField
                    required={userSelected == null}
                    size='small'
                    margin="dense"
                    id="password"
                    name="password"
                    label="Senha"
                    type="text"
                    fullWidth
                    variant="standard"
                />
            </div>
        </DialogContent>
        <DialogActions>
          <Button type="submit">Confirmar</Button>
          <Button onClick={handleClose} autoFocus color="inherit">
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default UserEdit;