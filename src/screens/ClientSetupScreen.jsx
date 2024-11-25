import React, { useState } from "react";
import { Box, Stepper, Step, StepLabel, Card, Typography, useTheme } from "@mui/material";
import { CompanySearch } from "../components/clientSetup/CompanySearch";
import { AdminSetup } from "../components/clientSetup/AdminSetup";
import { SetupReview } from "../components/clientSetup/SetupReview";

const steps = ["Company Information", "Admin Setup", "Review & Confirm"];

export default function ClientSetupScreen() {
	const theme = useTheme();
	const [activeStep, setActiveStep] = useState(0);
	const [setupData, setSetupData] = useState({
		company: null,
		user: null,
		team: null,
	});

	const handleCompanySelect = (companyData) => {
		setSetupData((prev) => ({ ...prev, company: companyData }));
		console.log("companyData", companyData);
		setActiveStep(1);
	};

	const handleAdminSetup = (adminData) => {
		setSetupData((prev) => ({ ...prev, user: adminData }));
		setActiveStep(2);
	};

	const handleBack = () => {
		setActiveStep((prev) => prev - 1);
	};

	const renderStepContent = () => {
		switch (activeStep) {
			case 0:
				return <CompanySearch onCompanySelect={handleCompanySelect} />;
			case 1:
				return <AdminSetup onSubmit={handleAdminSetup} onBack={handleBack} companyData={setupData.company} />;
			case 2:
				return <SetupReview setupData={setupData} onBack={handleBack} />;
			default:
				return null;
		}
	};

	return (
		<Box sx={{ p: 3 }}>
			<Typography variant='h4' sx={{ mb: 4, fontWeight: "bold" }}>
				Client Setup
			</Typography>

			<Card
				sx={{
					p: 4,
					bgcolor: theme.palette.mode === "dark" ? "grey.800" : "grey.50",
					borderRadius: 2,
					boxShadow: theme.shadows[4],
				}}
			>
				<Stepper
					activeStep={activeStep}
					sx={{
						mb: 4,
						"& .MuiStepLabel-root .Mui-completed": {
							color: "success.main",
						},
						"& .MuiStepLabel-root .Mui-active": {
							color: "primary.main",
						},
					}}
				>
					{steps.map((label) => (
						<Step key={label}>
							<StepLabel>{label}</StepLabel>
						</Step>
					))}
				</Stepper>

				{renderStepContent()}
			</Card>
		</Box>
	);
}
