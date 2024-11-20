import React from "react";
import { Routes, Route } from "react-router-dom";
import { Box, ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import TodoScreen from "../../screens/TodoScreen";
import UserScreen from "../../screens/UserScreen";
import { useAuthStore } from "../../stores/authStore";

const theme = createTheme({
	components: {
		MuiDrawer: {
			styleOverrides: {
				paper: {
					backgroundColor: "#f5f5f5",
					borderRight: "1px solid rgba(0, 0, 0, 0.12)",
				},
			},
		},
	},
});

const DRAWER_WIDTH = 280;

export function Layout({ signOut }) {
	const user = useAuthStore((state) => state.user);

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
				<Sidebar width={DRAWER_WIDTH} />
				<Box
					sx={{
						flex: 1,
						display: "flex",
						flexDirection: "column",
						overflow: "hidden",
						width: `calc(100% - ${DRAWER_WIDTH}px)`,
					}}
				>
					<TopBar user={user} signOut={signOut} />
					<Box
						component='main'
						sx={{
							flex: 1,
							p: 3,
							bgcolor: "background.default",
							overflow: "auto",
						}}
					>
						<Routes>
							<Route path='/' element={<TodoScreen />} />
							<Route path='/todos' element={<TodoScreen />} />
							<Route path='/users' element={<UserScreen />} />
						</Routes>
					</Box>
				</Box>
			</Box>
		</ThemeProvider>
	);
}
