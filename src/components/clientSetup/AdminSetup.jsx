import React, { useState } from "react";
import {
	Box,
	TextField,
	Button,
	Typography,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Grid,
	Divider,
	useTheme,
} from "@mui/material";
import { ArrowLeft, ArrowRight } from "lucide-react";

const COMPANY_ROLES = [
	"Executive",
	"Sales",
	"Marketing",
	"Finance",
	"Risk",
	"Technology",
	"Engineering",
	"Operations",
	"Human Resources",
	"Legal",
	"Contracting",
	"Servicing",
	"Other",
];

const AUTH_TYPES = ["GOVLYNK_ADMIN", "GOVLYNK_CONSULTANT", "GOVLYNK_USER", "COMPANY_ADMIN", "COMPANY_USER", "VIEWER"];

export function AdminSetup({ onSubmit, onBack, companyData }) {
	const theme = useTheme();
	const [formData, setFormData] = useState({
		// Contact Info
		firstName: "",
		lastName: "",
		title: "",
		department: "",
		contactEmail: "",
		contactMobilePhone: "",
		contactBusinessPhone: "",
		role: "",
		workAddressStreetLine1: companyData?.physicalAddress?.addressLine1 || "",
		workAddressStreetLine2: companyData?.physicalAddress?.addressLine2 || "",
		workAddressCity: companyData?.physicalAddress?.city || "",
		workAddressStateCode: companyData?.physicalAddress?.stateOrProvinceCode || "",
		workAddressZipCode: companyData?.physicalAddress?.zipCode || "",
		workAddressCountryCode: companyData?.physicalAddress?.countryCode || "USA",
		notes: "",

		// User Auth Info
		cognitoId: "",
		auth: "COMPANY_ADMIN",
	});

	const [errors, setErrors] = useState({});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		setErrors((prev) => ({
			...prev,
			[name]: "",
		}));
	};

	const validateForm = () => {
		const newErrors = {};
		if (!formData.firstName) newErrors.firstName = "First name is required";
		if (!formData.lastName) newErrors.lastName = "Last name is required";
		if (!formData.contactEmail) newErrors.contactEmail = "Email is required";
		if (!formData.role) newErrors.role = "Company role is required";
		if (!formData.auth) newErrors.auth = "Authorization type is required";

		// Basic email validation
		if (formData.contactEmail && !/\S+@\S+\.\S+/.test(formData.contactEmail)) {
			newErrors.contactEmail = "Invalid email format";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = () => {
		if (validateForm()) {
			// Create user data object
			const userData = {
				cognitoId: formData.cognitoId,
				fullName: `${formData.firstName} ${formData.lastName}`,
				email: formData.contactEmail,
				phone: formData.contactMobilePhone,
				status: "ACTIVE",
				companyName: [companyData.legalBusinessName],
				uei: [companyData.uei],
				auth: formData.auth,
			};

			// Submit both contact and user data
			onSubmit({
				contact: formData,
				user: userData,
			});
		}
	};

	return (
		<Box>
			<Typography variant='h6' sx={{ mb: 1 }}>
				Company Administrator Setup
			</Typography>
			<Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
				Setting up admin access for {companyData?.legalBusinessName}
			</Typography>

			<Grid container spacing={3}>
				<Grid item xs={12} md={6}>
					<Typography variant='subtitle2' sx={{ mb: 2, color: "primary.main" }}>
						Personal Information
					</Typography>
					<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
						<TextField
							fullWidth
							label='First Name'
							name='firstName'
							value={formData.firstName}
							onChange={handleChange}
							error={!!errors.firstName}
							helperText={errors.firstName}
							required
						/>
						<TextField
							fullWidth
							label='Last Name'
							name='lastName'
							value={formData.lastName}
							onChange={handleChange}
							error={!!errors.lastName}
							helperText={errors.lastName}
							required
						/>
						<TextField fullWidth label='Title' name='title' value={formData.title} onChange={handleChange} />
						<TextField
							fullWidth
							label='Department'
							name='department'
							value={formData.department}
							onChange={handleChange}
						/>
					</Box>
				</Grid>

				<Grid item xs={12} md={6}>
					<Typography variant='subtitle2' sx={{ mb: 2, color: "primary.main" }}>
						Contact Information
					</Typography>
					<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
						<TextField
							fullWidth
							label='Email'
							name='contactEmail'
							type='email'
							value={formData.contactEmail}
							onChange={handleChange}
							error={!!errors.contactEmail}
							helperText={errors.contactEmail}
							required
						/>
						<TextField
							fullWidth
							label='Mobile Phone'
							name='contactMobilePhone'
							value={formData.contactMobilePhone}
							onChange={handleChange}
						/>
						<TextField
							fullWidth
							label='Business Phone'
							name='contactBusinessPhone'
							value={formData.contactBusinessPhone}
							onChange={handleChange}
						/>
					</Box>
				</Grid>

				<Grid item xs={12}>
					<Typography variant='subtitle2' sx={{ mb: 2, color: "primary.main" }}>
						Role & Authorization
					</Typography>
					<Grid container spacing={2}>
						<Grid item xs={12} md={6}>
							<FormControl fullWidth error={!!errors.role} required>
								<InputLabel>Company Role</InputLabel>
								<Select name='role' value={formData.role} onChange={handleChange} label='Company Role'>
									{COMPANY_ROLES.map((role) => (
										<MenuItem key={role} value={role}>
											{role}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={12} md={6}>
							<FormControl fullWidth error={!!errors.auth} required>
								<InputLabel>Authorization Type</InputLabel>
								<Select name='auth' value={formData.auth} onChange={handleChange} label='Authorization Type'>
									{AUTH_TYPES.map((type) => (
										<MenuItem key={type} value={type}>
											{type.replace(/_/g, " ")}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>
					</Grid>
				</Grid>

				<Grid item xs={12}>
					<Typography variant='subtitle2' sx={{ mb: 2, color: "primary.main" }}>
						Work Address
					</Typography>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<TextField
								fullWidth
								label='Street Address Line 1'
								name='workAddressStreetLine1'
								value={formData.workAddressStreetLine1}
								onChange={handleChange}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								fullWidth
								label='Street Address Line 2'
								name='workAddressStreetLine2'
								value={formData.workAddressStreetLine2}
								onChange={handleChange}
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<TextField
								fullWidth
								label='City'
								name='workAddressCity'
								value={formData.workAddressCity}
								onChange={handleChange}
							/>
						</Grid>
						<Grid item xs={12} md={2}>
							<TextField
								fullWidth
								label='State'
								name='workAddressStateCode'
								value={formData.workAddressStateCode}
								onChange={handleChange}
							/>
						</Grid>
						<Grid item xs={12} md={2}>
							<TextField
								fullWidth
								label='ZIP Code'
								name='workAddressZipCode'
								value={formData.workAddressZipCode}
								onChange={handleChange}
							/>
						</Grid>
						<Grid item xs={12} md={2}>
							<TextField
								fullWidth
								label='Country'
								name='workAddressCountryCode'
								value={formData.workAddressCountryCode}
								onChange={handleChange}
							/>
						</Grid>
					</Grid>
				</Grid>

				<Grid item xs={12}>
					<TextField
						fullWidth
						label='Notes'
						name='notes'
						value={formData.notes}
						onChange={handleChange}
						multiline
						rows={3}
					/>
				</Grid>
			</Grid>

			<Divider sx={{ my: 4 }} />

			<Box sx={{ display: "flex", justifyContent: "space-between" }}>
				<Button onClick={onBack} startIcon={<ArrowLeft />}>
					Back
				</Button>
				<Button variant='contained' onClick={handleSubmit} endIcon={<ArrowRight />}>
					Continue
				</Button>
			</Box>
		</Box>
	);
}
