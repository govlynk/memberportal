import React, { useState } from "react";
import {
	Box,
	TextField,
	Button,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Chip,
	Alert,
	Typography,
	Paper,
} from "@mui/material";
import { Search, RefreshCw } from "lucide-react";
import { useOpportunityStore } from "../../stores/opportunityStore";
import { useUserCompanyStore } from "../../stores/userCompanyStore";

const PROCUREMENT_TYPES = [
	{ value: "p", label: "Pre-solicitation" },
	{ value: "o", label: "Solicitation" },
	{ value: "k", label: "Combined Synopsis/Solicitation" },
	{ value: "a", label: "Award Notice" },
	{ value: "r", label: "Sources Sought" },
	{ value: "s", label: "Special Notice" },
];

// solnum	Solicitation Number	No	String	v2
// noticeid	Notice ID	No	String	v2
// typeOfSetAside	Refer Set-Aside Value Section	No	String	v2
// rdlto	Response Deadline date. Format must be MM/dd/yyyy
// rdlfrom	Response Deadline date. Format must be MM/dd/yyyy

export function OpportunitySearch() {
	const { getActiveCompany } = useUserCompanyStore();
	const { fetchOpportunities, lastRetrievedDate, loading, error } = useOpportunityStore();
	const activeCompany = getActiveCompany();

	const NAICS = activeCompany?.naicsCode;
	const ncode = Array.isArray(NAICS) && NAICS.length > 1 ? NAICS.join(",") : NAICS;
	const date = new Date();
	const endDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
	// Use last retrieved date if available, otherwise use 3 months prior
	const startDate = lastRetrievedDate
		? new Date(lastRetrievedDate).toLocaleDateString()
		: `${date.getMonth() - 2}/01/${date.getFullYear()}`;
	const limit = 10;

	const [searchParams, setSearchParams] = useState({
		ncode: `&naics=${ncode}`,
		postedFrom: `&postedFrom=${startDate}`,
		postedTo: `&postedTo=${endDate}`,
		ptype: `&ptype=${["p", "o", "k"]}`,
		limit: `&limit=${limit}`,
	});

	const handleSearch = async () => {
		if (!activeCompany?.naicsCode) {
			return;
		}

		const params = {
			...searchParams,
			ncode: `&naics=${ncode}`,
			postedFrom: `&postedFrom=${startDate}`,
			postedTo: `&postedTo=${endDate}`,
			ptype: `&ptype=${["p", "o", "k"]}`,
			limit: `&limit=${limit}`,
		};

		await fetchOpportunities(params);
	};

	if (!activeCompany) {
		return (
			<Alert severity='warning' sx={{ mb: 3 }}>
				Please select a company to search for opportunities
			</Alert>
		);
	}

	return (
		<Paper sx={{ p: 3, mb: 3 }}>
			<Typography variant='h6' sx={{ mb: 2 }}>
				Search Opportunities
			</Typography>

			<Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
				<FormControl sx={{ minWidth: 200 }}>
					<InputLabel>NAICS Code</InputLabel>
					<Select value={activeCompany.naicsCode || ""} label='NAICS Code' disabled>
						<MenuItem value={activeCompany.naicsCode}>{activeCompany.naicsCode}</MenuItem>
					</Select>
				</FormControl>

				<FormControl sx={{ minWidth: 200 }}>
					<InputLabel>Limit</InputLabel>
					<Select
						value={searchParams.limit}
						onChange={(e) => setSearchParams({ ...searchParams, limit: e.target.value })}
						label='Limit'
					>
						<MenuItem value={10}>10</MenuItem>
						<MenuItem value={25}>25</MenuItem>
						<MenuItem value={50}>50</MenuItem>
					</Select>
				</FormControl>

				<Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
					{PROCUREMENT_TYPES.map((type) => (
						<Chip
							key={type.value}
							label={type.label}
							color={searchParams.ptype.includes(type.value) ? "primary" : "default"}
							onClick={() => {
								const newTypes = searchParams.ptype.includes(type.value)
									? searchParams.ptype.filter((t) => t !== type.value)
									: [...searchParams.ptype, type.value];
								setSearchParams({ ...searchParams, ptype: newTypes });
							}}
						/>
					))}
				</Box>

				<Button
					variant='contained'
					onClick={handleSearch}
					disabled={loading}
					startIcon={loading ? <RefreshCw className='animate-spin' /> : <Search />}
					sx={{ ml: "auto" }}
				>
					Search Opportunities
				</Button>
			</Box>

			{error && (
				<Alert severity='error' sx={{ mt: 2 }}>
					{error}
				</Alert>
			)}

			{lastRetrievedDate && (
				<Typography variant='caption' color='text.secondary' sx={{ mt: 2, display: "block" }}>
					Last retrieved: {new Date(lastRetrievedDate).toLocaleString()}
				</Typography>
			)}
		</Paper>
	);
}
