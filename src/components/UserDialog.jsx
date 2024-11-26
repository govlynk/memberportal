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
	CircularProgress,
} from "@mui/material";
import { useCompanyStore } from "../stores/companyStore";
import { useUserStore } from "../stores/userStore";
import { useUserCompanyRoleStore } from "../stores/userCompanyRoleStore";
import { useAuthStore } from "../stores/authStore";
import { generateClient } from "aws-amplify/data";

const client = generateClient({
	authMode: "userPool",
});

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
	const [loading, setLoading] = useState(false);
	const { companies, fetchCompanies } = useCompanyStore();
	const { addUser, updateUser } = useUserStore();
	const { addUserCompanyRole, removeUserCompanyRole } = useUserCompanyRoleStore();
	const currentUser = useAuthStore((state) => state.user);
	const [userCompanyRoles, setUserCompanyRoles] = useState([]);
	const [debug, setDebug] = useState({});

	// Fetch initial data
	useEffect(() => {
		if (open) {
			fetchCompanies();
			if (editUser?.id) {
				fetchUserCompanyRoles(editUser.id);
			}
		}
	}, [open, editUser?.id]);

	// Fetch user's company roles
	const fetchUserCompanyRoles = async (userId) => {
		try {
			const response = await client.models.UserCompanyRole.list({
				filter: { userId: { eq: userId } },
			});

			if (response?.data) {
				setUserCompanyRoles(response.data);

				// Fetch company details for each companyId
				const companyIds = response.data.map((role) => role.companyId);
				const companiesResponse = await Promise.all(
					companyIds.map((companyId) => client.models.Company.get({ id: companyId }))
				);
				const selectedCompanies = companiesResponse.map((res) => res.data);

				setFormData((prev) => ({
					...prev,
					selectedCompanies,
				}));
			}
		} catch (err) {
			console.error("Error fetching user company roles:", err);
			setError("Failed to fetch user's company associations");
		}
	};

	// Set initial form data when editing
	useEffect(() => {
		if (editUser) {
			setFormData({
				cognitoId: editUser.cognitoId || "",
				email: editUser.email || "",
				name: editUser.name || "",
				phone: editUser.phone || "",
				status: editUser.status || "ACTIVE",
				selectedCompanies: [], // Will be populated by fetchUserCompanyRoles
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

	const handleCompanyChange = async (event, newValue) => {
		const newCompanies = newValue || [];
		setFormData((prev) => ({
			...prev,
			selectedCompanies: newCompanies,
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

		setLoading(true);
		try {
			const userData = {
				cognitoId: formData.cognitoId || currentUser?.sub,
				email: formData.email.trim(),
				name: formData.name.trim(),
				phone: formData.phone?.trim() || "",
				status: formData.status,
				lastLogin: new Date().toISOString(),
			};

			let savedUser;
			if (editUser) {
				savedUser = await updateUser(editUser.id, userData);

				// Handle company associations
				const currentCompanyIds = formData.selectedCompanies.map((c) => c.id);
				const existingCompanyIds = userCompanyRoles.map((role) => role.companyId);

				// Remove associations that are no longer selected
				const toRemove = userCompanyRoles.filter((role) => !currentCompanyIds.includes(role.companyId));

				for (const role of toRemove) {
					await removeUserCompanyRole(role.id);
				}

				// Add new associations
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

				// Create company associations for new user
				for (const company of formData.selectedCompanies) {
					console.log("Adding role for company:", company.id);
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
			setError(err.message || "Failed to save user. Please check your input and try again.");
		} finally {
			setLoading(false);
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
						disabled={loading}
					/>
					<TextField
						fullWidth
						required
						label='Name'
						name='name'
						value={formData.name}
						onChange={handleChange}
						error={!formData.name && Boolean(error)}
						disabled={loading}
					/>
					<TextField
						fullWidth
						label='Phone'
						name='phone'
						value={formData.phone}
						onChange={handleChange}
						disabled={loading}
					/>
					<FormControl fullWidth disabled={loading}>
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
						disabled={loading}
						renderInput={(params) => (
							<TextField {...params} label='Associated Companies' placeholder='Select companies' />
						)}
						renderTags={(value, getTagProps) =>
							value.map((company, index) => (
								<Chip
									key={company.id}
									label={company.legalBusinessName}
									{...getTagProps({ index })}
									disabled={loading}
								/>
							))
						}
						isOptionEqualToValue={(option, value) => option?.id === value?.id}
					/>
				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} disabled={loading}>
					Cancel
				</Button>
				<Button onClick={handleSubmit} variant='contained' disabled={loading}>
					{loading ? "Saving..." : editUser ? "Save Changes" : "Add User"}
				</Button>
			</DialogActions>
		</Dialog>
	);
};
