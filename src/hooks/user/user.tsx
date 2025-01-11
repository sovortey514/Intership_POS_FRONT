import { useState, useEffect } from 'react';

import { deleteUser, GetallUsers, GetallUserswithimage, getUserById } from 'src/api/auth/authService'; // Adjust as needed
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

  const handleGetUserById = async (id: number) => {
    try {
      setLoading(true);
      const user = await getUserById(id);
      if (user) {
        console.log(`User with ID ${id} fetched successfully.`, user);
        setUsers([user]);
        setUserswithimage([user]);
      } else {
        console.log(`User with ID ${id} not found.`);
      }
    } catch (error: any) {
      console.error('Error fetching user by ID:', error.message);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    console.log('Current userId:', userId);
    if (userId !== null) {
      handleGetUserById(userId);
    }
  }, [userId]);

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
    setUserId,
    handleGetUserById 
  };
}
