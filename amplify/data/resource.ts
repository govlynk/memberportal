import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { type DefaultAuthorizationMode } from "@aws-amplify/backend-data";

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
		.authorization((allow) => [allow.owner(), allow.group("Admin").to(["create", "read", "update", "delete"])]),

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
			activationDate: a.datetime(),
			billingAddressCity: a.string(),
			billingAddressCountryCode: a.string(),
			billingAddressStateCode: a.string(),
			billingAddressStreetLine1: a.string(),
			billingAddressStreetLine2: a.string(),
			billingAddressZipCode: a.string(),
			companyStartDate: a.datetime(),
			congressionalDistrict: a.string(),
			coreCongressionalDistrict: a.string(),
			countryOfIncorporationCode: a.string(),
			entityDivisionName: a.string(),
			entityStartDate: a.datetime(),
			entityStructureDesc: a.string(),
			entityTypeDesc: a.string(),
			exclusionStatusFlag: a.string(),
			expirationDate: a.datetime(),
			fiscalYearEndCloseDate: a.string(),
			lastUpdateDate: a.datetime(),
			organizationStructureDesc: a.string(),
			primaryNaics: a.string(),
			profitStructureDesc: a.string(),
			purposeOfRegistrationDesc: a.string(),
			registrationDate: a.datetime(),
			registrationExpirationDate: a.datetime(),
			registrationStatus: a.string(),
			shippingAddressCity: a.string(),
			shippingAddressCountryCode: a.string(),
			shippingAddressStateCode: a.string(),
			shippingAddressStreetLine1: a.string(),
			shippingAddressStreetLine2: a.string(),
			shippingAddressZipCode: a.string(),
			stateOfIncorporationCode: a.string(),
			submissionDate: a.datetime(),
			SAMPullDate: a.datetime(),
			certificationEntryDate: a.datetime().array(),
			keyWords: a.string().array(),
			naicsCode: a.string().array(),
			pscCode: a.string().array(),
			sbaBusinessTypeDesc: a.string().array(),
			entityURL: a.url(),
			status: a.enum(["ACTIVE", "INACTIVE", "PENDING"]),
			users: a.hasMany("UserCompanyRole", "companyId"),
			teams: a.hasMany("Team", "companyId"),
		})
		.authorization((allow) => [allow.owner(), allow.group("Admin").to(["create", "read", "update", "delete"])]),

	Role: a
		.model({
			name: a.string().required(),
			description: a.string(),
			permissions: a.string().array(),
			userCompanyRoles: a.hasMany("UserCompanyRole", "roleId"),
		})
		.authorization((allow) => [allow.group("Admin").to(["create", "read", "update", "delete"])]),

	UserCompanyRole: a
		.model({
			userId: a.string().required(),
			companyId: a.string().required(),
			roleId: a.string().required(),
			status: a.enum(["ACTIVE", "INACTIVE"]),
			user: a.belongsTo("User", "userId"),
			company: a.belongsTo("Company", "companyId"),
			role: a.belongsTo("Role", "roleId"),
		})
		.authorization((allow) => [allow.owner(), allow.group("Admin").to(["create", "read", "update", "delete"])]),

	Team: a
		.model({
			companyId: a.string().required(),
			contactId: a.string().required(),
			role: a.string().required(),
			company: a.belongsTo("Company", "companyId"),
			contact: a.belongsTo("Contact", "contactId"),
		})
		.authorization((allow) => [allow.owner(), allow.group("Admin").to(["create", "read", "update", "delete"])]),

	Contact: a
		.model({
			firstName: a.string().required(),
			lastName: a.string().required(),
			title: a.string(),
			department: a.string(),
			contactEmail: a.email({ pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }),
			contactMobilePhone: a.string({ pattern: /^\+?[1-9]\d{1,14}$/ }),
			contactBusinessPhone: a.string({ pattern: /^\+?[1-9]\d{1,14}$/ }),
			workAddressStreetLine1: a.string(),
			workAddressStreetLine2: a.string(),
			workAddressCity: a.string(),
			workAddressStateCode: a.string({ pattern: /^[A-Z]{2}$/ }), // US state code format
			workAddressZipCode: a.string({ pattern: /^\d{5}(-\d{4})?$/ }), // US ZIP code format
			workAddressCountryCode: a.string({ pattern: /^[A-Z]{2}$/ }), // ISO country code format
			dateLastContacted: a.datetime(),
			notes: a.string(),
			teams: a.hasMany("Team", "contactId"),
		})
		.authorization((allow) => [allow.owner(), allow.group("Admin").to(["create", "read", "update", "delete"])]),

	Todo: a
		.model({
			title: a.string().required(),
			description: a.string().required(),
			status: a.enum(["TODO", "DOING", "DONE"]),
			priority: a.enum(["LOW", "MEDIUM", "HIGH"]),
			dueDate: a.datetime(),
			estimatedEffort: a.float(),
			actualEffort: a.float(),
			tags: a.string().array(),
			position: a.integer().required(),
			assigneeId: a.string(),
			assignee: a.belongsTo("User", "assigneeId"),
		})
		.authorization((allow) => [allow.owner(), allow.group("Admin").to(["create", "read", "update", "delete"])]),
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
