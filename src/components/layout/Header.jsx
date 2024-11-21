import { Typography, Box, useTheme } from "@mui/material";

const Header = ({ title, subtitle }) => {
	const theme = useTheme();
	return (
		<Box mb='20px'>
			<Box display='flex' alignItems='center'>
				<Typography variant='h4' color={colors.grey[100]} fontWeight='bold' sx={{ m: "0 5px 0 0" }}>
					{title}
				</Typography>
				<Typography
					variant='h4'
					color='primary.light' // or "secondary.light" depending on your theme
					sx={{
						color: (theme) => theme.palette.primary.light,
						// Alternatively use theme.palette.secondary.light
					}}
				>
					{subtitle && ` - ${subtitle}`}
				</Typography>
			</Box>
		</Box>
	);
};

export default Header;
