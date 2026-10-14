export type UserRole = "user" | "admin" | "superadmin";

export interface UserListItem {
  id: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  phone: string | null;
  role: UserRole;
  createdAt: string;
}

export interface RoleChangeLog {
  id: string;
  userId: string;
  userDisplayName: string | null;
  userEmail: string | null;
  changedBy: string | null;
  changedByDisplayName: string | null;
  changedByEmail: string | null;
  oldRole: UserRole;
  newRole: UserRole;
  createdAt: string;
}

export type LogDaysFilter = 7 | 30 | null;

export interface RoleChangeLogsResult {
  logs: RoleChangeLog[];
  total: number;
}