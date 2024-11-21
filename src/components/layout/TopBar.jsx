import { useState } from "react";
import { AppBar, Toolbar, Typography, Box, Button, Avatar, Divider } from "@mui/material";
import { CompanySwitcher } from "./CompanySwitcher"; // Verify correct import path
import { useUserCompanyStore } from "../../stores/userCompanyStore";

export default function TopBar({ user, signOut }) {
	const [anchorEl, setAnchorEl] = useState(null);
	const { userCompanies } = useUserCompanyStore(); // Add store connection

	const handleMenu = (event) => {
		setAnchorEl(event.currentTarget);
	};

	return (
		<AppBar
			position='sticky'
			elevation={0}
			sx={{
				bgcolor: "background.paper",
				borderBottom: "1px solid",
				borderColor: "divider",
			}}
		>
			<Toolbar sx={{ gap: 2 }}>
				<Typography
					variant='h6'
					component='div'
					sx={{
						color: "text.primary",
						minWidth: 200,
					}}
				>
					Amplify Gen 2 Demo
				</Typography>
				<Divider orientation='vertical' flexItem />
				{userCompanies?.length > 0 && <CompanySwitcher />} {/* Add conditional rendering */}
				<Box sx={{ flexGrow: 1 }} />
				<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
					<Button onClick={handleMenu} startIcon={<Avatar sx={{ width: 32, height: 32 }} />}>
						{user?.username}
					</Button>
				</Box>
			</Toolbar>
		</AppBar>
	);
}
