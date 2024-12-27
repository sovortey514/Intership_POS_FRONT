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
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
} from '@mui/material';

import { useFetchUsers } from 'src/hooks/user';

// import { deleteUser } from 'src/api/auth';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------
export type UserProps = {
  id: string;
  name: string | null;
  username: string | null;
  email: string;
  role: string;
  status: string;
  avatarUrl: string | null;
  isVerified: boolean;
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
  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleOpenConfirmDialog = () => {
    setOpenConfirmDialog(true); // Open the confirmation dialog
    handleClosePopover();
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false); // Close the confirmation dialog without doing anything
  };

  const handleDeleteUser = () => {
    deleteUser(row.id);
    handleClosePopover();
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        {/* Row Select Checkbox */}
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center">
            {/* Avatar with username */}
            <Avatar alt={row.username || row.name || 'User'} src={row.avatarUrl || undefined} />
            <Box>
              {/* Display username or fallback to email if username is not available */}
              {row.username || row.email}
            </Box>
          </Box>
        </TableCell>

        {/* Role and Status */}
        <TableCell>{row.role}</TableCell>
        <TableCell>
          <Label color={row.status === 'banned' ? 'error' : 'success'}>{row.status}</Label>
        </TableCell>

        {/* Action Menu */}
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
          <MenuItem onClick={handleClosePopover}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>
          <MenuItem onClick={handleOpenConfirmDialog} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </Popover>
      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        sx={{
          borderRadius: 2,
          boxShadow: 'none', // Removed the shadow
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
            backgroundColor: 'gray', // Updated background color to gray
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
    </>
  );
}
