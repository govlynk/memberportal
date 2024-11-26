import React, { useState, useEffect } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Box,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Alert,
} from "@mui/material";
import { useTeamStore } from "../../stores/teamStore";
import { generateClient } from "aws-amplify/data";

const client = generateClient({
	authMode: "userPool",
});

const ROLES = [
	"Executive",
	"Sales",
	"Marketing",
	"Finance",
	"Risk",
	"Technology",
	"Engineering",
	"Operations",
	"HumanResources",
	"Legal",
	"Contracting",
	"Servicing",
	"Other",
];

const initialFormState = {
	contactId: "",
	role: "",
};

export function TeamMemberDialog({ open, onClose, team, companyId }) {
	const { addTeamMember } = useTeamStore();
	const [formData, setFormData] = useState(initialFormState);
	const [contacts, setContacts] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (open && companyId) {
			fetchContacts();
		}
	}, [open, companyId]);

	const fetchContacts = async () => {
		setLoading(true);
		try {
			const response = await client.models.Contact.list({
				filter: { companyId: { eq: companyId } },
			});

			if (!response?.data) {
				throw new Error("Failed to fetch contacts");
			}

			// Filter out contacts that are already team members
			const existingContactIds = team?.members?.map((member) => member.contactId) || [];
			const availableContacts = response.data.filter((contact) => !existingContactIds.includes(contact.id));

			setContacts(availableContacts);
			setError(null);
		} catch (err) {
			console.error("Error fetching contacts:", err);
			setError("Failed to load contacts");
		} finally {
			setLoading(false);
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		setError(null);
	};

	const validateForm = () => {
		if (!formData.contactId) {
			setError("Please select a contact");
			return false;
		}
		if (!formData.role) {
			setError("Please select a role");
			return false;
		}
		if (!team?.id) {
			setError("No team selected");
			return false;
		}
		return true;
	};

	const handleSubmit = async () => {
		if (!validateForm()) return;

		setLoading(true);
		try {
			await addTeamMember({
				teamId: team.id,
				contactId: formData.contactId,
				role: formData.role,
			});

			onClose();
		} catch (err) {
			console.error("Error adding team member:", err);
			setError(err.message || "Failed to add team member");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth='sm'
			fullWidth
			PaperProps={{
				sx: {
					bgcolor: "background.paper",
					color: "text.primary",
				},
			}}
		>
			<DialogTitle>Add Team Member</DialogTitle>
			<DialogContent>
				<Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
					{error && (
						<Alert severity='error' sx={{ mb: 2 }}>
							{error}
						</Alert>
					)}

					<FormControl fullWidth required disabled={loading}>
						<InputLabel>Contact</InputLabel>
						<Select name='contactId' value={formData.contactId} onChange={handleChange} label='Contact'>
							{contacts.map((contact) => (
								<MenuItem key={contact.id} value={contact.id}>
									{contact.firstName} {contact.lastName}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<FormControl fullWidth required disabled={loading}>
						<InputLabel>Role</InputLabel>
						<Select name='role' value={formData.role} onChange={handleChange} label='Role'>
							{ROLES.map((role) => (
								<MenuItem key={role} value={role}>
									{role}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} disabled={loading}>
					Cancel
				</Button>
				<Button onClick={handleSubmit} variant='contained' disabled={loading}>
					{loading ? "Adding..." : "Add Member"}
				</Button>
			</DialogActions>
		</Dialog>
	);
}
