import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";
import { useUserCompanyRoleStore } from "../../stores/userCompanyRoleStore";
import { generateClient } from "aws-amplify/data";

const client = generateClient({
  authMode: 'userPool'
});

const initialFormState = {
  userId: "",
  companyId: "",
  roleId: "MEMBER",
  status: "ACTIVE",
};

export function UserCompanyRoleDialog({ open, onClose, editRole = null }) {
  const { addUserCompanyRole, updateUserCompanyRole } = useUserCompanyRoleStore();
  const [formData, setFormData] = useState(initialFormState);
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchUsers();
      fetchCompanies();
    }
  }, [open]);

  useEffect(() => {
    if (editRole) {
      setFormData({
        userId: editRole.userId,
        companyId: editRole.companyId,
        roleId: editRole.roleId,
        status: editRole.status || "ACTIVE",
      });
    } else {
      setFormData(initialFormState);
    }
  }, [editRole]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const userData = await client.models.User.list();
      setUsers(userData.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const companyData = await client.models.Company.list();
      setCompanies(companyData.data);
    } catch (error) {
      console.error("Error fetching companies:", error);
      setError("Failed to load companies");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleSubmit = async () => {
    try {
      if (!formData.userId || !formData.companyId || !formData.roleId) {
        setError("Please fill in all required fields");
        return;
      }

      setLoading(true);
      if (editRole) {
        await updateUserCompanyRole(editRole.id, formData);
      } else {
        await addUserCompanyRole(formData);
      }
      
      onClose();
    } catch (error) {
      console.error("Error saving role:", error);
      setError(error.message || "Failed to save role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "background.paper",
          color: "text.primary",
        },
      }}
    >
      <DialogTitle>
        {editRole ? "Edit Role Assignment" : "Add New Role Assignment"}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <FormControl fullWidth required disabled={loading}>
            <InputLabel>User</InputLabel>
            <Select
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              label="User"
            >
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth required disabled={loading}>
            <InputLabel>Company</InputLabel>
            <Select
              name="companyId"
              value={formData.companyId}
              onChange={handleChange}
              label="Company"
            >
              {companies.map((company) => (
                <MenuItem key={company.id} value={company.id}>
                  {company.legalBusinessName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth required disabled={loading}>
            <InputLabel>Role</InputLabel>
            <Select
              name="roleId"
              value={formData.roleId}
              onChange={handleChange}
              label="Role"
            >
              <MenuItem value="ADMIN">Administrator</MenuItem>
              <MenuItem value="MANAGER">Manager</MenuItem>
              <MenuItem value="MEMBER">Team Member</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth disabled={loading}>
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              label="Status"
            >
              <MenuItem value="ACTIVE">Active</MenuItem>
              <MenuItem value="INACTIVE">Inactive</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={loading}
        >
          {editRole ? "Save Changes" : "Add Role"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}