import React from "react";
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { menuLinks } from "../../config/menu-links";

export default function Sidebar({ width }) {
	const location = useLocation();
	const navigate = useNavigate();

	return (
		<Drawer
			variant='permanent'
			sx={{
				width,
				flexShrink: 0,
				"& .MuiDrawer-paper": {
					width,
					boxSizing: "border-box",
					bgcolor: "background.paper",
					borderRight: "1px solid",
					borderColor: "divider",
				},
			}}
		>
			<List sx={{ mt: 2 }}>
				{menuLinks.map((section) => (
					<React.Fragment key={section.id}>
						{section.links?.map((item) => (
							<ListItem key={item.path} disablePadding>
								<ListItemButton selected={location.pathname === item.path} onClick={() => navigate(item.path)}>
									{section.icon && (
										<ListItemIcon>
											<section.icon size={20} />
										</ListItemIcon>
									)}
									<ListItemText primary={item.title} />
								</ListItemButton>
							</ListItem>
						))}
					</React.Fragment>
				))}
			</List>
		</Drawer>
	);
}
