import { Outlet } from "react-router-dom";
import { Box, useTheme } from "@mui/material";
import TopBar from "./TopBar";
import SidebarMenu from "./SidebarMenu";
import { useAuthStore } from "../../stores/authStore";

export function MainLayout({ signOut }) {
	const theme = useTheme();
	const user = useAuthStore((state) => state.user);

	return (
		<Box
			display='flex'
			sx={{
				height: "100vh",
				backgroundColor: theme.palette.primary.dark,
			}}
		>
			<SidebarMenu />
			<Box display='flex' flexDirection='column' width='100%' height='100%'>
				<TopBar user={user} signOut={signOut} />
				<Box
					component='main'
					sx={{
						display: "flex",
						flexDirection: "column",
						flexGrow: 1,
						height: "100%",
						width: "100%",
						background: (theme) =>
							theme.palette.mode === "dark" ? "linear-gradient(90deg, #016996 0%, #012f55 100%)" : "#bcd1f8",
						overflowY: "auto",
						overflowX: "hidden",
						p: 3, // Add padding
					}}
				>
					<Outlet /> {/* This is where route components will render */}
				</Box>
			</Box>
		</Box>
	);
}
