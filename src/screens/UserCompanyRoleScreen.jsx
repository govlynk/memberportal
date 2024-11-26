import React, { useEffect, useState } from "react";
import {
	Box,
	Button,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
	IconButton,
	Chip,
	CircularProgress,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Alert,
} from "@mui/material";
import { Edit, Trash2, UserPlus } from "lucide-react";
import { UserCompanyRoleDialog } from "../components/userCompanyRole/UserCompanyRoleDialog";
import { useUserCompanyRoleStore } from "../stores/userCompanyRoleStore";
import { generateClient } from "aws-amplify/data";

const client = generateClient({
	authMode: "userPool",
});

export default function UserCompanyRoleScreen() {
	const { userCompanyRoles, fetchUserCompanyRoles, setUserCompanyRoles, removeUserCompanyRole, loading, error } =
		useUserCompanyRoleStore();
	const [companies, setCompanies] = useState([]);
	const [selectedCompany, setSelectedCompany] = useState("");
	const [users, setUsers] = useState([]);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editRole, setEditRole] = useState(null);

	useEffect(() => {
		fetchCompanies();
	}, []);

	useEffect(() => {
		if (selectedCompany) {
			fetchUserCompanyRoles(selectedCompany)
				.then((roles) => {
					if (roles && roles.length > 0) {
						const userIds = roles.map((role) => role.userId);
						fetchUsers(userIds);
					} else {
						setUsers([]);
					}
				})
				.catch((err) => {
					console.error("Failed to fetch user-company roles", err);
					setUsers([]);
				});
		}
	}, [selectedCompany, fetchUserCompanyRoles]);

	const fetchCompanies = async () => {
		try {
			const response = await client.models.Company.list();
			console.log("Fetched companies:", response.data);
			setCompanies(response.data);
		} catch (err) {
			console.error("Failed to fetch companies", err);
		}
	};

	const fetchUsers = async (userIds) => {
		try {
			const response = await client.models.User.list({
				filter: { id: { in: userIds } },
			});
			console.log("Fetched users:", response.data);
			setUsers(response.data);
		} catch (err) {
			console.error("Failed to fetch users", err);
		}
	};

	const getUserDetails = (userId) => {
		return users.find((user) => user.id === userId) || {};
	};

	const handleCompanyChange = (event) => {
		setSelectedCompany(event.target.value);
	};

	const handleAddClick = () => {
		if (!selectedCompany) {
			alert("Please select a company first");
			return;
		}
		setEditRole(null);
		setDialogOpen(true);
	};

	const handleEditClick = (role) => {
		setEditRole(role);
		setDialogOpen(true);
	};

	const handleDeleteClick = async (role) => {
		if (!window.confirm("Are you sure you want to delete this user-company role?")) {
			return;
		}
		try {
			await removeUserCompanyRole(role.id);
		} catch (err) {
			console.error("Failed to delete user-company role", err);
		}
	};

	return (
		<Box>
			{error && (
				<Alert severity='error' sx={{ mb: 3 }}>
					{error}
				</Alert>
			)}

			<FormControl fullWidth sx={{ mb: 3 }}>
				<InputLabel id='company-select-label'>Select Company</InputLabel>
				<Select
					labelId='company-select-label'
					value={selectedCompany}
					label='Select Company'
					onChange={handleCompanyChange}
				>
					{companies.map((company) => (
						<MenuItem key={company.id} value={company.id}>
							{company.legalBusinessName}
						</MenuItem>
					))}
				</Select>
			</FormControl>

			{loading ? (
				<Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
					<CircularProgress />
				</Box>
			) : (
				<TableContainer component={Paper}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>User</TableCell>
								<TableCell>Role</TableCell>
								<TableCell>Status</TableCell>
								<TableCell align='right'>Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{userCompanyRoles.map((role) => {
								const user = getUserDetails(role.userId);
								console.log("User details:", user); // Debugging statement
								return (
									<TableRow key={role.id} hover>
										<TableCell>{user.name}</TableCell>
										<TableCell>{role.roleId}</TableCell>
										<TableCell>
											<Chip label={role.status} color={role.status === "ACTIVE" ? "success" : "default"} />
										</TableCell>
										<TableCell align='right'>
											<IconButton onClick={() => handleEditClick(role)}>
												<Edit />
											</IconButton>
											<IconButton onClick={() => handleDeleteClick(role)}>
												<Trash2 />
											</IconButton>
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</TableContainer>
			)}

			<Button variant='contained' color='primary' startIcon={<UserPlus />} onClick={handleAddClick} sx={{ mt: 3 }}>
				Add User Role
			</Button>

			<UserCompanyRoleDialog
				open={dialogOpen}
				onClose={() => setDialogOpen(false)}
				companyId={selectedCompany}
				role={editRole}
			/>
		</Box>
	);
}
