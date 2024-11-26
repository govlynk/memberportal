import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, Alert } from "@mui/material";
import { useTeamStore } from "../../stores/teamStore";

const initialFormState = {
	name: "",
	description: "",
};

export function TeamDialog({ open, onClose, editTeam = null, companyId }) {
	const { addTeam, updateTeam } = useTeamStore();
	const [formData, setFormData] = useState(initialFormState);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (editTeam) {
			setFormData({
				name: editTeam.name,
				description: editTeam.description || "",
			});
		} else {
			setFormData(initialFormState);
		}
	}, [editTeam]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		setError(null);
	};

	const validateForm = () => {
		if (!formData.name.trim()) {
			setError("Team name is required");
			return false;
		}
		if (!companyId) {
			setError("No company selected");
			return false;
		}
		return true;
	};

	const handleSubmit = async () => {
		if (!validateForm()) return;

		setLoading(true);
		try {
			const teamData = {
				name: formData.name.trim(),
				description: formData.description?.trim() || null,
				companyId,
			};

			if (editTeam) {
				await updateTeam(editTeam.id, teamData);
			} else {
				await addTeam(teamData);
			}
			onClose();
		} catch (err) {
			console.error("Error saving team:", err);
			setError(err.message || "Failed to save team");
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
			<DialogTitle>{editTeam ? "Edit Team" : "Add New Team"}</DialogTitle>
			<DialogContent>
				<Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
					{error && (
						<Alert severity='error' sx={{ mb: 2 }}>
							{error}
						</Alert>
					)}
					<TextField
						fullWidth
						label='Team Name'
						name='name'
						value={formData.name}
						onChange={handleChange}
						required
						error={error === "Team name is required"}
						disabled={loading}
					/>
					<TextField
						fullWidth
						label='Description'
						name='description'
						value={formData.description}
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
					{loading ? "Saving..." : editTeam ? "Save Changes" : "Add Team"}
				</Button>
			</DialogActions>
		</Dialog>
	);
}
