import React, { useState, useEffect } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Button,
	Box,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Autocomplete,
	Chip,
	Alert,
} from "@mui/material";
import { useCompanyStore } from "../stores/companyStore";
import { useUserStore } from "../stores/userStore";

const initialFormState = {
	cognitoId: "",
	email: "",
	name: "",
	phone: "",
	status: "ACTIVE",
	companies: [],
};

export const UserDialog = ({ open, onClose, editUser = null }) => {
	const [formData, setFormData] = useState(initialFormState);
	const [error, setError] = useState(null);
	const { companies, fetchCompanies } = useCompanyStore();
	const { addUser, updateUser } = useUserStore();

	useEffect(() => {
		fetchCompanies();
	}, [fetchCompanies]);

	useEffect(() => {
		if (editUser) {
			setFormData({
				cognitoId: editUser.cognitoId || "",
				email: editUser.email || "",
				name: editUser.name || "",
				phone: editUser.phone || "",
				status: editUser.status || "ACTIVE",
				companies: editUser.companies || [],
			});
		} else {
			setFormData(initialFormState);
		}
	}, [editUser]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		setError(null);
	};

	const handleCompanyChange = (event, newValue) => {
		setFormData((prev) => ({
			...prev,
			companies: newValue || [],
		}));
	};

	const validateForm = () => {
		if (!formData.email?.trim()) {
			setError("Email is required");
			return false;
		}
		if (!formData.name?.trim()) {
			setError("Name is required");
			return false;
		}
		return true;
	};

	const handleSubmit = async () => {
		if (!validateForm()) return;

		try {
			const userData = {
				...formData,
				email: formData.email.trim(),
				name: formData.name.trim(),
				phone: formData.phone?.trim() || "",
			};

			if (editUser) {
				await updateUser(editUser.id, userData);
			} else {
				await addUser(userData);
			}
			onClose();
		} catch (err) {
			console.error("Error saving user:", err);
			setError(err.message || "Failed to save user");
		}
	};

	return (
		<Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
			<DialogTitle>{editUser ? "Edit User" : "Add New User"}</DialogTitle>
			<DialogContent>
				<Box
					sx={{
						mt: 2,
						display: "flex",
						flexDirection: "column",
						gap: 2,
					}}
				>
					{error && (
						<Alert severity='error' sx={{ mb: 2 }}>
							{error}
						</Alert>
					)}
					<TextField
						fullWidth
						required
						label='Email'
						name='email'
						type='email'
						value={formData.email}
						onChange={handleChange}
						error={!formData.email && Boolean(error)}
					/>
					<TextField
						fullWidth
						required
						label='Name'
						name='name'
						value={formData.name}
						onChange={handleChange}
						error={!formData.name && Boolean(error)}
					/>
					<TextField fullWidth label='Phone' name='phone' value={formData.phone} onChange={handleChange} />
					<FormControl fullWidth>
						<InputLabel>Status</InputLabel>
						<Select name='status' value={formData.status} onChange={handleChange} label='Status'>
							<MenuItem value='ACTIVE'>Active</MenuItem>
							<MenuItem value='INACTIVE'>Inactive</MenuItem>
						</Select>
					</FormControl>

					<Autocomplete
						multiple
						options={companies || []}
						getOptionLabel={(option) => option?.legalBusinessName || ""}
						value={Array.isArray(formData.companies) ? formData.companies : []}
						onChange={handleCompanyChange}
						renderInput={(params) => (
							<TextField {...params} label='Associated Companies' placeholder='Select companies' />
						)}
						renderTags={(value, getTagProps) =>
							Array.isArray(value)
								? value.map((option, index) => {
										const { key, ...chipProps } = getTagProps({ index });
										return <Chip key={key} {...chipProps} label={option?.legalBusinessName || ""} />;
								  })
								: null
						}
						isOptionEqualToValue={(option, value) => option?.id === value?.id}
					/>
				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button onClick={handleSubmit} variant='contained'>
					{editUser ? "Save Changes" : "Add User"}
				</Button>
			</DialogActions>
		</Dialog>
	);
};
