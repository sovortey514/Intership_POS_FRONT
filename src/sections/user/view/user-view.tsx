import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { useFetchUsers } from 'src/hooks/user/user';
import { mapAllUserToUserProps } from 'src/utils/user-mapping';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { deleteUser } from 'src/api/auth/authService'; // Correct import of deleteUser
import { UserProps, UserTableRow } from '../user-table-row';
import { UserTableHead } from '../user-table-head';
import { applyFilter, getComparator } from '../utils';
import { UserTableToolbar } from '../user-table-toolbar';

export function UserView() {
  const { users, loading } = useFetchUsers(); 
  const [filterName, setFilterName] = useState('');
  const table = useTable();

  // Transform and filter users
  const transformedUsers = mapAllUserToUserProps(users);
  const filteredUsers = applyFilter({
    inputData: transformedUsers,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !filteredUsers.length && filterName;

  // const handleDeleteUser = async (userId: string) => {
  //   try {
  //     await deleteUser(userId); // Call deleteUser function
  //   } catch (error) {
  //     console.error('Error deleting user:', error);
  //   }
  // };

  return (
    <Box display="flex" flexDirection="column" gap={3} padding={3}>
      <Header />
      <UserTable
        users={filteredUsers}
        table={table}
        filterName={filterName}
        setFilterName={setFilterName}
        // deleteUser={handleDeleteUser}  // Pass deleteUser function here
      />
    </Box>
  );
}

// Header component for the page
function Header() {
  return (
    <Box display="flex" alignItems="center" mb={4} justifyContent="space-between">
      <Typography variant="h4" fontWeight="bold">
        Staffs
      </Typography>
      <Button
        variant="contained"
        sx={buttonStyles}
        startIcon={<Iconify icon="mingcute:add-line" />}
      >
        New Staff
      </Button>
    </Box>
  );
}

// User Table component
function UserTable({
  users,
  table,
  filterName,
  setFilterName,
}: {
  users: UserProps[];
  table: any;
  filterName: string;
  setFilterName: React.Dispatch<React.SetStateAction<string>>;
 
}) {
  return (
    <Card sx={{ padding: 3, boxShadow: 2 }}>
      <UserTableToolbar
        numSelected={table.selected.length}
        filterName={filterName}
        onFilterName={handleFilterChange(setFilterName, table)}
      />
      <Scrollbar>
        <TableContainer sx={{ overflow: 'unset', maxHeight: 400 }}>
          <Table sx={{ minWidth: 800 }}>
            <UserTableHead
              order={table.order}
              orderBy={table.orderBy}
              rowCount={users.length}
              numSelected={table.selected.length}
              onSort={table.onSort}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  users.map((user) => user.id)
                )
              }
              headLabel={[
                { id: 'name', label: 'Name' },
                { id: 'role', label: 'Role' },
                { id: 'status', label: 'Status' },
                { id: '' },
              ]}
            />
            <TableBody>
              {users
                .slice(
                  table.page * table.rowsPerPage,
                  table.page * table.rowsPerPage + table.rowsPerPage
                )
                .map((row: UserProps) => (
                  <UserTableRow
                    key={row.id}
                    row={row}
                    selected={table.selected.includes(row.id)}
                    onSelectRow={() => table.onSelectRow(row.id)}
                    deleteUser={() => deleteUser(Number(row.id))}
                  />
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>
      <TablePagination
        component="div"
        page={table.page}
        count={users.length}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        rowsPerPageOptions={[5, 10, 25]}
        onRowsPerPageChange={table.onChangeRowsPerPage}
        sx={{ mt: 2 }}
      />
    </Card>
  );
}

// Handle filter input change
function handleFilterChange(
  setFilterName: React.Dispatch<React.SetStateAction<string>>,
  table: any
) {
  return (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterName(event.target.value);
    table.onResetPage();
  };
}

// Table styling
const buttonStyles = {
  backgroundColor: '#ff6f61',
  color: '#FFFFFF',
  '&:hover': {
    backgroundColor: '#d84315',
  },
  padding: '8px 16px',
  textTransform: 'capitalize',
  borderRadius: '8px',
};

// Custom hook to manage table state
function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [orderBy, order]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    setSelected(checked ? newSelecteds : []);
  }, []);

  const onSelectRow = useCallback((inputValue: string) => {
    setSelected((prev) =>
      prev.includes(inputValue)
        ? prev.filter((value) => value !== inputValue)
        : [...prev, inputValue]
    );
  }, []);

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(Number(event.target.value));
      onResetPage();
    },
    [onResetPage]
  );

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}
