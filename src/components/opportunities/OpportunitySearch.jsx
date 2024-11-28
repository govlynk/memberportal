import React, { useState, useEffect } from "react";
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
	const { searchParams, setSearchParams, fetchOpportunities, loading, error } = useOpportunityStore();
	const { getActiveCompany } = useUserCompanyStore();
	const activeCompany = getActiveCompany();

	console.log(activeCompany);
	const [selectedNaicsCodes, setSelectedNaicsCodes] = useState([]);

	useEffect(() => {
		if (activeCompany?.naicsCode) {
			setSelectedNaicsCodes([activeCompany.naicsCode]);
		}
	}, [activeCompany]);

	const handleToggleNaicsCode = (code) => {
		setSelectedNaicsCodes((prev) => (prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]));
	};

	const handleSearch = async () => {
		const params = {
			...searchParams,
			ncode: selectedNaicsCodes.join(","),
			postedFrom: searchParams.startDate,
			postedTo: searchParams.endDate,
			ptype: PROCUREMENT_TYPES.join(","),
			limit: searchParams.limit,
		};
		await fetchOpportunities(params);
	};

	if (!activeCompany) {
		return (
			<Alert severity='warning' sx={{ mt: 2 }}>
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
					<Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
						{activeCompany.naicsCodes.map((code) => (
							<Chip
								key={code}
								label={code}
								color={selectedNaicsCodes.includes(code) ? "primary" : "default"}
								onClick={() => handleToggleNaicsCode(code)}
								clickable
							/>
						))}
					</Box>
				</FormControl>

				<FormControl sx={{ minWidth: 200 }}>
					<TextField
						label='Limit'
						type='number'
						value={searchParams.limit}
						onChange={(e) => setSearchParams({ ...searchParams, limit: e.target.value })}
					/>
				</FormControl>

				<Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
					{PROCUREMENT_TYPES.map((type) => (
						<Chip
							key={type}
							label={type}
							color={searchParams.ptype.includes(type) ? "primary" : "default"}
							onClick={() =>
								setSearchParams((prev) => ({
									...prev,
									ptype: prev.ptype.includes(type)
										? prev.ptype.filter((t) => t !== type)
										: [...prev.ptype, type],
								}))
							}
							clickable
						/>
					))}
				</Box>
			</Box>

			<Button variant='contained' color='primary' onClick={handleSearch} sx={{ mt: 3 }}>
				Search
			</Button>

			{loading && (
				<Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
					<CircularProgress />
				</Box>
			)}

			{error && (
				<Alert severity='error' sx={{ mt: 2 }}>
					{error}
				</Alert>
			)}
		</Paper>
	);
}
