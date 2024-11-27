import React, { useState, useEffect } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Box,
	List,
	ListItem,
	ListItemText,
	ListItemSecondaryAction,
	IconButton,
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Chip,
	Typography,
} from "@mui/material";
import { UserPlus } from "lucide-react";
import { useTeamStore } from "../../stores/teamStore";
import { useContactStore } from "../../stores/contactStore";

const ROLES = ["Team Lead", "Developer", "Designer", "Product Manager", "QA Engineer", "Business Analyst", "Other"];

export function TeamMemberDialog({ open, onClose, team }) {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedRole, setSelectedRole] = useState("");
	const [selectedContacts, setSelectedContacts] = useState([]);
	const { contacts, fetchContacts } = useContactStore();
	const { updateTeam } = useTeamStore();

	useEffect(() => {
		if (open) {
			fetchContacts();
		}
	}, [open, fetchContacts]);

	const filteredContacts = contacts.filter((contact) => {
		const isAlreadyMember = team?.members?.some((member) => member.contactId === contact.id);
		const matchesSearch =
			contact.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			contact.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			contact.email?.toLowerCase().includes(searchTerm.toLowerCase());
		return !isAlreadyMember && matchesSearch;
	});

	const handleAddMembers = async () => {
		try {
			const newMembers = selectedContacts.map((contact) => ({
				contactId: contact.id,
				role: selectedRole,
				status: "ACTIVE",
				joinedAt: new Date().toISOString(),
			}));

			const updatedMembers = [...(team.members || []), ...newMembers];
			await updateTeam(team.id, { members: updatedMembers });
			onClose();
		} catch (error) {
			console.error("Failed to add team members:", error);
		}
	};

	const handleSelectContact = (contact) => {
		setSelectedContacts((prev) => [...prev, contact]);
	};

	const handleRemoveContact = (contactId) => {
		setSelectedContacts((prev) => prev.filter((c) => c.id !== contactId));
	};

	return (
		<Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
			<DialogTitle>Add Team Members</DialogTitle>
			<DialogContent>
				<Box sx={{ mb: 3 }}>
					<FormControl fullWidth sx={{ mb: 2 }}>
						<InputLabel>Role</InputLabel>
						<Select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} label='Role'>
							{ROLES.map((role) => (
								<MenuItem key={role} value={role}>
									{role}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<TextField
						fullWidth
						label='Search Contacts'
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						sx={{ mb: 2 }}
					/>

					{selectedContacts.length > 0 && (
						<Box sx={{ mb: 2 }}>
							<Typography variant='subtitle2' sx={{ mb: 1 }}>
								Selected Contacts:
							</Typography>
							<Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
								{selectedContacts.map((contact) => (
									<Chip
										key={contact.id}
										label={`${contact.firstName} ${contact.lastName}`}
										onDelete={() => handleRemoveContact(contact.id)}
									/>
								))}
							</Box>
						</Box>
					)}

					<List>
						{filteredContacts.map((contact) => (
							<ListItem key={contact.id}>
								<ListItemText primary={`${contact.firstName} ${contact.lastName}`} secondary={contact.email} />
								<ListItemSecondaryAction>
									<IconButton edge='end' onClick={() => handleSelectContact(contact)}>
										<UserPlus size={18} />
									</IconButton>
								</ListItemSecondaryAction>
							</ListItem>
						))}
					</List>
				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button
					variant='contained'
					onClick={handleAddMembers}
					disabled={!selectedRole || selectedContacts.length === 0}
				>
					Add Members
				</Button>
			</DialogActions>
		</Dialog>
	);
}
