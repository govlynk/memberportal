import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { type DefaultAuthorizationMode } from "@aws-amplify/backend-data";

const AUTH_TYPES = [
	"GOVLYNK_ADMIN",
	"GOVLYNK_CONSULTANT",
	"GOVLYNK_USER",
	"COMPANY_ADMIN",
	"COMPANY_USER",
	"VIEWER",
] as const;

const COMPANY_ROLES = [
	"Executive",
	"Sales",
	"Marketing",
	"Finance",
	"Risk",
	"Technology",
	"Engineering",
	"Operations",
	"Human Resources",
	"Legal",
	"Contracting",
	"Servicing",
	"Other",
] as const;

const schema = a.schema({
	User: a
		.model({
			cognitoId: a.string().required(),
			fullName: a.string().required(),
			email: a.email().required(),
			phone: a.string(),
			status: a.enum(["ACTIVE", "INACTIVE"]),
			companyName: a.string().array(),
			uei: a.string().array(),
			auth: a.enum(AUTH_TYPES),
			lastLogin: a.datetime(),
			contact: a.belongsTo("Contact"),
			todos: a.hasMany("Todo"),
		})
		.authorization([a.allow.owner(), a.allow.group("Admin", ["create", "read", "update", "delete"])]),

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
			notes: a.string(),
			role: a.enum(COMPANY_ROLES),
			user: a.hasOne("User"),
		})
		.authorization([a.allow.owner(), a.allow.group("Admin", ["create", "read", "update", "delete"])]),

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
			users: a.hasMany("UserCompanyRole"),
			teams: a.hasMany("Team"),
		})
		.authorization([a.allow.owner(), a.allow.group("Admin", ["create", "read", "update", "delete"])]),

	UserCompanyRole: a
		.model({
			userId: a.string().required(),
			companyId: a.string().required(),
			roleId: a.string().required(),
			user: a.belongsTo("User"),
			company: a.belongsTo("Company"),
			status: a.enum(["ACTIVE", "INACTIVE"]),
		})
		.authorization([a.allow.owner(), a.allow.group("Admin", ["create", "read", "update", "delete"])]),

	Team: a
		.model({
			companyId: a.string().required(),
			contactId: a.string().required(),
			role: a.enum(COMPANY_ROLES),
			company: a.belongsTo("Company"),
			contact: a.belongsTo("Contact"),
		})
		.authorization([a.allow.owner(), a.allow.group("Admin", ["create", "read", "update", "delete"])]),

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
			assignee: a.belongsTo("User"),
		})
		.authorization([a.allow.owner(), a.allow.group("Admin", ["create", "read", "update", "delete"])]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
	schema,
	authorizationModes: {
		defaultAuthorizationMode: "userPool" as DefaultAuthorizationMode,
		apiKeyAuthorizationMode: {
			expiresInDays: 30,
		},
	},
});
