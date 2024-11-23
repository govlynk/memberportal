import React, { useState } from "react";
import { Box, TextField, Button, Typography, CircularProgress, Alert, Paper, useTheme } from "@mui/material";
import { Search, ArrowRight } from "lucide-react";
import { useCompanyStore } from "../../stores/companyStore";
import { getEntity } from "../../utils/samApi";

const formatCompanyData = (entityData) => {
	if (!entityData) return null;

	return {
		// Basic Information
		uei: entityData.entityRegistration?.ueiSAM || "",
		legalBusinessName: entityData.entityRegistration?.legalBusinessName || "",
		dbaName: entityData.entityRegistration?.dbaName || "",
		cageCode: entityData.entityRegistration?.cageCode || "",
		registrationStatus: entityData.entityRegistration?.registrationStatus || "",
		registrationExpirationDate: entityData.entityRegistration?.registrationExpirationDate || "",

		// Physical Address
		physicalAddress: {
			addressLine1: entityData.coreData?.physicalAddress?.addressLine1 || "",
			addressLine2: entityData.coreData?.physicalAddress?.addressLine2 || "",
			city: entityData.coreData?.physicalAddress?.city || "",
			stateOrProvinceCode: entityData.coreData?.physicalAddress?.stateOrProvinceCode || "",
			zipCode: entityData.coreData?.physicalAddress?.zipCode || "",
			zipCodePlus4: entityData.coreData?.physicalAddress?.zipCodePlus4 || "",
			countryCode: entityData.coreData?.physicalAddress?.countryCode || "",
		},

		// Business Information
		entityURL: entityData.coreData?.entityInformation?.entityURL || "",
		entityStartDate: entityData.coreData?.entityInformation?.entityStartDate || "",
		fiscalYearEndDate: entityData.coreData?.entityInformation?.fiscalYearEndCloseDate || "",

		// Business Types
		businessTypes:
			entityData.coreData?.businessTypes?.businessTypeList?.map((type) => ({
				code: type.businessTypeCode || "",
				description: type.businessTypeDesc || "",
			})) || [],

		// NAICS Codes
		naicsList:
			entityData.assertions?.goodsAndServices?.naicsList?.map((naics) => ({
				code: naics.naicsCode || "",
				description: naics.naicsDescription || "",
				isPrimary: naics.naicsCode === entityData.assertions?.goodsAndServices?.primaryNaics,
			})) || [],

		// Points of Contact
		pointsOfContact: {
			electronic: {
				firstName: entityData.pointsOfContact?.electronicBusinessPOC?.firstName || "",
				lastName: entityData.pointsOfContact?.electronicBusinessPOC?.lastName || "",
				title: entityData.pointsOfContact?.electronicBusinessPOC?.title || "",
				email: entityData.pointsOfContact?.electronicBusinessPOC?.email || "",
				phone: entityData.pointsOfContact?.electronicBusinessPOC?.phoneNumber || "",
			},
			government: {
				firstName: entityData.pointsOfContact?.governmentBusinessPOC?.firstName || "",
				lastName: entityData.pointsOfContact?.governmentBusinessPOC?.lastName || "",
				title: entityData.pointsOfContact?.governmentBusinessPOC?.title || "",
				email: entityData.pointsOfContact?.governmentBusinessPOC?.email || "",
				phone: entityData.pointsOfContact?.governmentBusinessPOC?.phoneNumber || "",
			},
		},
	};
};

export function CompanySearch({ onCompanySelect }) {
	const theme = useTheme();
	const [uei, setUei] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [searchResult, setSearchResult] = useState(null);

	const handleSearch = async () => {
		if (!uei.trim()) {
			setError("Please enter a UEI");
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const entityData = await getEntity(uei.trim());
			const formattedData = formatCompanyData(entityData);

			if (!formattedData) {
				throw new Error("No company data found for the provided UEI");
			}

			setSearchResult(formattedData);
		} catch (err) {
			setError(err.message || "Failed to fetch company information. Please verify the UEI and try again.");
		} finally {
			setLoading(false);
		}
	};

	const handleKeyPress = (e) => {
		if (e.key === "Enter") {
			handleSearch();
		}
	};

	return (
		<Box>
			<Typography variant='h6' sx={{ mb: 3 }}>
				Search Company by UEI
			</Typography>

			<Box sx={{ display: "flex", gap: 2, mb: 3 }}>
				<TextField
					fullWidth
					label='Unique Entity ID (UEI)'
					value={uei}
					onChange={(e) => setUei(e.target.value)}
					onKeyPress={handleKeyPress}
					disabled={loading}
					placeholder='Enter 12-character UEI'
					InputProps={{
						sx: { bgcolor: "background.paper" },
					}}
				/>
				<Button
					variant='contained'
					onClick={handleSearch}
					disabled={loading}
					startIcon={loading ? <CircularProgress size={20} /> : <Search />}
				>
					Search
				</Button>
			</Box>

			{error && (
				<Alert severity='error' sx={{ mb: 3 }}>
					{error}
				</Alert>
			)}

			{searchResult && (
				<Paper
					sx={{
						p: 3,
						bgcolor: theme.palette.mode === "dark" ? "grey.900" : "background.paper",
						borderRadius: 2,
						boxShadow: 3,
					}}
				>
					<Typography variant='h6' sx={{ mb: 2, color: "primary.main" }}>
						Company Information
					</Typography>

					<Box sx={{ display: "grid", gap: 2, gridTemplateColumns: "repeat(2, 1fr)" }}>
						<Box>
							<Typography variant='caption' color='text.secondary'>
								Legal Business Name
							</Typography>
							<Typography variant='body1'>{searchResult.legalBusinessName}</Typography>
						</Box>
						<Box>
							<Typography variant='caption' color='text.secondary'>
								DBA Name
							</Typography>
							<Typography variant='body1'>{searchResult.dbaName || "-"}</Typography>
						</Box>
						<Box>
							<Typography variant='caption' color='text.secondary'>
								UEI
							</Typography>
							<Typography variant='body1'>{searchResult.uei}</Typography>
						</Box>
						<Box>
							<Typography variant='caption' color='text.secondary'>
								CAGE Code
							</Typography>
							<Typography variant='body1'>{searchResult.cageCode || "-"}</Typography>
						</Box>
						<Box>
							<Typography variant='caption' color='text.secondary'>
								Registration Status
							</Typography>
							<Typography variant='body1'>{searchResult.registrationStatus}</Typography>
						</Box>
						<Box>
							<Typography variant='caption' color='text.secondary'>
								Expiration Date
							</Typography>
							<Typography variant='body1'>{searchResult.registrationExpirationDate || "-"}</Typography>
						</Box>
						<Box sx={{ gridColumn: "1 / -1" }}>
							<Typography variant='caption' color='text.secondary'>
								Physical Address
							</Typography>
							<Typography variant='body1'>
								{searchResult.physicalAddress.addressLine1}
								{searchResult.physicalAddress.addressLine2 && (
									<>
										<br />
										{searchResult.physicalAddress.addressLine2}
									</>
								)}
								<br />
								{searchResult.physicalAddress.city}, {searchResult.physicalAddress.stateOrProvinceCode}{" "}
								{searchResult.physicalAddress.zipCode}
								{searchResult.physicalAddress.zipCodePlus4 && `-${searchResult.physicalAddress.zipCodePlus4}`}
							</Typography>
						</Box>
					</Box>

					<Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
						<Button variant='contained' endIcon={<ArrowRight />} onClick={() => onCompanySelect(searchResult)}>
							Continue
						</Button>
					</Box>
				</Paper>
			)}
		</Box>
	);
}
