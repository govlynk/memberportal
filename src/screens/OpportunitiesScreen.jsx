import React from "react";
import { Box, Typography, Tabs, Tab, Alert, CircularProgress } from "@mui/material";
import { OpportunityList } from "../components/opportunities/OpportunityList";
import { useOpportunityStore } from "../stores/opportunityStore";
import { useUserCompanyStore } from "../stores/userCompanyStore";
import { useEffect } from "react";

export default function OpportunitiesScreen() {
	const [activeTab, setActiveTab] = React.useState(0);
	const {
		opportunities,
		savedOpportunities,
		rejectedOpportunities,
		fetchOpportunities,
		loading,
		error,
		lastRetrievedDate,
	} = useOpportunityStore();
	const { getActiveCompany } = useUserCompanyStore();
	const activeCompany = getActiveCompany();

	useEffect(() => {
		if (activeCompany?.naicsCode) {
			const NAICS = activeCompany?.naicsCode;
			const ncode = Array.isArray(NAICS) && NAICS.length > 1 ? NAICS.join(",") : NAICS;
			const date = new Date();
			const endDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
			const startDate = lastRetrievedDate
				? new Date(lastRetrievedDate).toLocaleDateString()
				: `${date.getMonth() - 2}/01/${date.getFullYear()}`;
			const limit = 10;

			const searchParams = {
				ncode: `&naics=${ncode}`,
				postedFrom: `&postedFrom=${startDate}`,
				postedTo: `&postedTo=${endDate}`,
				ptype: `&ptype=${["p", "o", "k"]}`,
				limit: `&limit=${limit}`,
			};

			fetchOpportunities(searchParams);
		}
	}, [activeCompany?.naicsCode, fetchOpportunities, lastRetrievedDate]);

	const handleTabChange = (event, newValue) => {
		setActiveTab(newValue);
	};

	if (!activeCompany) {
		return (
			<Box sx={{ p: 3 }}>
				<Alert severity='warning'>Please select a company to view opportunities</Alert>
			</Box>
		);
	}

	if (loading) {
		return (
			<Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
				<CircularProgress />
			</Box>
		);
	}

	if (error) {
		return (
			<Box sx={{ p: 3 }}>
				<Alert severity='error'>{error}</Alert>
			</Box>
		);
	}

	return (
		<Box sx={{ p: 3 }}>
			<Typography variant='h4' sx={{ mb: 4, fontWeight: "bold" }}>
				Contract Opportunities
			</Typography>

			{lastRetrievedDate && (
				<Typography variant='caption' color='text.secondary' sx={{ mb: 3, display: "block" }}>
					Last updated: {new Date(lastRetrievedDate).toLocaleString()}
				</Typography>
			)}

			<Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
				<Tab label={`New (${opportunities.length})`} id='opportunities-tab-0' />
				<Tab label={`Saved (${savedOpportunities.length})`} id='opportunities-tab-1' />
				<Tab label={`Rejected (${rejectedOpportunities.length})`} id='opportunities-tab-2' />
			</Tabs>

			<Box role='tabpanel' hidden={activeTab !== 0}>
				{activeTab === 0 && <OpportunityList opportunities={opportunities} />}
			</Box>

			<Box role='tabpanel' hidden={activeTab !== 1}>
				{activeTab === 1 && <OpportunityList opportunities={savedOpportunities} />}
			</Box>

			<Box role='tabpanel' hidden={activeTab !== 2}>
				{activeTab === 2 && <OpportunityList opportunities={rejectedOpportunities} />}
			</Box>
		</Box>
	);
}
