import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Chip,
} from "@mui/material";
import { Edit, Trash2, UserPlus } from "lucide-react";
import { useUserStore } from "../stores/userStore";
import { UserDialog } from "../components/UserDialog";

export default function UserScreen() {
  const { users, fetchUsers, removeUser } = useUserStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);

  useEffect(() => {
    fetchUsers();
    return () => {
      const { cleanup } = useUserStore.getState();
      cleanup();
    };
  }, [fetchUsers]);

  const handleAddClick = () => {
    setEditUser(null);
    setDialogOpen(true);
  };

  const handleEditClick = (user) => {
    setEditUser(user);
    setDialogOpen(true);
  };

  const handleDeleteClick = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await removeUser(userId);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditUser(null);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          Users
        </Typography>
        <Button
          variant="contained"
          startIcon={<UserPlus size={20} />}
          onClick={handleAddClick}
          sx={{ px: 3 }}
        >
          Add User
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ flex: 1 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Last Login</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone || "-"}</TableCell>
                <TableCell>
                  <Chip
                    label={user.status}
                    color={user.status === "ACTIVE" ? "success" : "default"}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "-"}
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEditClick(user)} size="small">
                    <Edit size={18} />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteClick(user.id)}
                    size="small"
                    color="error"
                  >
                    <Trash2 size={18} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <UserDialog open={dialogOpen} onClose={handleCloseDialog} editUser={editUser} />
    </Box>
  );
}