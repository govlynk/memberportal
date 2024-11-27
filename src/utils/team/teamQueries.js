export const teamQueries = {
	observeTeams: (client, companyId) => {
		console.log("TeamQueries: Starting observeTeams for companyId:", companyId);
		try {
			const query = client.models.Team.observeQuery({
				filter: { companyId: { eq: companyId } },
				include: {
					company: true,
					members: {
						include: {
							contact: true,
						},
					},
				},
			});
			console.log("TeamQueries: Query created successfully");
			return query;
		} catch (err) {
			console.error("TeamQueries: Error creating query:", err);
			throw err;
		}
	},

	getTeamMembers: async (client, teamId) => {
		console.log("TeamQueries: Getting team members for teamId:", teamId);
		try {
			const response = await client.models.TeamMember.list({
				filter: { teamId: { eq: teamId } },
				include: {
					contact: true,
				},
			});
			console.log("TeamQueries: Team members retrieved:", response.data);
			return response.data;
		} catch (err) {
			console.error("TeamQueries: Error getting team members:", err);
			throw err;
		}
	},

	getAvailableContacts: async (client, companyId, teamId) => {
		console.log("TeamQueries: Getting available contacts for companyId:", companyId);
		try {
			// Get all contacts for the company
			const contactsResponse = await client.models.Contact.list({
				filter: { companyId: { eq: companyId } },
			});

			// Get existing team members
			const teamMembersResponse = await client.models.TeamMember.list({
				filter: { teamId: { eq: teamId } },
			});

			// Filter out contacts that are already team members
			const existingContactIds = teamMembersResponse.data.map((member) => member.contactId);
			const availableContacts = contactsResponse.data.filter((contact) => !existingContactIds.includes(contact.id));

			console.log("TeamQueries: Available contacts:", availableContacts);
			return availableContacts;
		} catch (err) {
			console.error("TeamQueries: Error getting available contacts:", err);
			throw err;
		}
	},
};
