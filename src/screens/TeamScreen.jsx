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
	CircularProgress,
	Collapse,
	Chip,
} from "@mui/material";
import { UserPlus, Edit, Trash2, ArrowLeft, ChevronDown, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTeamStore } from "../stores/teamStore";
import { useUserCompanyStore } from "../stores/userCompanyStore";
import { TeamDialog } from "../components/team/TeamDialog";
import { TeamMemberDialog } from "../components/team/TeamMemberDialog";

export default function TeamScreen() {
	const navigate = useNavigate();
	const { teams, fetchTeams, removeTeam, loading, error } = useTeamStore();
	const { getActiveCompany } = useUserCompanyStore();
	const [teamDialogOpen, setTeamDialogOpen] = useState(false);
	const [memberDialogOpen, setMemberDialogOpen] = useState(false);
	const [editTeam, setEditTeam] = useState(null);
	const [selectedTeam, setSelectedTeam] = useState(null);
	const [expandedTeams, setExpandedTeams] = useState({});

	const activeCompany = getActiveCompany();

	useEffect(() => {
		if (activeCompany?.id) {
			fetchTeams(activeCompany.id);
		}
		return () => {
			const { cleanup } = useTeamStore.getState();
			cleanup();
		};
	}, [activeCompany?.id, fetchTeams]);

	const handleAddTeamClick = () => {
		setEditTeam(null);
		setTeamDialogOpen(true);
	};

	const handleEditTeamClick = (team) => {
		setEditTeam(team);
		setTeamDialogOpen(true);
	};

	const handleDeleteTeamClick = async (teamId) => {
		if (window.confirm("Are you sure you want to remove this team?")) {
			await removeTeam(teamId);
		}
	};

	const handleAddMemberClick = (team) => {
		setSelectedTeam(team);
		setMemberDialogOpen(true);
	};

	const toggleTeamExpanded = (teamId) => {
		setExpandedTeams((prev) => ({
			...prev,
			[teamId]: !prev[teamId],
		}));
	};

	if (!activeCompany) {
		return (
			<Box sx={{ p: 3 }}>
				<Typography color='error'>Please select a company first</Typography>
			</Box>
		);
	}

	if (loading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
				<CircularProgress />
			</Box>
		);
	}

	if (error) {
		return <Box sx={{ p: 3, color: "error.main" }}>Error: {error}</Box>;
	}

	return (
		<Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
			<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
				<Box>
					<Typography variant='h4' sx={{ fontWeight: "bold" }}>
						Teams
					</Typography>
					<Typography variant='subtitle1' color='text.secondary'>
						{activeCompany.legalBusinessName}
					</Typography>
				</Box>
				<Button variant='contained' startIcon={<UserPlus size={20} />} onClick={handleAddTeamClick} sx={{ px: 3 }}>
					Add Team
				</Button>
			</Box>

			<TableContainer component={Paper} sx={{ flex: 1 }}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell width='40px'></TableCell>
							<TableCell>Name</TableCell>
							<TableCell>Description</TableCell>
							<TableCell>Members</TableCell>
							<TableCell align='right'>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{teams.map((team) => (
							<React.Fragment key={team.id}>
								<TableRow hover>
									<TableCell>
										<IconButton size='small' onClick={() => toggleTeamExpanded(team.id)}>
											{expandedTeams[team.id] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
										</IconButton>
									</TableCell>
									<TableCell>{team.name}</TableCell>
									<TableCell>{team.description || "-"}</TableCell>
									<TableCell>{team.members?.length || 0}</TableCell>
									<TableCell align='right'>
										<Button
											size='small'
											startIcon={<UserPlus size={16} />}
											onClick={() => handleAddMemberClick(team)}
											sx={{ mr: 1 }}
										>
											Add Member
										</Button>
										<IconButton onClick={() => handleEditTeamClick(team)} size='small' title='Edit Team'>
											<Edit size={18} />
										</IconButton>
										<IconButton
											onClick={() => handleDeleteTeamClick(team.id)}
											size='small'
											color='error'
											title='Remove Team'
										>
											<Trash2 size={18} />
										</IconButton>
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
										<Collapse in={expandedTeams[team.id]} timeout='auto' unmountOnExit>
											<Box sx={{ margin: 1 }}>
												<Typography variant='h6' gutterBottom component='div'>
													Team Members
												</Typography>
												<Table size='small'>
													<TableHead>
														<TableRow>
															<TableCell>Name</TableCell>
															<TableCell>Role</TableCell>
															<TableCell>Email</TableCell>
															<TableCell>Phone</TableCell>
															<TableCell align='right'>Actions</TableCell>
														</TableRow>
													</TableHead>
													<TableBody>
														{team.members?.map((member) => (
															<TableRow key={member.id}>
																<TableCell>
																	{member.contact.firstName} {member.contact.lastName}
																</TableCell>
																<TableCell>
																	<Chip label={member.role} size='small' />
																</TableCell>
																<TableCell>{member.contact.contactEmail || "-"}</TableCell>
																<TableCell>{member.contact.contactBusinessPhone || "-"}</TableCell>
																<TableCell align='right'>
																	<IconButton
																		size='small'
																		color='error'
																		onClick={() => handleRemoveMember(member.id)}
																	>
																		<Trash2 size={16} />
																	</IconButton>
																</TableCell>
															</TableRow>
														))}
														{(!team.members || team.members.length === 0) && (
															<TableRow>
																<TableCell colSpan={5} align='center'>
																	No team members
																</TableCell>
															</TableRow>
														)}
													</TableBody>
												</Table>
											</Box>
										</Collapse>
									</TableCell>
								</TableRow>
							</React.Fragment>
						))}
						{teams.length === 0 && (
							<TableRow>
								<TableCell colSpan={5} align='center'>
									No teams found
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>

			<TeamDialog
				open={teamDialogOpen}
				onClose={() => {
					setTeamDialogOpen(false);
					setEditTeam(null);
				}}
				editTeam={editTeam}
				companyId={activeCompany.id}
			/>

			<TeamMemberDialog
				open={memberDialogOpen}
				onClose={() => {
					setMemberDialogOpen(false);
					setSelectedTeam(null);
				}}
				team={selectedTeam}
				companyId={activeCompany.id}
			/>
		</Box>
	);
}
