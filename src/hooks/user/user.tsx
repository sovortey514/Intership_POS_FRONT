import { useState, useEffect } from 'react';

import { deleteUser, GetallUsers, GetallUserswithimage } from 'src/api/auth/authService'; // Adjust as needed
import type { Alluser } from 'src/api/auth/authTypes'; // Adjust import path as needed

export function useFetchUsers() {
  const [users, setUsers] = useState<Alluser[]>([]);
  const [userswithimage, setUserswithimage] = useState<Alluser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [userId, setUserId] = useState<number | null>(null); // Add state for userId

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

  // const fetchUserById = async (id: number) => {
  //   try {
  //     if (!id) return; // Prevent fetching if id is not provided
  //     setLoading(true);
  //     const fetchedUser = await GetUserById(id);
  //     setUsers([fetchedUser]); // Assuming setUsers expects an array
  //   } catch (error) {
  //     console.error('Error fetching user by ID:', error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchUserswithimage = async () => {
    try {
      setLoading(true);
      const fetchedUsersWithImage = await GetallUserswithimage();
      setUserswithimage(fetchedUsersWithImage);
    } catch (error: any) {
      console.error('Error fetching users with images:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    try {
      setLoading(true);
      await deleteUser(id);
      console.log(`User with ID ${id} deleted successfully.`);
      // setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      setUserswithimage((prevUsers) => prevUsers.filter((user) => user.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchUserswithimage();
  }, []);

  return {
    users,
    userswithimage,
    loading,
    handleDeleteUser,
    fetchUsers,
    fetchUserswithimage,
    setUserId 
  };
}
