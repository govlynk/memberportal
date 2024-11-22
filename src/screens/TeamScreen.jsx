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
import { useNavigate } from "react-router-dom";
import { useTeamStore } from "../stores/teamStore";
import { useUserCompanyStore } from "../stores/userCompanyStore";
import { TeamDialog } from "../components/team/TeamDialog";

export default function TeamScreen() {
	const navigate = useNavigate();
	const { teams, fetchTeams, removeTeam, loading, error } = useTeamStore();
	const { getActiveCompany } = useUserCompanyStore();
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editTeam, setEditTeam] = useState(null);

	const activeCompany = getActiveCompany();

	useEffect(() => {
		if (activeCompany?.id) {
			fetchTeams(activeCompany.id);
		}
		return () => {
			const { cleanup } = useTeamStore.getState();
			cleanup();
		};
	}, [activeCompany?.id, fetchTeams]);

	const handleAddClick = () => {
		setEditTeam(null);
		setDialogOpen(true);
	};

	const handleEditClick = (team) => {
		setEditTeam(team);
		setDialogOpen(true);
	};

	const handleDeleteClick = async (teamId) => {
		if (window.confirm("Are you sure you want to remove this team?")) {
			await removeTeam(teamId);
		}
	};

	const handleCloseDialog = () => {
		setDialogOpen(false);
		setEditTeam(null);
	};

	const handleBack = () => {
		navigate("/company");
	};

	if (!activeCompany) {
		return (
			<Box sx={{ p: 3 }}>
				<Typography color='error'>Please select a company first</Typography>
			</Box>
		);
	}

	if (loading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
				<CircularProgress />
			</Box>
		);
	}

	if (error) {
		return <Box sx={{ p: 3, color: "error.main" }}>Error: {error}</Box>;
	}

	return (
		<Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
			<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
				<Box>
					<Button startIcon={<ArrowLeft />} onClick={handleBack} sx={{ mb: 2 }}>
						Back to Companies
					</Button>
					<Typography variant='h4' sx={{ fontWeight: "bold" }}>
						Teams
					</Typography>
					<Typography variant='subtitle1' color='text.secondary'>
						{activeCompany.legalBusinessName}
					</Typography>
				</Box>
				<Button variant='contained' startIcon={<UserPlus size={20} />} onClick={handleAddClick} sx={{ px: 3 }}>
					Add Team
				</Button>
			</Box>

			<TableContainer component={Paper} sx={{ flex: 1 }}>
				<Table stickyHeader>
					<TableHead>
						<TableRow>
							<TableCell>Name</TableCell>
							<TableCell>Description</TableCell>
							<TableCell>Members</TableCell>
							<TableCell align='right'>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{teams.map((team) => (
							<TableRow key={team.id}>
								<TableCell>{team.name}</TableCell>
								<TableCell>{team.description || "-"}</TableCell>
								<TableCell>{team.members?.length || 0}</TableCell>
								<TableCell align='right'>
									<IconButton onClick={() => handleEditClick(team)} size='small' title='Edit Team'>
										<Edit size={18} />
									</IconButton>
									<IconButton
										onClick={() => handleDeleteClick(team.id)}
										size='small'
										color='error'
										title='Remove Team'
									>
										<Trash2 size={18} />
									</IconButton>
								</TableCell>
							</TableRow>
						))}
						{teams.length === 0 && (
							<TableRow>
								<TableCell colSpan={4} align='center'>
									No teams found
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>

			<TeamDialog open={dialogOpen} onClose={handleCloseDialog} editTeam={editTeam} companyId={activeCompany.id} />
		</Box>
	);
}
