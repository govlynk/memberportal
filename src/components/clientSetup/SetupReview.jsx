import React, { useState } from "react";
import { Box, Button, Typography, Paper, Divider, Alert, CircularProgress, useTheme } from "@mui/material";
import { ArrowLeft, Check } from "lucide-react";
import { generateClient } from "aws-amplify/data";
import { useAuthStore } from "../../stores/authStore";

const client = generateClient({
	authMode: "userPool",
});

export function SetupReview({ setupData, onBack }) {
	const theme = useTheme();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(false);
	const currentUser = useAuthStore((state) => state.user);

	const handleSetup = async () => {
		setLoading(true);
		setError(null);
		console.log("Starting setup process...");
		console.log("Current user:", currentUser);
		console.log("Setup data:", setupData);

		try {
			if (!currentUser?.sub) {
				throw new Error("User not authenticated");
			}

			// 1. Create company
			console.log("Creating company...");
			const companyData = {
				legalBusinessName: setupData.company.legalBusinessName,
				dbaName: setupData.company.dbaName || null,
				uei: setupData.company.uei,
				cageCode: setupData.company.cageCode || null,
				ein: setupData.company.ein || null,
				companyEmail: setupData.user.email || null,
				companyPhoneNumber: setupData.user.phone || null,
				companyWebsite: setupData.company.entityURL
					? setupData.company.entityURL.startsWith("http")
						? setupData.company.entityURL
						: `https://${setupData.company.entityURL}`
					: null,
				status: "ACTIVE",
			};

			const companyResponse = await client.models.Company.create(companyData);
			if (!companyResponse?.data?.id) {
				throw new Error("Failed to create company");
			}
			console.log("Company created successfully:", companyResponse);
			const companyId = companyResponse.data.id;

			// 2. Create contact for admin
			console.log("Creating contact for admin...");
			const contactData = {
				firstName: setupData.user.firstName,
				lastName: setupData.user.lastName,
				title: setupData.user.title || null,
				department: setupData.user.department || null,
				contactEmail: setupData.user.email,
				contactMobilePhone: setupData.user.phone || null,
				contactBusinessPhone: setupData.user.phone || null,
				workAddressStreetLine1: setupData.company.physicalAddress?.addressLine1 || null,
				workAddressStreetLine2: setupData.company.physicalAddress?.addressLine2 || null,
				workAddressCity: setupData.company.physicalAddress?.city || null,
				workAddressStateCode: setupData.company.physicalAddress?.stateOrProvinceCode || null,
				workAddressZipCode: setupData.company.physicalAddress?.zipCode || null,
				workAddressCountryCode: "USA",
				dateLastContacted: new Date().toISOString(),
				notes: null,
			};

			const contactResponse = await client.models.Contact.create(contactData);
			if (!contactResponse?.data?.id) {
				throw new Error("Failed to create contact");
			}
			console.log("Contact created successfully:", contactResponse);
			const contactId = contactResponse.data.id;

			// 3. Create team member
			console.log("Creating team member...");
			const teamData = {
				companyId,
				contactId,
				role: setupData.user.companyRole || "EXECUTIVE",
			};

			const teamResponse = await client.models.Team.create(teamData);
			if (!teamResponse?.data?.id) {
				throw new Error("Failed to create team");
			}
			console.log("Team member created successfully:", teamResponse);

			// 4. Create user
			console.log("Creating user...");
			const userData = {
				cognitoId: currentUser.sub,
				email: setupData.user.email,
				name: `${setupData.user.firstName} ${setupData.user.lastName}`.trim(),
				phone: setupData.user.phone || null,
				status: "ACTIVE",
				lastLogin: new Date().toISOString(),
			};

			const userResponse = await client.models.User.create(userData);
			if (!userResponse?.data?.id) {
				throw new Error("Failed to create user");
			}
			console.log("User created successfully:", userResponse);
			const userId = userResponse.data.id;

			// 5. Create user-company role
			console.log("Creating user-company role...");
			const userCompanyRoleData = {
				userId,
				companyId,
				roleId: "ADMIN",
				status: "ACTIVE",
			};

			const userCompanyRoleResponse = await client.models.UserCompanyRole.create(userCompanyRoleData);
			if (!userCompanyRoleResponse?.data?.id) {
				throw new Error("Failed to create user-company role");
			}
			console.log("User-company role created successfully:", userCompanyRoleResponse);

			setSuccess(true);
			console.log("Setup completed successfully!");
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
					<strong>DBA Name:</strong> {setupData.company.dbaName || "-"}
				</Typography>
				<Typography>
					<strong>UEI:</strong> {setupData.company.uei}
				</Typography>
				<Typography>
					<strong>CAGE Code:</strong> {setupData.company.cageCode || "-"}
				</Typography>
				<Typography>
					<strong>Company Email:</strong> {setupData.company.companyEmail || "-"}
				</Typography>
				<Typography>
					<strong>Company Phone Number:</strong> {setupData.company.companyPhoneNumber || "-"}
				</Typography>
				<Typography>
					<strong>Company Website:</strong> {setupData.company.entityURL || "-"}
				</Typography>

				<Divider sx={{ my: 2 }} />
				<Typography variant='h6'>User Information</Typography>
				<Divider sx={{ my: 2 }} />
				<Typography>
					<strong>Name:</strong> {`${setupData.user.firstName} ${setupData.user.lastName}`}
				</Typography>
				<Typography>
					<strong>Email:</strong> {setupData.user.email}
				</Typography>
				<Typography>
					<strong>Phone:</strong> {setupData.user.phone || "-"}
				</Typography>
				<Typography>
					<strong>Role:</strong> {setupData.user.companyRole}
				</Typography>
				<Typography>
					<strong>Department:</strong> {setupData.user.department || "-"}
				</Typography>
				<Typography>
					<strong>Title:</strong> {setupData.user.title || "-"}
				</Typography>

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
			</Paper>

			<Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
				<Button variant='outlined' startIcon={<ArrowLeft />} onClick={onBack} disabled={loading}>
					Back
				</Button>
				<Button
					variant='contained'
					endIcon={loading ? <CircularProgress size={20} /> : <Check />}
					onClick={handleSetup}
					disabled={loading}
				>
					{loading ? "Setting up..." : "Complete Setup"}
				</Button>
			</Box>
		</Box>
	);
}
