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

			// 2. Create contact
			console.log("Creating contact...");
			const contactData = {
				firstName: setupData.user.firstName,
				lastName: setupData.user.lastName,
				title: setupData.user.title || null,
				department: setupData.user.department || null,
				contactEmail: setupData.user.contactEmail,
				contactMobilePhone: setupData.user.contactMobilePhone || null,
				contactBusinessPhone: setupData.user.contactBusinessPhone || null,
				workAddressStreetLine1: setupData.user.workAddressStreetLine1 || null,
				workAddressStreetLine2: setupData.user.workAddressStreetLine2 || null,
				workAddressCity: setupData.user.workAddressCity || null,
				workAddressStateCode: setupData.user.workAddressStateCode || null,
				workAddressZipCode: setupData.user.workAddressZipCode || null,
				workAddressCountryCode: setupData.user.workAddressCountryCode || "USA",
				dateLastContacted: new Date().toISOString(),
				notes: `Initial contact created during company setup. Role: ${setupData.user.role}`,
				companyId: company.id, // Ensure this field is defined in the schema
			};

			const contactResponse = await client.models.Contact.create(contactData);
			console.log("Contact created:", contactResponse);

			if (!contactResponse?.data?.id) {
				throw new Error("Failed to create contact");
			}
			const contactId = contactResponse.data.id;

			// 3. Create user if Cognito ID is provided
			let userId = setupData.user.cognitoId;
			if (userId) {
				console.log("Creating user...");
				const userData = {
					cognitoId: userId,
					email: setupData.user.contactEmail,
					name: `${setupData.user.firstName} ${setupData.user.lastName}`.trim(),
					phone: setupData.user.contactMobilePhone || null,
					status: "ACTIVE",
					lastLogin: new Date().toISOString(),
				};

				const userResponse = await client.models.User.create(userData);
				console.log("User created:", userResponse);

				if (!userResponse?.data?.id) {
					throw new Error("Failed to create user");
				}
				userId = userResponse.data.id;
			}

			// 4. Create user-company role
			console.log("Creating user-company role with data:", {
				userId,
				companyId: company.id,
				roleId: "COMPANY_ADMIN",
				status: "ACTIVE",
			});
			const userCompanyRole = await addUserCompanyRole({
				userId,
				companyId: company.id,
				roleId: "COMPANY_ADMIN",
				status: "ACTIVE",
			});
			console.log("Created user-company role:", userCompanyRole);

			// 5. Create team
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
					<strong>Name:</strong> {setupData.user.firstName} {setupData.user.lastName}
				</Typography>
				<Typography>
					<strong>Email:</strong> {setupData.user.contactEmail}
				</Typography>
				<Typography>
					<strong>Phone:</strong> {setupData.user.contactMobilePhone}
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
