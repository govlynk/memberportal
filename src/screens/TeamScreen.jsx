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
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Alert,
} from "@mui/material";
import { Edit, Trash2, UserPlus } from "lucide-react";
import { generateClient } from "aws-amplify/data";
import { useAuthStore } from "../stores/authStore";

const client = generateClient({
	authMode: "userPool",
});

export default function TeamScreen() {
	const { user } = useAuthStore();
	const [teams, setTeams] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [selectedCompany, setSelectedCompany] = useState("");
	const [companies, setCompanies] = useState([]);

	useEffect(() => {
		// Fetch companies for the user
		const fetchCompanies = async () => {
			try {
				const response = await client.models.Company.list();
				setCompanies(response.data);
			} catch (err) {
				console.error("Error fetching companies:", err);
				setError("Failed to fetch companies");
			}
		};
		fetchCompanies();
	}, []);

	useEffect(() => {
		if (selectedCompany) {
			setLoading(true);
			fetchTeams(selectedCompany)
				.then((data) => {
					setTeams(data);
					setLoading(false);
				})
				.catch((err) => {
					console.error("Error fetching teams:", err);
					setError("Failed to fetch teams");
					setLoading(false);
				});
		}
	}, [selectedCompany]);

	const fetchTeams = async (companyId) => {
		try {
			const response = await client.models.Team.list({
				filter: { companyId: { eq: companyId } },
				include: {
					members: {
						include: {
							contact: true,
						},
					},
				},
			});
			return response.data;
		} catch (err) {
			console.error("Error fetching teams:", err);
			throw err;
		}
	};

	const handleAddTeam = async () => {
		const teamData = {
			name: "New Team",
			description: "Description of the new team",
			companyId: selectedCompany,
		};
		try {
			const newTeam = await addTeam(teamData);
			setTeams([...teams, newTeam]);
		} catch (err) {
			console.error("Error adding team:", err);
			setError("Failed to add team");
		}
	};

	const addTeam = async (teamData) => {
		try {
			const response = await client.models.Team.create(teamData);
			return response;
		} catch (err) {
			console.error("Error adding team:", err);
			throw err;
		}
	};

	const handleRemoveTeamMember = async (teamMemberId) => {
		try {
			await removeTeamMember(teamMemberId);
			setTeams((prevTeams) =>
				prevTeams.map((team) => ({
					...team,
					members: team.members.filter((member) => member.id !== teamMemberId),
				}))
			);
		} catch (err) {
			console.error("Error removing team member:", err);
			setError("Failed to remove team member");
		}
	};

	const removeTeamMember = async (teamMemberId) => {
		try {
			await client.models.TeamMember.delete({ id: teamMemberId });
		} catch (err) {
			console.error("Error removing team member:", err);
			throw err;
		}
	};

	return (
		<Box>
			{error && (
				<Alert severity='error' sx={{ mb: 3 }}>
					{error}
				</Alert>
			)}

			<FormControl fullWidth sx={{ mb: 3 }}>
				<InputLabel id='company-select-label'>Select Company</InputLabel>
				<Select
					labelId='company-select-label'
					value={selectedCompany}
					label='Select Company'
					onChange={(e) => setSelectedCompany(e.target.value)}
				>
					{companies.map((company) => (
						<MenuItem key={company.id} value={company.id}>
							{company.legalBusinessName}
						</MenuItem>
					))}
				</Select>
			</FormControl>

			{loading ? (
				<Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
					<CircularProgress />
				</Box>
			) : (
				<TableContainer component={Paper}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Team Name</TableCell>
								<TableCell>Description</TableCell>
								<TableCell>Members</TableCell>
								<TableCell align='right'>Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{teams.map((team) => (
								<TableRow key={team.id} hover>
									<TableCell>{team.name}</TableCell>
									<TableCell>{team.description}</TableCell>
									<TableCell>
										{team.members.map((member) => (
											<Chip
												key={member.id}
												label={`${member.contact.firstName} ${member.contact.lastName}`}
												onDelete={() => handleRemoveTeamMember(member.id)}
											/>
										))}
									</TableCell>
									<TableCell align='right'>
										<IconButton onClick={() => handleAddTeam()} size='small' color='primary'>
											<UserPlus size={16} />
										</IconButton>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			)}

			<Button variant='contained' color='primary' onClick={handleAddTeam} sx={{ mt: 3 }}>
				Add Team
			</Button>
		</Box>
	);
}
