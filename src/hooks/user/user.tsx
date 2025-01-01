import { useState, useEffect } from 'react';
import { GetallUsers, deleteUser } from 'src/api/auth/authService'; // Adjust as needed
import { Alluser } from 'src/api/auth/authTypes'; // Adjust import path as needed

export function useFetchUsers() {
  const [users, setUsers] = useState<Alluser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const fetchedUsers = await GetallUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Error fetching users:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      setLoading(true);
      await deleteUser(userId);
      console.log(`User with ID ${userId} deleted successfully.`);
      setUsers(prevUsers => prevUsers.filter((user) => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, loading, handleDeleteUser };
}