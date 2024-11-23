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
import { ContactDialog } from "../components/contacts/ContactDialog";

const client = generateClient({
	authMode: "userPool",
});

export default function ContactsScreen() {
	const [companies, setCompanies] = useState([]);
	const [selectedCompany, setSelectedCompany] = useState("");
	const [contacts, setContacts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editContact, setEditContact] = useState(null);

	// Fetch companies on component mount
	useEffect(() => {
		fetchCompanies();
	}, []);

	// Fetch contacts when company is selected
	useEffect(() => {
		if (selectedCompany) {
			fetchContacts();
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

	const fetchContacts = async () => {
		if (!selectedCompany) return;

		setLoading(true);
		try {
			// First get all teams for the selected company
			const teamsResponse = await client.models.Team.list({
				filter: { companyId: { eq: selectedCompany } },
			});

			// Then get all contacts for these teams
			const contactIds = teamsResponse.data.map((team) => team.contactId);
			const contactsData = await Promise.all(contactIds.map((id) => client.models.Contact.get({ id })));

			// Combine team and contact data
			const contactsWithRoles = contactsData.map((contact) => {
				const team = teamsResponse.data.find((t) => t.contactId === contact.id);
				return {
					...contact,
					role: team?.role || "Unknown",
					teamId: team?.id,
				};
			});

			setContacts(contactsWithRoles);
			setError(null);
		} catch (err) {
			console.error("Error fetching contacts:", err);
			setError("Failed to load contacts");
		} finally {
			setLoading(false);
		}
	};

	const handleCompanyChange = (event) => {
		setSelectedCompany(event.target.value);
		setContacts([]);
	};

	const handleAddClick = () => {
		if (!selectedCompany) {
			setError("Please select a company first");
			return;
		}
		setEditContact(null);
		setDialogOpen(true);
	};

	const handleEditClick = (contact) => {
		setEditContact(contact);
		setDialogOpen(true);
	};

	const handleDeleteClick = async (contact) => {
		if (!window.confirm("Are you sure you want to delete this contact?")) {
			return;
		}

		setLoading(true);
		try {
			// First delete the team association
			if (contact.teamId) {
				await client.models.Team.delete({ id: contact.teamId });
			}

			// Then delete the contact
			await client.models.Contact.delete({ id: contact.id });

			// Refresh the contacts list
			await fetchContacts();
		} catch (err) {
			console.error("Error deleting contact:", err);
			setError("Failed to delete contact");
		} finally {
			setLoading(false);
		}
	};

	const handleDialogClose = () => {
		setDialogOpen(false);
		setEditContact(null);
		fetchContacts(); // Refresh contacts list
	};

	return (
		<Box sx={{ p: 3 }}>
			<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
				<Typography variant='h4' sx={{ fontWeight: "bold" }}>
					Contact Management
				</Typography>
				<Button
					variant='contained'
					startIcon={<UserPlus size={20} />}
					onClick={handleAddClick}
					disabled={!selectedCompany}
				>
					Add Contact
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
							{contacts.map((contact) => (
								<TableRow key={contact.id} hover>
									<TableCell>
										{contact.firstName} {contact.lastName}
									</TableCell>
									<TableCell>{contact.role}</TableCell>
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
									<TableCell>
										{contact.contactBusinessPhone ? (
											<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
												<Phone size={16} />
												{contact.contactBusinessPhone}
											</Box>
										) : (
											"-"
										)}
									</TableCell>
									<TableCell align='right'>
										<IconButton onClick={() => handleEditClick(contact)} size='small' title='Edit Contact'>
											<Edit size={18} />
										</IconButton>
										<IconButton
											onClick={() => handleDeleteClick(contact)}
											size='small'
											color='error'
											title='Delete Contact'
										>
											<Trash2 size={18} />
										</IconButton>
									</TableCell>
								</TableRow>
							))}
							{contacts.length === 0 && selectedCompany && (
								<TableRow>
									<TableCell colSpan={6} align='center'>
										No contacts found for this company
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</TableContainer>
			)}

			<ContactDialog
				open={dialogOpen}
				onClose={handleDialogClose}
				editContact={editContact}
				companyId={selectedCompany}
			/>
		</Box>
	);
}
