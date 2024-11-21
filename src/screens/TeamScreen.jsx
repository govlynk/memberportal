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
  CircularProgress,
} from "@mui/material";
import { UserPlus, Edit, Trash2, ArrowLeft } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useTeamStore } from "../stores/teamStore";
import { useCompanyStore } from "../stores/companyStore";
import { TeamDialog } from "../components/team/TeamDialog";

export default function TeamScreen() {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const { teams, fetchTeams, removeTeam, loading, error } = useTeamStore();
  const { companies } = useCompanyStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTeam, setEditTeam] = useState(null);

  const company = companies.find(c => c.id === companyId);

  useEffect(() => {
    if (companyId) {
      fetchTeams(companyId);
    }
    return () => {
      const { cleanup } = useTeamStore.getState();
      cleanup();
    };
  }, [companyId, fetchTeams]);

  const handleAddClick = () => {
    setEditTeam(null);
    setDialogOpen(true);
  };

  const handleEditClick = (team) => {
    setEditTeam(team);
    setDialogOpen(true);
  };

  const handleDeleteClick = async (teamId) => {
    if (window.confirm("Are you sure you want to remove this team member?")) {
      await removeTeam(teamId);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditTeam(null);
  };

  const handleBack = () => {
    navigate('/company');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
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
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box>
          <Button
            startIcon={<ArrowLeft />}
            onClick={handleBack}
            sx={{ mb: 2 }}
          >
            Back to Companies
          </Button>
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            Team Members
          </Typography>
          {company && (
            <Typography variant="subtitle1" color="text.secondary">
              {company.legalBusinessName}
            </Typography>
          )}
        </Box>
        <Button
          variant="contained"
          startIcon={<UserPlus size={20} />}
          onClick={handleAddClick}
          sx={{ px: 3 }}
        >
          Add Team Member
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ flex: 1 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Department</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teams.map((team) => (
              <TableRow key={team.id}>
                <TableCell>
                  {team.contact?.firstName} {team.contact?.lastName}
                </TableCell>
                <TableCell>{team.role}</TableCell>
                <TableCell>{team.contact?.contactEmail || "-"}</TableCell>
                <TableCell>{team.contact?.contactBusinessPhone || "-"}</TableCell>
                <TableCell>{team.contact?.department || "-"}</TableCell>
                <TableCell align="right">
                  <IconButton 
                    onClick={() => handleEditClick(team)} 
                    size="small"
                    title="Edit Team Member"
                  >
                    <Edit size={18} />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteClick(team.id)}
                    size="small"
                    color="error"
                    title="Remove Team Member"
                  >
                    <Trash2 size={18} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TeamDialog 
        open={dialogOpen} 
        onClose={handleCloseDialog} 
        editTeam={editTeam}
        companyId={companyId} 
      />
    </Box>
  );
}