/* eslint-disable no-restricted-globals */
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
import {
  Dialog,
  Button,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@mui/material';

// import { deleteUser } from 'src/api/auth';

import type { UpdateRequest } from 'src/api/auth/authTypes';

import { enableUser, disableUser, getUserById, Update } from 'src/api/auth/authService';

import { Iconify } from 'src/components/iconify';

import { UpdateformView } from '../auth';
// ----------------------------------------------------------------------
export type UserProps = {
  id: string;
  name: string | null;
  username: string | null;
  email: string;
  role: string;
  status: string;
  image: string;
  avatarUrl: string | null;
  isVerified: boolean;
  files: {
    fileName: string;
    fileType: string;
    fileUrl: string;
  }[];
};

type UserTableRowProps = {
  row: UserProps;
  selected: boolean;
  onSelectRow: () => void;
  deleteUser: (userId: string) => void;
};

export function UserTableRow({ row, selected, onSelectRow, deleteUser }: UserTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProps | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleOpenConfirmDialog = () => {
    setOpenConfirmDialog(true);
    handleClosePopover();
  };

  const handleOpenUpdateDialog = () => {
    setOpenUpdateDialog(true);
    handleClosePopover();
  };

  const handleCloseUpdateDialog = () => {
    setOpenUpdateDialog(false);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  const handleDeleteUser = () => {
    deleteUser(row.id);
    handleClosePopover();
    handleCloseConfirmDialog();
  };

  const handlUserUpdate = () => {
    const updateData = { email, password, role };
    Update(Number(row.id), updateData); 
    handleClosePopover();
    handleCloseConfirmDialog();
  };
  

  const handleClickOpen = () => {
    setSelectedUser(row);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  const handleConfirm = async () => {
    if (selectedUser) {
      const isEnabled = selectedUser.status === 'Active';
      try {
        await handleEnableDisable(selectedUser.id, !isEnabled);
        selectedUser.status = isEnabled ? 'Inactive' : 'Active';
        setOpen(false);
      } catch (error) {
        console.error('Error during user status update', error);
      }
    }
  };

  const handleEnableDisable = async (userId: string, isEnabled: boolean) => {
    try {
      const numericUserId = parseInt(userId, 10);
      if (isNaN(numericUserId)) {
        console.error('Invalid userId: Unable to convert to number');
        return;
      }

      const user = await getUserById(numericUserId);
      if (!user) {
        console.error('User not found');
        return;
      }

      const updateRequest = {
        email: user.email,
        password: '',
        role: user.role,
      };

      if (isEnabled) {
        await enableUser(numericUserId, updateRequest);
        user.status = 'Active';
      } else {
        await disableUser(numericUserId, updateRequest);
        user.status = 'Inactive';
      }
    } catch (error: any) {
      console.error('Error updating user status:', error.message);
    }
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center" className="mb-8 text-center">
            {row.files?.length > 0 ? (
              <Avatar
                alt={row.username || row.name || 'User'}
                src={`http://localhost:9090/auth/get_image/${row.files[0].fileName}`} // Assuming fileName holds 'cat1.jpg'
                sx={{ width: 40, height: 40 }}
              />
            ) : (
              <Avatar
                alt={row.username || row.name || 'User'}
                src="/default-avatar.png" // Fallback image
                sx={{ width: 40, height: 40 }}
              />
            )}
            <Box>{row.username || row.email}</Box>
          </Box>
        </TableCell>

        <TableCell>{row.role}</TableCell>
        {/* <TableCell>
          <Label color={row.status === 'banned' ? 'error' : 'success'}>{row.status}</Label>
        </TableCell> */}

        <TableCell>
          <Button
            className={`${
              row.status === 'Active' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
            } border-none rounded-lg p-3 shadow-lg transition-transform duration-300 ease-in-out transform hover:scale-105 focus:outline-none`}
            onClick={handleClickOpen}
          >
            {row.status === 'Active' ? 'Active' : 'Inactive'}
          </Button>

          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{`Are you sure you want to ${row.status === 'Active' ? 'disable' : 'enable'} this user?`}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Confirm your action to {row.status === 'Active' ? 'disable' : 'enable'} the user.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                No
              </Button>
              <Button onClick={handleConfirm} color="primary" autoFocus>
                Yes
              </Button>
            </DialogActions>
          </Dialog>
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      {/* Popover Menu */}
      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
            },
          }}
        >
          <MenuItem onClick={handleOpenUpdateDialog}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>
          <MenuItem onClick={handleOpenConfirmDialog} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </Popover>

      {/* Confirm Deletion Dialog */}
      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        sx={{
          borderRadius: 2,
          boxShadow: 'none',
          maxWidth: 400,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: 'auto',
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: 'gray',
            color: 'white',
            textAlign: 'center',
            borderTopLeftRadius: 2,
            borderTopRightRadius: 2,
            py: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
            Confirm Deletion
          </Typography>
        </DialogTitle>

        <DialogContent
          sx={{
            padding: 3,
            backgroundColor: 'background.default',
            borderBottomLeftRadius: 2,
            borderBottomRightRadius: 2,
          }}
        >
          <Typography
            variant="body1"
            color="textSecondary"
            textAlign="center"
            sx={{ lineHeight: 1.5, fontSize: '1rem' }}
          >
            Are you sure you want to delete this user? This action cannot be undone.
          </Typography>
        </DialogContent>

        <DialogActions
          sx={{
            justifyContent: 'center',
            padding: '16px 24px',
            backgroundColor: 'background.paper',
            borderBottomLeftRadius: 2,
            borderBottomRightRadius: 2,
          }}
        >
          <Button
            onClick={handleCloseConfirmDialog}
            variant="outlined"
            color="primary"
            sx={{
              width: 120,
              borderRadius: 1.5,
              fontWeight: 'bold',
              textTransform: 'none',
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteUser}
            variant="contained"
            color="error"
            sx={{
              width: 120,
              borderRadius: 1.5,
              fontWeight: 'bold',
              textTransform: 'none',
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Dialog */}
      <Dialog
        open={openUpdateDialog}
        onClose={handleCloseUpdateDialog}
        maxWidth="sm"
        fullWidth
        BackdropProps={{
          invisible: true, // Ensures the background remains visible
        }}
      >
        <DialogContent sx={{ overflow: 'hidden' }}>
          <UpdateformView onUserUpdate={handlUserUpdate} userId={Number(row.id)}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdateDialog} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

// function setUsers(arg0: (prevUsers: any) => any) {
//   throw new Error('Function not implemented.');
// }
