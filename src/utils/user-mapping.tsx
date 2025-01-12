import type { Alluser } from "src/api/auth/authTypes";
import type { UserProps } from "src/sections/user/user-table-row";

export function mapAllUserToUserProps(allUser: Alluser[]): UserProps[] {
  return allUser.map((user) => {
    const image = user.files && user.files.length > 0 ? user.files[0].fileUrl : '/path/to/default-image.jpg';

    const status = user.enabled ? 'Inactive' : 'Active';
    return {
      id: String(user.id),
      name: user.name || '',
      username: user.username || user.email || '',
      email: user.email || '',
      role: user.role,
      status, 
      image,
      avatarUrl: user.avatarUrl || user.profileImage || null,
      isVerified: user.isVerified || false,
      files: user.files || [],
    };
  });
}

