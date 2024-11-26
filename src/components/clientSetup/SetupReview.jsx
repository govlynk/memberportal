import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Paper, Divider, Alert, CircularProgress, useTheme } from "@mui/material";
import { ArrowLeft, Check } from "lucide-react";
import { generateClient } from "aws-amplify/data";
import { useCompanyStore } from "../../stores/companyStore";
import { useUserStore } from "../../stores/userStore";
import { useTeamStore } from "../../stores/teamStore";
import { useUserCompanyRoleStore } from "../../stores/userCompanyRoleStore";
import { useAuthStore } from "../../stores/authStore";

const client = generateClient({
	authMode: "userPool",
});

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

	const handleSetup = async () => {
		setLoading(true);
		setError(null);
		console.log("Starting setup process");

		try {
			if (!user?.sub) {
				throw new Error("User not authenticated");
			}

			// 1. Create company with only the fields defined in the schema
			// const companyData = {
			// 	legalBusinessName: setupData.company.legalBusinessName,
			// 	dbaName: setupData.company.dbaName || null,
			// 	uei: setupData.company.uei,
			// 	cageCode: setupData.company.cageCode || null,
			// 	ein: setupData.company.ein || null,
			// 	companyEmail: setupData.company.companyEmail || null,
			// 	companyPhoneNumber: setupData.company.companyPhoneNumber || null,
			// 	companyWebsite: setupData.company.entityURL || null,
			// 	status: "ACTIVE",
			// 	billingAddressCity: setupData.company.billingAddressCity || null,
			// 	billingAddressCountryCode: setupData.company.billingAddressCountryCode || null,
			// 	billingAddressStateCode: setupData.company.billingAddressStateCode || null,
			// 	billingAddressStreetLine1: setupData.company.billingAddressStreetLine1 || null,
			// 	billingAddressStreetLine2: setupData.company.billingAddressStreetLine2 || null,
			// 	billingAddressZipCode: setupData.company.billingAddressZipCode || null,
			// 	shippingAddressCity: setupData.company.shippingAddressCity || null,
			// 	shippingAddressCountryCode: setupData.company.shippingAddressCountryCode || null,
			// 	shippingAddressStateCode: setupData.company.shippingAddressStateCode || null,
			// 	shippingAddressStreetLine1: setupData.company.shippingAddressStreetLine1 || null,
			// 	shippingAddressStreetLine2: setupData.company.shippingAddressStreetLine2 || null,
			// 	shippingAddressZipCode: setupData.company.shippingAddressZipCode || null,
			// };

			// console.log("Creating company with data:", companyData);
			// const company = await client.models.Company.create(companyData);
			// console.log(company);

			// if (!company?.id) {
			// 	throw new Error("Company creation failed - invalid response");
			// }
			// console.log("Company created successfully:", company);

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
				billingAddressCity: setupData.company.billingAddressCity || null,
				billingAddressCountryCode: setupData.company.billingAddressCountryCode || null,
				billingAddressStateCode: setupData.company.billingAddressStateCode || null,
				billingAddressStreetLine1: setupData.company.billingAddressStreetLine1 || null,
				billingAddressStreetLine2: setupData.company.billingAddressStreetLine2 || null,
				billingAddressZipCode: setupData.company.billingAddressZipCode || null,
				shippingAddressCity: setupData.company.shippingAddressCity || null,
				shippingAddressCountryCode: setupData.company.shippingAddressCountryCode || null,
				shippingAddressStateCode: setupData.company.shippingAddressStateCode || null,
				shippingAddressStreetLine1: setupData.company.shippingAddressStreetLine1 || null,
				shippingAddressStreetLine2: setupData.company.shippingAddressStreetLine2 || null,
				shippingAddressZipCode: setupData.company.shippingAddressZipCode || null,
			};

			const companyResponse = await client.models.Company.create(companyData);
			console.log("Company created:", companyResponse);

			if (!companyResponse?.data?.id) {
				throw new Error("Failed to create company");
			}
			const companyId = companyResponse.data.id;

			// 2. Create contact
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
				companyId: companyId,
			};

			console.log("Creating contact with data:", contactData);
			const contactResponse = await client.models.Contact.create(contactData);
			console.log("Created contact with data:", contactResponse);

			const contactId = contactResponse.data.id;
			console.log("Contact created successfully:", contactResponse);

			// 3. Create user
			if (!setupData.user.contactEmail) {
				throw new Error("User email is required");
			}

			const userData = {
				cognitoId: setupData.user.cognitoId,
				email: setupData.user.contactEmail || null,
				name: `${setupData.user.firstName + " " + setupData.user.lastName}` || null,
				phone: setupData.user.phone || null,
				status: "ACTIVE",
				lastLogin: new Date().toISOString(),
				avatar: setupData.user.avatar || null,
			};
			console.log("Creating user with data:", userData);
			const userResponse = await client.models.User.create(userData);
			console.log("User created successfully:", userResponse);

			const userId = userResponse.data.id;

			// 4. Create team
			const teamData = {
				companyId: companyId,
				contactId: contactId,
				role: setupData.user.role,
				// name: `${setupData.company.legalBusinessName} Team`,
			};

			console.log("Creating team with data:", teamData);
			const teamResponse = await client.models.Team.create(teamData);
			console.log("Team created successfully:", teamResponse);

			// 5. Create user-company role
			const userCompanyRoleData = {
				userId: userId,
				companyId: companyId,
				roleId: "COMPANY_ADMIN",
				status: "ACTIVE",
			};

			console.log("Creating user-company role with data:", userCompanyRoleData);
			const userCompanyRole = await client.models.UserCompanyRole.create(userCompanyRoleData);
			console.log("User-company role created successfully:", userCompanyRole);

			setSuccess(true);
		} catch (err) {
			console.error("Setup error:", err);
			setError(err.message || "Failed to complete setup");
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
					<strong>Company Phone:</strong> {setupData.company.companyPhoneNumber || "-"}
				</Typography>

				<Divider sx={{ my: 2 }} />
				<Typography variant='h6'>Administrator Information</Typography>
				<Divider sx={{ my: 2 }} />
				<Typography>
					<strong>Name:</strong> {setupData.user.firstName} {setupData.user.lastName}
				</Typography>
				<Typography>
					<strong>Email:</strong> {setupData.user.contactEmail}
				</Typography>
				<Typography>
					<strong>Role:</strong> {setupData.user.role}
				</Typography>
				<Typography>
					<strong>Phone:</strong> {setupData.user.contactMobilePhone || "-"}
				</Typography>
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
