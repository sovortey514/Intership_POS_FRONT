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
      await deleteUser(userId);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error.message);
    }
  };

  useEffect(() => {
    fetchUsers(); // Fetch users on component mount
  }, []);

  return { users, loading, fetchUsers, handleDeleteUser };
}
