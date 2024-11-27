export const teamMutations = {
	createTeam: async (client, { name, description, companyId }) => {
		console.log("TeamMutations: Creating team:", { name, description, companyId });
		try {
			const response = await client.models.Team.create({
				name,
				description,
				companyId,
			});
			console.log("TeamMutations: Team created:", response);
			return response;
		} catch (err) {
			console.error("TeamMutations: Error creating team:", err);
			throw err;
		}
	},

	updateTeam: async (client, id, updates) => {
		console.log("TeamMutations: Updating team:", { id, updates });
		try {
			const response = await client.models.Team.update({
				id,
				...updates,
			});
			console.log("TeamMutations: Team updated:", response);
			return response;
		} catch (err) {
			console.error("TeamMutations: Error updating team:", err);
			throw err;
		}
	},

	deleteTeam: async (client, teamId) => {
		console.log("TeamMutations: Deleting team:", teamId);
		try {
			// First delete all team members
			const teamMembers = await client.models.TeamMember.list({
				filter: { teamId: { eq: teamId } },
			});

			console.log("TeamMutations: Deleting team members:", teamMembers.data);
			for (const member of teamMembers.data) {
				await client.models.TeamMember.delete({ id: member.id });
			}

			// Then delete the team
			await client.models.Team.delete({ id: teamId });
			console.log("TeamMutations: Team deleted successfully");
		} catch (err) {
			console.error("TeamMutations: Error deleting team:", err);
			throw err;
		}
	},

	addTeamMember: async (client, { teamId, contactId, role }) => {
		console.log("TeamMutations: Adding team member:", { teamId, contactId, role });
		try {
			const response = await client.models.TeamMember.create({
				teamId,
				contactId,
				role,
			});
			console.log("TeamMutations: Team member added:", response);
			return response;
		} catch (err) {
			console.error("TeamMutations: Error adding team member:", err);
			throw err;
		}
	},

	removeTeamMember: async (client, memberId) => {
		console.log("TeamMutations: Removing team member:", memberId);
		try {
			await client.models.TeamMember.delete({ id: memberId });
			console.log("TeamMutations: Team member removed successfully");
		} catch (err) {
			console.error("TeamMutations: Error removing team member:", err);
			throw err;
		}
	},
};
