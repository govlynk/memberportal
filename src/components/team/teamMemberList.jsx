import React from "react";
import { TableCell, TableRow, Chip, IconButton, Typography } from "@mui/material";
import { Trash2 } from "lucide-react";

export function TeamMemberList({ members = [], onRemoveMember }) {
	if (!members || members.length === 0) {
		return (
			<TableRow>
				<TableCell colSpan={5} align='center'>
					<Typography variant='body2' color='text.secondary'>
						No team members
					</Typography>
				</TableCell>
			</TableRow>
		);
	}

	return (
		<>
			{members.map((member) => (
				<TableRow key={member.id} hover>
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
							onClick={() => onRemoveMember(member.id)}
							size='small'
							color='error'
							title='Remove Member'
						>
							<Trash2 size={16} />
						</IconButton>
					</TableCell>
				</TableRow>
			))}
		</>
	);
}
