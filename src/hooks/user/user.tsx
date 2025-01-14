import { useState, useEffect } from 'react';

import { deleteUser, GetallUsers, GetallUserswithimage, getUserById, Update } from 'src/api/auth/authService'; // Adjust as needed
import type { Alluser, UpdateRequest } from 'src/api/auth/authTypes'; // Adjust import path as needed

export function useFetchUsers() {
  const [users, setUsers] = useState<Alluser[]>([]);
  const [userswithimage, setUserswithimage] = useState<Alluser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [image, setImage] = useState<File | null>(null); 
  // Add state for userId
  
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

  const handleUserUpdated = async () => {
    if (userId === null) {
      console.error('User ID is null, cannot update user.');
      return;
    }
  
    setLoading(true);
    try {
      const updateData: UpdateRequest = { email, password, role };
      const response = await Update(userId, updateData);
  
      if (response.statusCode === 200) {
        console.log('User updated successfully.');
        // Optionally, refetch the updated user data
        await handleGetUserById(userId);
        // Call a function like onUserUpdated() if needed
      } else {
        console.error('Failed to update user:', response.message || 'Unknown error');
      }
    } catch (error: any) {
      console.error('Error updating user:', error.message);
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
    handleGetUserById,
    handleUserUpdated 
  };
}
