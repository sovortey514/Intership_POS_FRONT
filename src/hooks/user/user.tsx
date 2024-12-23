import { useState, useEffect } from 'react';
import { GetallUsers } from 'src/api/auth/authService';

import { Alluser } from 'src/api/auth/authTypes'; // Adjust the import as needed

export function useFetchUsers() {
  const [users, setUsers] = useState<Alluser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        const fetchedUsers = await GetallUsers(); // Call the API to fetch users
        setUsers(fetchedUsers); // Update state with the fetched users
        console.log(fetchedUsers); // Optionally log the fetched users
      } catch (error) {
        console.error('Error fetching users:', error.message);
      } finally {
        setLoading(false); // Set loading state to false after fetching
      }
    }

    fetchUsers(); // Call the fetch function when component mounts
  }, []);

  return { users, loading }; // Return users and loading state
}
