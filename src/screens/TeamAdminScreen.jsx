import React, { useEffect, useState } from "react";
import {
	Box,
	Button,
	CircularProgress,
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
	const [contacts, setContacts] = useState([]);
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
			fetchContacts();
		}
	}, [selectedCompany]);

	const fetchCompanies = async () => {
		setLoading(true);
		try {
			const response = await client.models.Company.list();
			setCompanies(response.data);
			setLoading(false);
		} catch (err) {
			setError("Failed to fetch companies");
			setLoading(false);
		}
	};

	const fetchTeams = async () => {
		setLoading(true);
		try {
			const response = await client.models.Team.list({
				filter: { companyId: { eq: selectedCompany } },
			});
			setTeams(response.data);
			setLoading(false);
		} catch (err) {
			setError("Failed to fetch teams");
			setLoading(false);
		}
	};

	const fetchContacts = async () => {
		setLoading(true);
		try {
			const response = await client.models.Contact.list();
			setContacts(response.data);
			setLoading(false);
		} catch (err) {
			setError("Failed to fetch contacts");
			setLoading(false);
		}
	};

	const getContactDetails = (contactId) => {
		return contacts.find((contact) => contact.id === contactId) || {};
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
		try {
			await client.models.Team.delete({ id: team.id });
			setTeams((prevTeams) => prevTeams.filter((t) => t.id !== team.id));
		} catch (err) {
			setError("Failed to delete team member");
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
					onChange={handleCompanyChange}
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
								<TableCell>Name</TableCell>
								<TableCell>Role</TableCell>
								<TableCell>Department</TableCell>
								<TableCell>Email</TableCell>
								<TableCell>Phone</TableCell>
								<TableCell align='right'>Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{teams.map((team) => {
								const contact = getContactDetails(team.contactId);
								return (
									<TableRow key={team.id} hover>
										<TableCell>
											{contact.firstName} {contact.lastName}
										</TableCell>
										<TableCell>{team.role}</TableCell>
										<TableCell>{contact.department || "-"}</TableCell>
										<TableCell>
											{contact.contactEmail ? (
												<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
													<Mail size={16} />
													{contact.contactEmail}
												</Box>
											) : (
												"-"
											)}
										</TableCell>
										<TableCell>{contact.contactMobilePhone || "-"}</TableCell>
										<TableCell align='right'>
											<IconButton onClick={() => handleEditClick(team)}>
												<Edit />
											</IconButton>
											<IconButton onClick={() => handleDeleteClick(team)}>
												<Trash2 />
											</IconButton>
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</TableContainer>
			)}

			<Button variant='contained' color='primary' startIcon={<UserPlus />} onClick={handleAddClick} sx={{ mt: 3 }}>
				Add Team Member
			</Button>

			<TeamAdminDialog
				open={dialogOpen}
				onClose={() => setDialogOpen(false)}
				companyId={selectedCompany}
				team={editTeam}
			/>
		</Box>
	);
}
