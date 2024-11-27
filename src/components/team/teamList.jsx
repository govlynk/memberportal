import React, { useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	IconButton,
	Button,
	Collapse,
	Box,
	Typography,
} from "@mui/material";
import { ChevronDown, ChevronRight, Edit, Trash2, UserPlus } from "lucide-react";
import { TeamMemberList } from "./TeamMemberList";

export function TeamList({ teams = [], onEditTeam, onDeleteTeam, onAddMember, onRemoveMember }) {
	const [expandedTeams, setExpandedTeams] = useState({});

	const toggleTeamExpanded = (teamId) => {
		setExpandedTeams((prev) => ({
			...prev,
			[teamId]: !prev[teamId],
		}));
	};

	if (!teams || teams.length === 0) {
		return (
			<TableContainer component={Paper}>
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
						<TableRow>
							<TableCell colSpan={5} align='center'>
								<Typography variant='body2' color='text.secondary'>
									No teams found
								</Typography>
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</TableContainer>
		);
	}

	return (
		<TableContainer component={Paper}>
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
										onClick={() => onAddMember(team)}
										sx={{ mr: 1 }}
									>
										Add Member
									</Button>
									<IconButton onClick={() => onEditTeam(team)} size='small' title='Edit Team'>
										<Edit size={18} />
									</IconButton>
									<IconButton
										onClick={() => onDeleteTeam(team.id)}
										size='small'
										color='error'
										title='Remove Team'
									>
										<Trash2 size={18} />
									</IconButton>
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
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
													<TeamMemberList
														members={team.members}
														onRemoveMember={(memberId) => onRemoveMember(team.id, memberId)}
													/>
												</TableBody>
											</Table>
										</Box>
									</Collapse>
								</TableCell>
							</TableRow>
						</React.Fragment>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
