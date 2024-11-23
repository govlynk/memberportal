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
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Alert,
	CircularProgress,
} from "@mui/material";
import { UserPlus, Edit, Trash2, Mail, Phone } from "lucide-react";
import { generateClient } from "aws-amplify/data";
import { TeamAdminDialog } from "../components/team/TeamAdminDialog";

const client = generateClient({
	authMode: "userPool",
});

export default function TeamAdminScreen() {
	const [companies, setCompanies] = useState([]);
	const [selectedCompany, setSelectedCompany] = useState("");
	const [teams, setTeams] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editTeam, setEditTeam] = useState(null);

	useEffect(() => {
		fetchCompanies();
	}, []);

	useEffect(() => {
		if (selectedCompany) {
			fetchTeams();
		}
	}, [selectedCompany]);

	const fetchCompanies = async () => {
		setLoading(true);
		try {
			const response = await client.models.Company.list();
			setCompanies(response.data);
		} catch (err) {
			console.error("Error fetching companies:", err);
			setError("Failed to load companies");
		} finally {
			setLoading(false);
		}
	};

	const fetchTeams = async () => {
		if (!selectedCompany) return;

		setLoading(true);
		try {
			const teamsResponse = await client.models.Team.list({
				filter: { companyId: { eq: selectedCompany } },
			});

			const teamsWithContacts = await Promise.all(
				teamsResponse.data.map(async (team) => {
					const contact = await client.models.Contact.get({ id: team.contactId });
					return { ...team, contact };
				})
			);

			setTeams(teamsWithContacts);
			setError(null);
		} catch (err) {
			console.error("Error fetching teams:", err);
			setError("Failed to load teams");
		} finally {
			setLoading(false);
		}
	};

	const handleCompanyChange = (event) => {
		setSelectedCompany(event.target.value);
		setTeams([]);
	};

	const handleAddClick = () => {
		if (!selectedCompany) {
			setError("Please select a company first");
			return;
		}
		setEditTeam(null);
		setDialogOpen(true);
	};

	const handleEditClick = (team) => {
		setEditTeam(team);
		setDialogOpen(true);
	};

	const handleDeleteClick = async (team) => {
		if (!window.confirm("Are you sure you want to delete this team member?")) {
			return;
		}

		setLoading(true);
		try {
			// Delete the contact first
			await client.models.Contact.delete({ id: team.contactId });

			// Then delete the team
			await client.models.Team.delete({ id: team.id });

			// Refresh the teams list
			await fetchTeams();
		} catch (err) {
			console.error("Error deleting team member:", err);
			setError("Failed to delete team member");
		} finally {
			setLoading(false);
		}
	};

	const handleDialogClose = () => {
		setDialogOpen(false);
		setEditTeam(null);
		fetchTeams(); // Refresh teams list
	};

	return (
		<Box sx={{ p: 3 }}>
			<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
				<Typography variant='h4' sx={{ fontWeight: "bold" }}>
					Team Management
				</Typography>
				<Button
					variant='contained'
					startIcon={<UserPlus size={20} />}
					onClick={handleAddClick}
					disabled={!selectedCompany}
				>
					Add Team Member
				</Button>
			</Box>

			<FormControl fullWidth sx={{ mb: 3 }}>
				<InputLabel>Select Company</InputLabel>
				<Select value={selectedCompany} onChange={handleCompanyChange} label='Select Company'>
					{companies.map((company) => (
						<MenuItem key={company.id} value={company.id}>
							{company.legalBusinessName}
						</MenuItem>
					))}
				</Select>
			</FormControl>

			{error && (
				<Alert severity='error' sx={{ mb: 3 }}>
					{error}
				</Alert>
			)}

			{loading ? (
				<Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
					<CircularProgress />
				</Box>
			) : (
				<TableContainer component={Paper}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Name</TableCell>
								<TableCell>Role</TableCell>
								<TableCell>Department</TableCell>
								<TableCell>Email</TableCell>
								<TableCell>Phone</TableCell>
								<TableCell align='right'>Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{teams.map((team) => (
								<TableRow key={team.id} hover>
									<TableCell>
										{team.contact?.firstName} {team.contact?.lastName}
									</TableCell>
									<TableCell>{team.role}</TableCell>
									<TableCell>{team.contact?.department || "-"}</TableCell>
									<TableCell>
										{team.contact?.contactEmail ? (
											<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
												<Mail size={16} />
												{team.contact.contactEmail}
											</Box>
										) : (
											"-"
										)}
									</TableCell>
									<TableCell>
										{team.contact?.contactBusinessPhone ? (
											<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
												<Phone size={16} />
												{team.contact.contactBusinessPhone}
											</Box>
										) : (
											"-"
										)}
									</TableCell>
									<TableCell align='right'>
										<IconButton onClick={() => handleEditClick(team)} size='small' title='Edit Team Member'>
											<Edit size={18} />
										</IconButton>
										<IconButton
											onClick={() => handleDeleteClick(team)}
											size='small'
											color='error'
											title='Delete Team Member'
										>
											<Trash2 size={18} />
										</IconButton>
									</TableCell>
								</TableRow>
							))}
							{teams.length === 0 && selectedCompany && (
								<TableRow>
									<TableCell colSpan={6} align='center'>
										No team members found for this company
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</TableContainer>
			)}

			<TeamAdminDialog
				open={dialogOpen}
				onClose={handleDialogClose}
				editTeam={editTeam}
				companyId={selectedCompany}
			/>
		</Box>
	);
}
