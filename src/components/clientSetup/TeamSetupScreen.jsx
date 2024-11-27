import React, { useState } from "react";
import {
	Box,
	Button,
	TextField,
	Typography,
	Alert,
	CircularProgress,
	Card,
	Divider,
	Chip,
	Stack,
	useTheme,
} from "@mui/material";
import { ArrowLeft, ArrowRight, Users } from "lucide-react";
import { useTeamStore } from "../../stores/teamStore";
import { useTeamMemberStore } from "../../stores/teamMemberStore";

export function TeamSetupScreen({ onSubmit, onBack, setupData }) {
	const theme = useTheme();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [formData, setFormData] = useState({
		name: `${setupData.company.legalBusinessName} Team`,
		description: `Default team for ${setupData.company.legalBusinessName}`,
	});

	const { addTeam } = useTeamStore();
	const { addTeamMember } = useTeamMemberStore();

	const handleSubmit = async () => {
		console.log("setupData:", setupData);

		if (!formData.name.trim()) {
			setError("Team name is required");
			return;
		}

		if (!setupData.company?.id) {
			setError("Company information is missing");
			return;
		}

		if (!setupData.user?.id) {
			setError("User information is missing");
			return;
		}

		setLoading(true);
		setError(null);

		try {
			console.log("Creating team with data:", {
				name: formData.name,
				description: formData.description,
				companyId: setupData.company.id,
			});

			// Create the team
			const team = await addTeam({
				name: formData.name.trim(),
				description: formData.description?.trim(),
				companyId: setupData.company.id,
			});

			if (!team?.id) {
				throw new Error("Failed to create team - no team ID returned");
			}

			console.log("Team created successfully:", team);

			// Add the primary contact as a team member
			const teamMember = await addTeamMember({
				teamId: team.id,
				contactId: setupData.user.id,
				role: setupData.user.roleId,
			});

			console.log("Team member added successfully:", teamMember);

			// Pass the created team data to the next step
			onSubmit({
				...setupData,
				team: {
					...team,
					members: [teamMember],
				},
			});
		} catch (err) {
			console.error("Error setting up team:", err);
			setError(err.message || "Failed to set up team");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box>
			<Typography variant='h6' sx={{ mb: 3 }}>
				Team Setup
			</Typography>

			<Card sx={{ p: 3, mb: 3 }}>
				<Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
					<Users size={24} />
					<Typography variant='h6'>Default Team Configuration</Typography>
				</Box>

				<Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
					Create a default team for your organization. This team will include you as the initial team member with
					your assigned role.
				</Typography>

				{error && (
					<Alert severity='error' sx={{ mb: 3 }}>
						{error}
					</Alert>
				)}

				<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
					<TextField
						fullWidth
						label='Team Name'
						value={formData.name}
						onChange={(e) => setFormData({ ...formData, name: e.target.value })}
						required
						error={!!error && !formData.name.trim()}
						helperText={error && !formData.name.trim() ? "Team name is required" : ""}
						disabled={loading}
					/>

					<TextField
						fullWidth
						label='Description'
						value={formData.description}
						onChange={(e) => setFormData({ ...formData, description: e.target.value })}
						multiline
						rows={3}
						disabled={loading}
					/>
				</Box>

				<Divider sx={{ my: 3 }} />

				<Box>
					<Typography variant='subtitle2' gutterBottom>
						Initial Team Member
					</Typography>
					<Card variant='outlined' sx={{ p: 2, bgcolor: theme.palette.grey[50] }}>
						<Stack spacing={2}>
							<Box>
								<Typography variant='caption' display='block' color='text.secondary' gutterBottom>
									Name
								</Typography>
								<Typography>
									{setupData.user.firstName} {setupData.user.lastName}
								</Typography>
							</Box>
							<Box>
								<Typography variant='caption' display='block' color='text.secondary' gutterBottom>
									Email
								</Typography>
								<Typography>{setupData.user.contactEmail}</Typography>
							</Box>
							<Box>
								<Typography variant='caption' display='block' color='text.secondary' gutterBottom>
									Role
								</Typography>
								<Box sx={{ mt: 0.5 }}>
									<Chip label={setupData.user.roleId} size='small' color='primary' />
								</Box>
							</Box>
						</Stack>
					</Card>
				</Box>
			</Card>

			<Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
				<Button onClick={onBack} startIcon={<ArrowLeft />} disabled={loading}>
					Back
				</Button>
				<Button
					variant='contained'
					onClick={handleSubmit}
					endIcon={loading ? <CircularProgress size={20} /> : <ArrowRight />}
					disabled={loading}
				>
					{loading ? "Setting up..." : "Continue"}
				</Button>
			</Box>
		</Box>
	);
}
