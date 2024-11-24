import React, { useState, useEffect } from "react";
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
	"HumanResources",
	"Legal",
	"Contracting",
	"Servicing",
	"Other",
];

export function AdminSetup({ onSubmit, onBack, companyData }) {
	const theme = useTheme();
	const [formData, setFormData] = useState({
		cognitoId: "",
		firstName: "",
		lastName: "",
		title: "",
		department: "",
		contactEmail: "",
		contactMobilePhone: "",
		contactBusinessPhone: "",
		role: "",
		workAddressStreetLine1: companyData?.shippingAddressStreetLine1 || "",
		workAddressStreetLine2: companyData?.shippingAddressStreetLine2 || "",
		workAddressCity: companyData?.shippingAddressCity || "",
		workAddressStateCode: companyData?.shippingAddressStateOrProvinceCode || "",
		workAddressZipCode: companyData?.shippingAddressZipCode || "",
		workAddressCountryCode: companyData?.shippingAddressCuntryCode || "USA",
		notes: "",
		auth: "COMPANY_ADMIN",
	});
	const [errors, setErrors] = useState({});

	useEffect(() => {
		if (companyData?.shippingAddressCity != "") {
			setFormData((prev) => ({
				...prev,
				workAddressStreetLine1: companyData.shippingAddressStreetLine1 || "",
				workAddressStreetLine2: companyData.shippingAddressStreetLine2 || "",
				workAddressCity: companyData.shippingAddressCity || "",
				workAddressStateCode: companyData.shippingAddressStateCode || "",
				workAddressZipCode: companyData.shippingAddressZipCode || "",
				workAddressCountryCode: companyData.shippingAddressCuntryCode || "USA",
			}));
		}
	}, [companyData]);

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

		// Basic email validation
		if (formData.contactEmail && !/\S+@\S+\.\S+/.test(formData.contactEmail)) {
			newErrors.contactEmail = "Invalid email format";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = () => {
		if (validateForm()) {
			onSubmit({
				...formData,
				accessLevel: "COMPANY_ADMIN",
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
							label='Cognito Id'
							name='cognitoId'
							value={formData.cognitoId}
							onChange={handleChange}
							helperText='Optional - Enter if user already exists in Cognito'
						/>
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

				<Grid item xs={12} md={6}>
					<Typography variant='subtitle2' sx={{ mb: 2, color: "primary.main" }}>
						Company Role
					</Typography>
					<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
						<FormControl fullWidth error={!!errors.role} required>
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
							label='Department'
							name='department'
							value={formData.department}
							onChange={handleChange}
						/>
						<TextField fullWidth label='Title' name='title' value={formData.title} onChange={handleChange} />
					</Box>
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
						<Grid item xs={12} sm={6}>
							<TextField
								fullWidth
								label='City'
								name='workAddressCity'
								value={formData.workAddressCity}
								onChange={handleChange}
							/>
						</Grid>
						<Grid item xs={12} sm={3}>
							<TextField
								fullWidth
								label='State'
								name='workAddressStateCode'
								value={formData.workAddressStateCode}
								onChange={handleChange}
							/>
						</Grid>
						<Grid item xs={12} sm={3}>
							<TextField
								fullWidth
								label='ZIP Code'
								name='workAddressZipCode'
								value={formData.workAddressZipCode}
								onChange={handleChange}
							/>
						</Grid>
					</Grid>
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

export default AdminSetup;
