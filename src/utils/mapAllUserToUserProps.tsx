import type { Alluser } from "src/api/auth/authTypes";
import type { UserProps } from "src/sections/user/user-table-row";

function mapAllUserToUserProps(allUser: Alluser[]): UserProps[] {
  return allUser.map((user) => ({
    id: String(user.id), // Assuming `id` exists in `Alluser` and converting it to string as UserProps expects a string
    name: user.name || '',
    username: user.username || user.email || '', // Adding `username` property
    email: user.email || '', // Adding `email` property
    role: user.role,
    status: user.status || 'Active', // Provide a default if `status` is missing
    image: user.files && user.files.length > 0 ? user.files[0].fileUrl : '/path/to/default-image.jpg', // Adding `image` property
    avatarUrl: user.avatarUrl || '', // Fallback if avatarUrl is missing
    isVerified: user.isVerified || false, // Providing a default if `isVerified` is missing
    files: user.files || [], // Adding `files` property
  }));
}
