import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
	User: a
		.model({
			cognitoId: a.string().required(),
			email: a.email().required(),
			name: a.string().required(),
			phone: a.string(),
			status: a.enum(["ACTIVE", "INACTIVE"]),
			lastLogin: a.datetime(),
			companies: a.hasMany("UserCompanyRole", "userId"),
			todos: a.hasMany("Todo", "assigneeId"),
		})
		.authorization((allow) => [allow.owner(), allow.groups(["Admin"]).to(["read", "create", "update", "delete"])]),

	Company: a
		.model({
			legalBusinessName: a.string().required(),
			dbaName: a.string(),
			uei: a.string().required(),
			cageCode: a.string(),
			ein: a.string(),
			companyEmail: a.email(),
			companyPhoneNumber: a.string(),
			companyWebsite: a.url(),
			status: a.enum(["ACTIVE", "INACTIVE", "PENDING"]),
			users: a.hasMany("UserCompanyRole", "companyId"),
			teams: a.hasMany("Team", "companyId"),
		})
		.authorization((allow) => [allow.owner(), allow.groups(["Admin"]).to(["read", "create", "update", "delete"])]),

	Role: a
		.model({
			name: a.string().required(),
			description: a.string(),
			permissions: a.string().array(),
			userCompanyRoles: a.hasMany("UserCompanyRole", "roleId"),
		})
		.authorization((allow) => [allow.groups(["Admin"]).to(["read", "create", "update", "delete"])]),

	UserCompanyRole: a
		.model({
			userId: a.string().required(),
			companyId: a.string().required(),
			roleId: a.string().required(),
			user: a.belongsTo("User", "userId"),
			company: a.belongsTo("Company", "companyId"),
			role: a.belongsTo("Role", "roleId"),
			status: a.enum(["ACTIVE", "INACTIVE"]),
		})
		.authorization((allow) => [allow.owner(), allow.groups(["Admin"]).to(["read", "create", "update", "delete"])]),

	Team: a
		.model({
			companyId: a.string().required(),
			contactId: a.string().required(),
			role: a.string().required(),
			company: a.belongsTo("Company", "companyId"),
			contact: a.belongsTo("Contact", "contactId"),
		})
		.authorization((allow) => [allow.owner(), allow.groups(["Admin"]).to(["read", "create", "update", "delete"])]),

	Contact: a
		.model({
			firstName: a.string().required(),
			lastName: a.string().required(),
			title: a.string(),
			department: a.string(),
			contactEmail: a.email(),
			contactMobilePhone: a.string(),
			contactBusinessPhone: a.string(),
			workAddressStreetLine1: a.string(),
			workAddressStreetLine2: a.string(),
			workAddressCity: a.string(),
			workAddressStateCode: a.string(),
			workAddressZipCode: a.string(),
			workAddressCountryCode: a.string(),
			dateLastContacted: a.datetime(),
			notes: a.string(),
			teams: a.hasMany("Team", "contactId"),
		})
		.authorization((allow) => [allow.owner(), allow.groups(["Admin"]).to(["read", "create", "update", "delete"])]),

	Todo: a
		.model({
			title: a.string().required(),
			description: a.string().required(),
			status: a.enum(["TODO", "DOING", "DONE"]),
			priority: a.enum(["LOW", "MEDIUM", "HIGH"]),
			dueDate: a.datetime().required(),
			estimatedEffort: a.float(),
			actualEffort: a.float(),
			tags: a.string().array(),
			position: a.integer().required(),
			assigneeId: a.string(),
			assignee: a.belongsTo("User", "assigneeId"),
		})
		.authorization((allow) => [allow.owner(), allow.groups(["Admin"]).to(["read", "create", "update", "delete"])]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
	schema,
	authorizationModes: {
		defaultAuthorizationMode: "userPool",
		apiKeyAuthorizationMode: {
			expiresInDays: 30,
		},
	},
});
