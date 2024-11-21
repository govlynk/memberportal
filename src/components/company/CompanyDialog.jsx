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
import { useCompanyStore } from "../../stores/companyStore";

const initialFormState = {
  legalBusinessName: "",
  dbaName: "",
  uei: "",
  cageCode: "",
  ein: "",
  companyEmail: "",
  companyPhoneNumber: "",
  companyWebsite: "",
  status: "ACTIVE",
};

export function CompanyDialog({ open, onClose, editCompany = null }) {
  const { addCompany, updateCompany } = useCompanyStore();
  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open) {
      setFormData(initialFormState);
      setError(null);
      return;
    }

    if (editCompany) {
      setFormData(editCompany);
    }
  }, [open, editCompany]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const validateForm = () => {
    if (!formData.legalBusinessName.trim()) {
      setError("Legal business name is required");
      return false;
    }
    if (!formData.uei.trim()) {
      setError("UEI is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (editCompany) {
        await updateCompany(editCompany.id, formData);
      } else {
        await addCompany(formData);
      }
      onClose();
    } catch (err) {
      console.error("Error saving company:", err);
      setError(err.message || "Failed to save company");
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
      <DialogTitle>{editCompany ? "Edit Company" : "Add New Company"}</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          {error && (
            <Box sx={{ color: "error.main", mb: 2 }}>
              {error}
            </Box>
          )}
          <TextField
            fullWidth
            label="Legal Business Name"
            name="legalBusinessName"
            value={formData.legalBusinessName}
            onChange={handleChange}
            required
            error={error === "Legal business name is required"}
          />
          <TextField
            fullWidth
            label="DBA Name"
            name="dbaName"
            value={formData.dbaName}
            onChange={handleChange}
          />
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              fullWidth
              label="UEI"
              name="uei"
              value={formData.uei}
              onChange={handleChange}
              required
              error={error === "UEI is required"}
            />
            <TextField
              fullWidth
              label="CAGE Code"
              name="cageCode"
              value={formData.cageCode}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="EIN"
              name="ein"
              value={formData.ein}
              onChange={handleChange}
            />
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              fullWidth
              label="Company Email"
              name="companyEmail"
              type="email"
              value={formData.companyEmail}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Phone Number"
              name="companyPhoneNumber"
              value={formData.companyPhoneNumber}
              onChange={handleChange}
            />
          </Box>
          <TextField
            fullWidth
            label="Website"
            name="companyWebsite"
            value={formData.companyWebsite}
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
              <MenuItem value="PENDING">Pending</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {editCompany ? "Save Changes" : "Add Company"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}