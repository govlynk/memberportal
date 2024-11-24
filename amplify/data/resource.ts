import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { type DefaultAuthorizationMode } from "@aws-amplify/backend-data";

const schema = a.schema({
	User: a
		.model({
			cognitoId: a.string().required(),
			fullName: a.string().required(),
			email: a.email().required(),
			phone: a.string(),
			status: a.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
			companyName: a.string().array(),
			uei: a.string().array(),
			auth: a
				.enum(["GOVLYNK_ADMIN", "GOVLYNK_CONSULTANT", "GOVLYNK_USER", "COMPANY_ADMIN", "COMPANY_USER", "VIEWER"])
				.required(),
			lastLogin: a.datetime(),
			contact: a.belongsTo("Contact", "contactId"),
			todos: a.hasMany("Todo", "assigneeId"),
		})
		.authorization((allow) => [allow.owner(), allow.group("Admin").to(["create", "read", "update", "delete"])]),

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
			role: a
				.enum([
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
				])
				.required(),
			user: a.hasOne("User"),
		})
		.authorization((allow) => [allow.owner(), allow.group("Admin").to(["create", "read", "update", "delete"])]),

	// ... rest of the schema remains unchanged
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
