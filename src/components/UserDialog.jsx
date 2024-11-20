import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useUserStore } from "../stores/userStore";
import { useAuthStore } from "../stores/authStore";

const initialFormState = {
  cognitoId: "",
  email: "",
  name: "",
  phone: "",
  status: "ACTIVE",
};

export function UserDialog({ open, onClose, editUser = null }) {
  const currentUser = useAuthStore((state) => state.user);
  const { addUser, updateUser } = useUserStore();
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (!open) {
      setFormData(initialFormState);
      return;
    }

    if (editUser) {
      setFormData(editUser);
    } else {
      setFormData({
        ...initialFormState,
        cognitoId: currentUser?.sub || "",
        email: currentUser?.email || "",
        name: currentUser?.name || currentUser?.username || "",
      });
    }
  }, [open, editUser, currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.email || !formData.name) {
      return;
    }

    try {
      if (editUser) {
        await updateUser(editUser.id, formData);
      } else {
        await addUser(formData);
      }
      onClose();
    } catch (error) {
      console.error("Error saving user:", error);
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
      <DialogTitle>{editUser ? "Edit User" : "Add New User"}</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
          <FormControl fullWidth>
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
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {editUser ? "Save Changes" : "Add User"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}