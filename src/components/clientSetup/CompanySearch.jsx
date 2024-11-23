import React, { useState } from "react";
import { Box, TextField, Button, Typography, CircularProgress, Alert, Paper, useTheme } from "@mui/material";
import { Search, ArrowRight } from "lucide-react";
import { useCompanyStore } from "../../stores/companyStore";
import { getEntity } from "../../utils/samApi";

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
			console.log("entityData:", entityData);
			const formattedData = {
				uei: entityData.ueiSAM,
				legalBusinessName: entityData.entityRegistration.legalBusinessName,
				dbaName: entityData.entityRegistration.dbaName,
				address: entityData.coreData.physicalAddress.addressLine1,
				address2: entityData.coreData.physicalAddress.addressLine2,
				city: entityData.coreData.physicalAddress.city,
				state: entityData.coreData.physicalAddress.stateOrProvinceCode,
				zipCode: entityData.coreData.physicalAddress.zipCode,
				countryCode: entityData.coreData.physicalAddress.countryCode,
				cageCode: entityData.entityRegistration.cageCode,
			};

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
						<Box sx={{ gridColumn: "1 / -1" }}>
							<Typography variant='caption' color='text.secondary'>
								Address
							</Typography>
							<Typography variant='body1'>
								{searchResult.address}
								{searchResult.address2 && (
									<>
										<br />
										{searchResult.address2}
									</>
								)}
								<br />
								{searchResult.city}, {searchResult.state} {searchResult.zipCode}
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
