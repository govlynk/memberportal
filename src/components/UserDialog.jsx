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
import { useUserCompanyRoleStore } from "../stores/userCompanyRoleStore";
import { useAuthStore } from "../stores/authStore";

const initialFormState = {
	cognitoId: "",
	email: "",
	name: "",
	phone: "",
	status: "ACTIVE",
	selectedCompanies: [],
};

export const UserDialog = ({ open, onClose, editUser = null }) => {
	const [formData, setFormData] = useState(initialFormState);
	const [error, setError] = useState(null);
	const { companies, fetchCompanies } = useCompanyStore();
	const { addUser, updateUser } = useUserStore();
	const { addUserCompanyRole, removeUserCompanyRole, fetchUserCompanyRoles } = useUserCompanyRoleStore();
	const currentUser = useAuthStore((state) => state.user);

	useEffect(() => {
		if (open) {
			fetchCompanies();
			if (editUser?.id) {
				fetchUserCompanyRoles(editUser.id);
			}
		}
	}, [open, editUser?.id, fetchCompanies, fetchUserCompanyRoles]);

	useEffect(() => {
		if (editUser) {
			let userCompanies = [];
			if (editUser.companies?.items) {
				userCompanies = editUser.companies.items.map((item) => item.company).filter(Boolean);
			} else if (Array.isArray(editUser.companies)) {
				userCompanies = editUser.companies;
			}

			setFormData({
				cognitoId: editUser.cognitoId || "",
				email: editUser.email || "",
				name: editUser.name || "",
				phone: editUser.phone || "",
				status: editUser.status || "ACTIVE",
				selectedCompanies: userCompanies,
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
			selectedCompanies: newValue || [],
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
		if (!currentUser?.sub) {
			setError("You must be logged in to perform this action");
			return false;
		}
		return true;
	};

	const handleSubmit = async () => {
		if (!validateForm()) return;

		try {
			const userData = {
				cognitoId: formData.cognitoId || currentUser.sub,
				email: formData.email.trim(),
				name: formData.name.trim(),
				phone: formData.phone?.trim() || "",
				status: formData.status,
				lastLogin: new Date().toISOString(),
			};

			let savedUser;
			if (editUser) {
				savedUser = await updateUser(editUser.id, userData);

				const currentCompanyIds = formData.selectedCompanies.map((c) => c.id);
				const existingCompanyIds = editUser.companies?.items?.map((c) => c.companyId) || [];

				const toRemove = existingCompanyIds.filter((id) => !currentCompanyIds.includes(id));
				for (const companyId of toRemove) {
					const association = editUser.companies?.items?.find((c) => c.companyId === companyId);
					if (association?.id) {
						await removeUserCompanyRole(association.id);
					}
				}

				const toAdd = currentCompanyIds.filter((id) => !existingCompanyIds.includes(id));
				for (const companyId of toAdd) {
					await addUserCompanyRole({
						userId: editUser.id,
						companyId,
						roleId: "MEMBER",
						status: "ACTIVE",
					});
				}
			} else {
				savedUser = await addUser(userData);

				for (const company of formData.selectedCompanies) {
					await addUserCompanyRole({
						userId: savedUser.id,
						companyId: company.id,
						roleId: "MEMBER",
						status: "ACTIVE",
					});
				}
			}

			onClose();
		} catch (err) {
			console.error("Error saving user:", err);
			setError(err.message || "Failed to save user. Please check your input and try again.");
		}
	};

	const renderCompanyChip = (props, company, index) => {
		const { onDelete } = props;
		return <Chip key={company.id} label={company.legalBusinessName} onDelete={onDelete} size='small' />;
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
						value={formData.selectedCompanies}
						onChange={handleCompanyChange}
						renderInput={(params) => (
							<TextField {...params} label='Associated Companies' placeholder='Select companies' />
						)}
						renderTags={(tagValue, getTagProps) =>
							tagValue.map((company, index) => renderCompanyChip(getTagProps({ index }), company, index))
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
