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
  CircularProgress,
} from "@mui/material";
import { Edit, Trash2, UserPlus } from "lucide-react";
import { UserCompanyRoleDialog } from "../components/userCompanyRole/UserCompanyRoleDialog";
import { useUserCompanyRoleStore } from "../stores/userCompanyRoleStore";

export default function UserCompanyRoleScreen() {
  const { 
    userCompanyRoles, 
    fetchUserCompanyRoles, 
    removeUserCompanyRole,
    loading, 
    error 
  } = useUserCompanyRoleStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editRole, setEditRole] = useState(null);

  useEffect(() => {
    console.log('UserCompanyRoleScreen mounted');
    fetchUserCompanyRoles();
    return () => {
      console.log('UserCompanyRoleScreen unmounting');
      const { cleanup } = useUserCompanyRoleStore.getState();
      cleanup();
    };
  }, [fetchUserCompanyRoles]);

  // Debug: Log whenever userCompanyRoles changes
  useEffect(() => {
    console.log('Current userCompanyRoles:', userCompanyRoles);
  }, [userCompanyRoles]);

  const handleAddClick = () => {
    setEditRole(null);
    setDialogOpen(true);
  };

  const handleEditClick = (role) => {
    console.log('Editing role:', role);
    setEditRole(role);
    setDialogOpen(true);
  };

  const handleDeleteClick = async (roleId) => {
    if (window.confirm("Are you sure you want to delete this role assignment?")) {
      try {
        await removeUserCompanyRole(roleId);
      } catch (error) {
        console.error("Error deleting role:", error);
      }
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditRole(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, color: 'error.main' }}>
        Error: {error}
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          User Company Roles
        </Typography>
        <Button
          variant="contained"
          startIcon={<UserPlus size={20} />}
          onClick={handleAddClick}
        >
          Add Role Assignment
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userCompanyRoles.map((role) => {
              // Debug: Log each role's data as it's being rendered
              console.log('Rendering role:', {
                id: role.id,
                user: role.user,
                company: role.company,
                roleId: role.roleId
              });

              return (
                <TableRow key={role.id} hover>
                  <TableCell>{role.user?.name || "Unknown User"}</TableCell>
                  <TableCell>{role.user?.email || "No Email"}</TableCell>
                  <TableCell>{role.company?.legalBusinessName || "Unknown Company"}</TableCell>
                  <TableCell>
                    <Chip 
                      label={role.roleId} 
                      color="primary" 
                      variant="outlined" 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={role.status}
                      color={role.status === "ACTIVE" ? "success" : "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton 
                      onClick={() => handleEditClick(role)} 
                      size="small"
                      title="Edit Role"
                    >
                      <Edit size={18} />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteClick(role.id)}
                      size="small"
                      color="error"
                      title="Delete Role"
                    >
                      <Trash2 size={18} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
            {userCompanyRoles.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No role assignments found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <UserCompanyRoleDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        editRole={editRole}
      />
    </Box>
  );
}