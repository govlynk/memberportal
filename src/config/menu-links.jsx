import { Home, Users, Contact2, Receipt, User, Medal, ListTodo, Building2, UserCog, Settings } from "lucide-react";

export const menuLinks = [
	{
		id: "home",
		title: "Home",
		icon: Home,
		links: [
			{
				title: "Dashboard",
				path: "/dashboard",
			},
			{
				title: "To Do",
				path: "/todos",
			},
			{
				title: "Welcome",
				path: "/welcome",
			},
		],
	},
	{
		id: "profile",
		title: "Profile",
		icon: Users,
		links: [
			{
				title: "Manage Team",
				path: "/team",
			},
			{
				title: "Manage Users",
				path: "/users",
			},
			{
				title: "SAM Registration",
				path: "/sam",
			},
		],
	},
	{
		id: "leads",
		title: "Leads",
		icon: Contact2,
		links: [
			{
				title: "Opportunities",
				path: "/opportunities",
			},
			{
				title: "Pipeline",
				path: "/pipeline",
			},
		],
	},
	{
		id: "awards",
		title: "Awards",
		icon: Medal,
		links: [
			{
				title: "Past Awards",
				path: "/awards",
			},
		],
	},
	{
		id: "finance",
		title: "Finance",
		icon: Receipt,
		links: [
			{
				title: "Invoices Balances",
				path: "/invoices",
			},
		],
	},
	{
		id: "admin",
		title: "Admin",
		icon: Settings,
		links: [
			{
				title: "Company Admin",
				path: "/admin",
			},
			{
				title: "Client Setup",
				path: "/client-setup",
			},
			{
				title: "Contact Admin",
				path: "/contacts",
			},
			{
				title: "Team Admin",
				path: "/team-admin",
			},
			{
				title: "User Company Roles",
				path: "/user-company-roles",
			},
			{
				title: "Account Admin",
				path: "/account-admin",
			},
			{
				title: "Color Sections",
				path: "/color-sections",
			},
			{
				title: "Menu Manager",
				path: "/menu-manager",
			},
		],
	},
];
