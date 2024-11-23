import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Paper, Divider, Alert, CircularProgress, useTheme } from "@mui/material";
import { ArrowLeft, Check } from "lucide-react";
import { useCompanyStore } from "../../stores/companyStore";
import { useUserStore } from "../../stores/userStore";
import { useTeamStore } from "../../stores/teamStore";
import { useUserCompanyRoleStore } from "../../stores/userCompanyRoleStore";
import { useAuthStore } from "../../stores/authStore";

export function SetupReview({ setupData, onBack }) {
	const theme = useTheme();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(false);

	const { addCompany } = useCompanyStore();
	const { addUser } = useUserStore();
	const { addTeam } = useTeamStore();
	const { addUserCompanyRole } = useUserCompanyRoleStore();
	const { user } = useAuthStore();

	useEffect(() => {
		console.log("SetupReview component mounted");
		console.log("setupData:", setupData);
		console.log("user:", user);
	}, [setupData, user]);

	const handleSetup = async () => {
		setLoading(true);
		setError(null);
		console.log("inside handleSetup");

		try {
			// 1. Create company
			console.log("Creating company with data:", setupData.company);
			const company = await addCompany({
				legalBusinessName: setupData.company.legalBusinessName,
				dbaName: setupData.company.dbaName,
				uei: setupData.company.uei,
				cageCode: setupData.company.cageCode,
				ein: setupData.company.ein,
				companyEmail: setupData.company.companyEmail,
				companyPhoneNumber: setupData.company.companyPhoneNumber,
				companyWebsite: setupData.company.companyWebsite,
				status: "ACTIVE",
			});
			console.log("Created company:", company);

			// 2. Create user
			console.log("Creating user with data:", setupData.user);
			const newUser = await addUser({
				cognitoId: user.sub,
				email: setupData.user.email,
				name: setupData.user.name,
				phone: setupData.user.phone,
				status: "ACTIVE",
				lastLogin: new Date().toISOString(),
			});
			console.log("Created user:", newUser);

			// 3. Create user-company role
			console.log("Creating user-company role with data:", {
				userId: newUser.id,
				companyId: company.id,
				roleId: "COMPANY_ADMIN",
				status: "ACTIVE",
			});
			const userCompanyRole = await addUserCompanyRole({
				userId: newUser.id,
				companyId: company.id,
				roleId: "COMPANY_ADMIN",
				status: "ACTIVE",
			});
			console.log("Created user-company role:", userCompanyRole);

			// 4. Create team
			console.log("Creating team with data:", {
				companyId: company.id,
				role: "TEAM_MEMBER",
				contact: setupData.team?.contact,
			});
			const team = await addTeam({
				companyId: company.id,
				role: "TEAM_MEMBER",
				contact: setupData.team?.contact,
			});
			console.log("Created team:", team);

			setSuccess(true);
		} catch (err) {
			console.error("Setup error:", err);
			setError(err.message || "Failed to complete setup. Please check your input and try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box>
			<Typography variant='h5'>Setup Review</Typography>
			<Paper elevation={3} sx={{ p: 3, mt: 2 }}>
				<Typography variant='h6'>Company Information</Typography>
				<Divider sx={{ my: 2 }} />
				<Typography>
					<strong>Legal Business Name:</strong> {setupData.company.legalBusinessName}
				</Typography>
				<Typography>
					<strong>DBA Name:</strong> {setupData.company.dbaName}
				</Typography>
				<Typography>
					<strong>UEI:</strong> {setupData.company.uei}
				</Typography>
				<Typography>
					<strong>CAGE Code:</strong> {setupData.company.cageCode}
				</Typography>
				<Typography>
					<strong>Company Email:</strong> {setupData.company.companyEmail}
				</Typography>
				<Typography>
					<strong>Company Phone Number:</strong> {setupData.company.companyPhoneNumber}
				</Typography>
				<Typography>
					<strong>Company Website:</strong> {setupData.company.companyWebsite}
				</Typography>
				<Divider sx={{ my: 2 }} />
				<Typography variant='h6'>User Information</Typography>
				<Divider sx={{ my: 2 }} />
				<Typography>
					<strong>Name:</strong> {setupData.user.name}
				</Typography>
				<Typography>
					<strong>Email:</strong> {setupData.user.email}
				</Typography>
				<Typography>
					<strong>Phone:</strong> {setupData.user.phone}
				</Typography>
				<Divider sx={{ my: 2 }} />
				<Typography variant='h6'>Team Information</Typography>
				<Divider sx={{ my: 2 }} />
				{setupData.team?.contact ? (
					<>
						<Typography>
							<strong>Contact Name:</strong> {setupData.team.contact.name}
						</Typography>
						<Typography>
							<strong>Contact Email:</strong> {setupData.team.contact.email}
						</Typography>
						<Typography>
							<strong>Contact Phone:</strong> {setupData.team.contact.phone}
						</Typography>
					</>
				) : (
					<Typography>No contact information provided.</Typography>
				)}
			</Paper>
			{error && (
				<Alert severity='error' sx={{ mt: 2 }}>
					{error}
				</Alert>
			)}
			{success && (
				<Alert severity='success' sx={{ mt: 2 }}>
					Setup completed successfully!
				</Alert>
			)}
			<Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
				<Button variant='outlined' startIcon={<ArrowLeft />} onClick={onBack}>
					Back
				</Button>
				<Button variant='contained' endIcon={<Check />} onClick={handleSetup} disabled={loading}>
					{loading ? <CircularProgress size={24} /> : "Complete Setup"}
				</Button>
			</Box>
		</Box>
	);
}
