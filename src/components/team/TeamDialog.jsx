import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useTeamStore } from "../../stores/teamStore";

const initialFormState = {
  role: "",
  contactId: "",
  firstName: "",
  lastName: "",
  title: "",
  department: "",
  contactEmail: "",
  contactMobilePhone: "",
  contactBusinessPhone: "",
};

export function TeamDialog({ open, onClose, editTeam = null, companyId }) {
  const { addTeam, updateTeam } = useTeamStore();
  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open) {
      setFormData(initialFormState);
      setError(null);
      return;
    }

    if (editTeam) {
      setFormData({
        ...editTeam,
        ...editTeam.contact,
      });
    }
  }, [open, editTeam]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setError("First name is required");
      return false;
    }
    if (!formData.lastName.trim()) {
      setError("Last name is required");
      return false;
    }
    if (!formData.role.trim()) {
      setError("Role is required");
      return false;
    }
    if (!companyId) {
      setError("No company selected");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const contactData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        title: formData.title,
        department: formData.department,
        contactEmail: formData.contactEmail,
        contactMobilePhone: formData.contactMobilePhone,
        contactBusinessPhone: formData.contactBusinessPhone,
      };

      if (editTeam) {
        await updateTeam(editTeam.id, {
          role: formData.role,
          contact: contactData,
        });
      } else {
        await addTeam({
          companyId,
          role: formData.role,
          contact: contactData,
        });
      }
      onClose();
    } catch (err) {
      console.error("Error saving team member:", err);
      setError(err.message || "Failed to save team member");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "background.paper",
          color: "text.primary",
        },
      }}
    >
      <DialogTitle>{editTeam ? "Edit Team Member" : "Add New Team Member"}</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          {error && (
            <Box sx={{ color: "error.main", mb: 2 }}>
              {error}
            </Box>
          )}
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              error={error === "First name is required"}
            />
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              error={error === "Last name is required"}
            />
          </Box>
          <FormControl fullWidth required error={error === "Role is required"}>
            <InputLabel>Role</InputLabel>
            <Select name='role' value={formData.role} onChange={handleChange} label='Role'>
              <MenuItem value='EXECUTIVE'>Executive</MenuItem>
              <MenuItem value='SALES'>Sales</MenuItem>
              <MenuItem value='CUSTOMER SERVICE'>Customer Service</MenuItem>
              <MenuItem value='MARKETING MANAGER'>Marketing</MenuItem>
              <MenuItem value='FINANCE'>Finance</MenuItem>
              <MenuItem value='LEGAL'>Legal</MenuItem>
              <MenuItem value='CONTRACTS'>Contracts</MenuItem>
              <MenuItem value='ENGINEERING'>Engineering</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Department"
            name="department"
            value={formData.department}
            onChange={handleChange}
          />
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              fullWidth
              label="Email"
              name="contactEmail"
              type="email"
              value={formData.contactEmail}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Mobile Phone"
              name="contactMobilePhone"
              value={formData.contactMobilePhone}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Business Phone"
              name="contactBusinessPhone"
              value={formData.contactBusinessPhone}
              onChange={handleChange}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {editTeam ? "Save Changes" : "Add Team Member"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}