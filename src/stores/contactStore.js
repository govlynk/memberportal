import { create } from "zustand";
import { generateClient } from "aws-amplify/data";

const client = generateClient({
	authMode: "userPool",
});

export const useContactStore = create((set, get) => ({
	contacts: [],
	loading: false,
	error: null,
	subscription: null,

	fetchContacts: async (companyId) => {
		set({ loading: true });
		try {
			const subscription = client.models.Contact.observeQuery({
				filter: { companyId: { eq: companyId } },
				include: {
					user: true,
					teams: {
						include: {
							team: true,
						},
					},
				},
			}).subscribe({
				next: ({ items }) => {
					set({
						contacts: items,
						loading: false,
					});
				},
				error: (err) => {
					console.error("Fetch contacts error:", err);
					set({ error: "Failed to fetch contacts", loading: false });
				},
			});
			set({ subscription });
		} catch (err) {
			console.error("Fetch contacts error:", err);
			set({ error: "Failed to fetch contacts", loading: false });
		}
	},

	addContact: async (contactData) => {
		set({ loading: true });
		try {
			const contact = await client.models.Contact.create(contactData);

			set((state) => ({
				contacts: [...state.contacts, contact],
				loading: false,
				error: null,
			}));

			return contact;
		} catch (err) {
			console.error("Create contact error:", err);
			set({ error: err.message || "Failed to create contact", loading: false });
			throw err;
		}
	},

	updateContact: async (id, updates) => {
		try {
			const updatedContact = await client.models.Contact.update({
				id,
				...updates,
			});

			set((state) => ({
				contacts: state.contacts.map((contact) => (contact.id === id ? updatedContact : contact)),
				error: null,
			}));

			return updatedContact;
		} catch (err) {
			console.error("Error updating contact:", err);
			set({ error: "Failed to update contact" });
			throw err;
		}
	},

	removeContact: async (id) => {
		try {
			// First remove all team memberships
			const teamMembers = await client.models.TeamMember.list({
				filter: { contactId: { eq: id } },
			});

			for (const member of teamMembers.data) {
				await client.models.TeamMember.delete({ id: member.id });
			}

			// Then remove the contact
			await client.models.Contact.delete({ id });

			set((state) => ({
				contacts: state.contacts.filter((contact) => contact.id !== id),
				error: null,
			}));
		} catch (err) {
			console.error("Error removing contact:", err);
			set({ error: "Failed to remove contact" });
			throw err;
		}
	},

	cleanup: () => {
		const { subscription } = get();
		if (subscription) {
			subscription.unsubscribe();
		}
	},
}));
