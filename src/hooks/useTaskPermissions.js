import { useAuth } from "../contexts/AuthContext";

export const useTaskPermissions = ({ task, project }) => {
  const { user } = useAuth();

  const isAdmin = user?.role === "admin";
  const isOwner = project?.owners?.includes(user?.username);
  const isMember = project?.members?.includes(user?.username);
  const isAssignee = task?.assignee === user?.username;

  const canCreateTask = isAdmin || isOwner || isMember; // ✅ KEEP THIS if you want only admin/owners to create
  // const canCreateTask = isAdmin || isOwner || isMember; // ✅ USE THIS if team members can create too
  const canEditTask = isAdmin || isOwner || isAssignee;
  const canDeleteTask = isAdmin || isOwner;

  return {
    isAdmin,
    isOwner,
    isMember,
    isAssignee,
    canCreateTask,
    canEditTask,
    canDeleteTask,
  };
};
