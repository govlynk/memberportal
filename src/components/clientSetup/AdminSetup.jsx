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

export function AdminSetup({ onSubmit, onBack, companyData }) {
	const theme = useTheme();
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
		companyRole: "",
		department: "",
		title: "",
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
		if (!formData.email) newErrors.email = "Email is required";
		if (!formData.companyRole) newErrors.companyRole = "Company role is required";

		// Basic email validation
		if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "Invalid email format";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = () => {
		console.log("Form Data:", formData);
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
							name='email'
							type='email'
							value={formData.email}
							onChange={handleChange}
							error={!!errors.email}
							helperText={errors.email}
							required
						/>
						<TextField fullWidth label='Phone' name='phone' value={formData.phone} onChange={handleChange} />
					</Box>
				</Grid>

				<Grid item xs={12} md={6}>
					<Typography variant='subtitle2' sx={{ mb: 2, color: "primary.main" }}>
						Company Role
					</Typography>
					<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
						<FormControl fullWidth error={!!errors.companyRole} required>
							<InputLabel>Role</InputLabel>
							<Select name='companyRole' value={formData.companyRole} onChange={handleChange} label='Role'>
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
