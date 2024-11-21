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
import { Building2, Edit, Trash2, Users } from "lucide-react";
import { useCompanyStore } from "../stores/companyStore";
import { CompanyDialog } from "../components/company/CompanyDialog";
import { useNavigate } from "react-router-dom";

export default function CompanyScreen() {
  const { companies, fetchCompanies, removeCompany } = useCompanyStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editCompany, setEditCompany] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCompanies();
    return () => {
      const { cleanup } = useCompanyStore.getState();
      cleanup();
    };
  }, [fetchCompanies]);

  const handleAddClick = () => {
    setEditCompany(null);
    setDialogOpen(true);
  };

  const handleEditClick = (company) => {
    setEditCompany(company);
    setDialogOpen(true);
  };

  const handleDeleteClick = async (companyId) => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      await removeCompany(companyId);
    }
  };

  const handleViewTeam = (companyId) => {
    navigate(`/company/${companyId}/team`);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditCompany(null);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          Companies
        </Typography>
        <Button
          variant="contained"
          startIcon={<Building2 size={20} />}
          onClick={handleAddClick}
          sx={{ px: 3 }}
        >
          Add Company
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ flex: 1 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Legal Name</TableCell>
              <TableCell>DBA Name</TableCell>
              <TableCell>UEI</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {companies.map((company) => (
              <TableRow key={company.id}>
                <TableCell>{company.legalBusinessName}</TableCell>
                <TableCell>{company.dbaName || "-"}</TableCell>
                <TableCell>{company.uei}</TableCell>
                <TableCell>{company.companyEmail || "-"}</TableCell>
                <TableCell>
                  <Chip
                    label={company.status}
                    color={company.status === "ACTIVE" ? "success" : "default"}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton 
                    onClick={() => handleViewTeam(company.id)} 
                    size="small"
                    color="primary"
                    title="View Team"
                  >
                    <Users size={18} />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleEditClick(company)} 
                    size="small"
                    title="Edit Company"
                  >
                    <Edit size={18} />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteClick(company.id)}
                    size="small"
                    color="error"
                    title="Delete Company"
                  >
                    <Trash2 size={18} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <CompanyDialog open={dialogOpen} onClose={handleCloseDialog} editCompany={editCompany} />
    </Box>
  );
}