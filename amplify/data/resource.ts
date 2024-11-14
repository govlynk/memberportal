import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/

// Define the enum values

const schema = a.schema({
	User: a
		.model({
			cognitoId: a.string(),
			email: a.email(),
			name: a.string(),
			phone: a.string(),
			status: a.enum(["ACTIVE", "INACTIVE"]),
			lastLogin: a.datetime(),
			companies: a.hasMany("UserCompanyRole", "companyId"),
			assignedTodos: a.hasMany("Todo", "AssigneeId"),
		})
		.authorization((allow) => [allow.publicApiKey(), allow.owner().to(["read"]), allow.groups(["Admin"])]),

	Company: a
		.model({
			legalBusinessName: a.string(),
			dbaName: a.string(),
			uei: a.string(),
			cageCode: a.string(),
			ein: a.string(),
			companyEmail: a.email(),
			companyPhoneNumber: a.string(),
			companyWebsite: a.url(),
			status: a.enum(["ACTIVE", "INACTIVE", "PENDING"]),
			users: a.hasMany("UserCompanyRole", "companyId"),
			teams: a.hasMany("Team", "companyID"),
		})
		.authorization((allow) => [allow.publicApiKey(), allow.owner().to(["read"]), allow.groups(["Admin"])]),

	Role: a
		.model({
			name: a.string(),
			description: a.string(),
			users: a.hasMany("UserCompanyRole", "userId"),
		})
		.authorization((allow) => [allow.publicApiKey(), allow.owner().to(["read"]), allow.groups(["Admin"])]),

	UserCompanyRole: a
		.model({
			userId: a.string(),
			companyId: a.string(),
			roleId: a.string(),
			user: a.belongsTo("User", "userId"),
			company: a.belongsTo("Company", "companyId"),
			role: a.belongsTo("Role", "roleId"),
			status: a.enum(["ACTIVE", "INACTIVE"]),
		})
		.authorization((allow) => [allow.publicApiKey(), allow.owner().to(["read"]), allow.groups(["Admin"])]),

	Team: a
		.model({
			companyID: a.string(),
			contactID: a.string(),
			role: a.string(),
			contact: a.hasOne("Contact", "contactID"),
			company: a.belongsTo("Company", "companyID"),
		})
		.authorization((allow) => [allow.publicApiKey(), allow.owner().to(["read"]), allow.groups(["Admin"])]),

	Contact: a
		.model({
			firstName: a.string(),
			lastName: a.string(),
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
		})
		.authorization((allow) => [allow.publicApiKey(), allow.owner().to(["read"]), allow.groups(["Admin"])]),

	Todo: a
		.model({
			content: a.string(),
			title: a.string(),
			description: a.string(),
			dueDate: a.datetime(),
			estimatedEffort: a.float(),
			actualEffort: a.float(),
			tags: a.string().array(),
			position: a.integer(),
			assigneeId: a.string(),
			assignee: a.belongsTo("User", "assigneeId"),
			priority: a.enum(["LOW", "MEDIUM", "HIGH"]),
			progress: a.enum(["TODO", "DOING", "DONE"]),
		})
		.authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
	schema,
	authorizationModes: {
		defaultAuthorizationMode: "userPool",
		apiKeyAuthorizationMode: {
			expiresInDays: 30,
		},
		iamAuthorizationMode: {
			roleNames: ["adminRole", "readOnlyRole"],
		},
		userPoolAuthorizationMode: {
			groupNames: ["Admin", "CompanyAdmin", "User"],
		},
	},
});
