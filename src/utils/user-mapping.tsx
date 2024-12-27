import { Alluser } from "src/api/auth/authTypes";
import { UserProps } from "src/sections/user/user-table-row";

export function mapAllUserToUserProps(allUser: Alluser[]): UserProps[] {
  return allUser.map((user) => ({
    id: String(user.id), // Convert `id` to a string
    name: user.name || '', // Provide a default value for `name`
    username: user.username || user.email || '', // If `username` is not available, fallback to `email`
    email: user.email || '', // Ensure `email` is included and has a value
    role: user.role, // Assuming `role` exists in `Alluser`
    status: user.status || 'Active', // Provide a default if `status` is missing
    avatarUrl: user.avatarUrl || '', // Provide a default if `avatarUrl` is missing
    isVerified: user.isVerified || false, // Provide a default if `isVerified` is missing
  }));
}