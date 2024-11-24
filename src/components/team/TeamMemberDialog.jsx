import React, { useEffect, useState } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Button,
	Box,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Alert,
} from "@mui/material";
import { useTeamStore } from "../../stores/teamStore";
import { useContactStore } from "../../stores/contactStore";

const COMPANY_ROLES = [
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
	notes: "",
};

export function TeamMemberDialog({ open, onClose, teamId, editMember = null }) {
	const { addTeamMember, updateTeamMember } = useTeamStore();
	const { contacts, fetchContacts } = useContactStore();
	const [formData, setFormData] = useState(initialFormState);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (open) {
			fetchContacts();
		}
	}, [open, fetchContacts]);

	useEffect(() => {
		if (editMember) {
			setFormData({
				contactId: editMember.contactId,
				role: editMember.role,
				notes: editMember.notes || "",
			});
		} else {
			setFormData(initialFormState);
		}
	}, [editMember]);

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
			setError("Contact is required");
			return false;
		}
		if (!formData.role) {
			setError("Role is required");
			return false;
		}
		return true;
	};

	const handleSubmit = async () => {
		if (!validateForm()) return;

		setLoading(true);
		try {
			const memberData = {
				contactId: formData.contactId,
				role: formData.role,
				notes: formData.notes?.trim() || null,
				status: "ACTIVE",
			};

			if (editMember) {
				await updateTeamMember(editMember.id, memberData);
			} else {
				await addTeamMember({
					teamId,
					...memberData,
				});
			}
			onClose();
		} catch (err) {
			console.error("Error saving team member:", err);
			setError(err.message || "Failed to save team member");
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
			<DialogTitle>{editMember ? "Edit Team Member" : "Add Team Member"}</DialogTitle>
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
									{`${contact.firstName} ${contact.lastName}`}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<FormControl fullWidth required disabled={loading}>
						<InputLabel>Role</InputLabel>
						<Select name='role' value={formData.role} onChange={handleChange} label='Role'>
							{COMPANY_ROLES.map((role) => (
								<MenuItem key={role} value={role}>
									{role}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<TextField
						fullWidth
						label='Notes'
						name='notes'
						value={formData.notes}
						onChange={handleChange}
						multiline
						rows={3}
						disabled={loading}
					/>
				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} disabled={loading}>
					Cancel
				</Button>
				<Button onClick={handleSubmit} variant='contained' disabled={loading}>
					{loading ? "Saving..." : editMember ? "Save Changes" : "Add Member"}
				</Button>
			</DialogActions>
		</Dialog>
	);
}
