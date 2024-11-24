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
				companyEmail: setupData.user.contactEmail || null,
				companyPhoneNumber: setupData.user.contactBusinessPhone || null,
				companyWebsite: setupData.company.entityURL
					? setupData.company.entityURL.startsWith("http")
						? setupData.company.entityURL
						: `https://${setupData.company.entityURL}`
					: null,
				status: "ACTIVE",
			};

			const companyResponse = await client.models.Company.create(companyData);
			console.log("Company created:", companyResponse);

			if (!companyResponse?.data?.id) {
				throw new Error("Failed to create company");
			}
			const companyId = companyResponse.data.id;

			// 2. Create user
			console.log("Creating user...");
			const userData = {
				cognitoId: setupData.user.cognitoId,
				email: setupData.user.contactEmail,
				name: `${setupData.user.firstName} ${setupData.user.lastName}`.trim(),
				phone: setupData.user.contactMobilePhone || null,

				companies: [companyId],

				// companies: [setupData.company.uei],
				status: "ACTIVE",
				lastLogin: new Date().toISOString(),
			};

			const userResponse = await client.models.User.create(userData);
			console.log("User created:", userResponse);

			if (!userResponse?.data?.id) {
				throw new Error("Failed to create user");
			}
			const userId = userResponse.data.id;

			// 3. Create contact
			console.log("Creating contact...");
			const contactData = {
				firstName: setupData.user.firstName,
				lastName: setupData.user.lastName,
				title: setupData.user.title || null,
				department: setupData.user.department || null,
				contactEmail: setupData.user.contactEmail,
				contactMobilePhone: setupData.user.contactMobilePhone || null,
				contactBusinessPhone: setupData.user.contactBusinessPhone || null,
				workAddressStreetLine1: setupData.company.physicalAddress?.addressLine1 || null,
				workAddressStreetLine2: setupData.company.physicalAddress?.addressLine2 || null,
				workAddressCity: setupData.company.physicalAddress?.city || null,
				workAddressStateCode: setupData.company.physicalAddress?.stateOrProvinceCode || null,
				workAddressZipCode: setupData.company.physicalAddress?.zipCode || null,
				workAddressCountryCode: setupData.company.physicalAddress?.countryCode || "USA",
				dateLastContacted: new Date().toISOString(),
				notes: `Initial contact created during company setup. Role: ${setupData.user.role}`,
			};

			const contactResponse = await client.models.Contact.create(contactData);
			console.log("Contact created:", contactResponse);

			if (!contactResponse?.data?.id) {
				throw new Error("Failed to create contact");
			}
			const contactId = contactResponse.data.id;

			// 4. Create team member
			console.log("Creating team member...");
			const teamData = {
				companyId,
				contactId,
				role: setupData.user.role,
			};

			const teamResponse = await client.models.Team.create(teamData);
			console.log("Team created:", teamResponse);

			if (!teamResponse?.data?.id) {
				throw new Error("Failed to create team");
			}

			// 5. Create user-company role
			console.log("Creating user-company role...");
			const userCompanyRoleData = {
				userId,
				companyId,
				roleId: "ADMIN",
				status: "ACTIVE",
			};

			const userCompanyRoleResponse = await client.models.UserCompanyRole.create(userCompanyRoleData);
			console.log("UserCompanyRole created:", userCompanyRoleResponse);

			if (!userCompanyRoleResponse?.data?.id) {
				throw new Error("Failed to create user-company role");
			}

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
					<strong>Company Email:</strong> {setupData.user.contactEmail || "-"}
				</Typography>
				<Typography>
					<strong>Company Phone Number:</strong> {setupData.user.contactBusinessPhone || "-"}
				</Typography>
				<Typography>
					<strong>Company Website:</strong> {setupData.company.entityURL || "-"}
				</Typography>

				<Typography>
					<strong>Physical Address:</strong>
					<br />
					{setupData.company.physicalAddress?.addressLine1}
					{setupData.company.physicalAddress?.addressLine2 && (
						<>
							<br />
							{setupData.company.physicalAddress.addressLine2}
						</>
					)}
					<br />
					{setupData.company.physicalAddress?.city}, {setupData.company.physicalAddress?.stateOrProvinceCode}{" "}
					{setupData.company.physicalAddress?.zipCode}
				</Typography>

				<Divider sx={{ my: 2 }} />
				<Typography variant='h6'>User Information</Typography>
				<Divider sx={{ my: 2 }} />
				<Typography>
					<strong>Name:</strong> {`${setupData.user.firstName} ${setupData.user.lastName}`}
				</Typography>
				<Typography>
					<strong>Email:</strong> {setupData.user.contactEmail}
				</Typography>
				<Typography>
					<strong>Mobile Phone:</strong> {setupData.user.contactMobilePhone || "-"}
				</Typography>
				<Typography>
					<strong>Business Phone:</strong> {setupData.user.contactBusinessPhone || "-"}
				</Typography>
				<Typography>
					<strong>Role:</strong> {setupData.user.role}
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

export default SetupReview;
