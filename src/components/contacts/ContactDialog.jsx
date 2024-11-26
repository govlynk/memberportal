import React, { useState, useEffect } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Button,
	Box,
	Alert,
	Grid,
	Typography,
} from "@mui/material";
import { generateClient } from "aws-amplify/data";

const client = generateClient({
	authMode: "userPool",
});

const initialFormState = {
	firstName: "",
	lastName: "",
	title: "",
	department: "",
	contactEmail: "",
	contactMobilePhone: "",
	contactBusinessPhone: "",
	workAddressStreetLine1: "",
	workAddressStreetLine2: "",
	workAddressCity: "",
	workAddressStateCode: "",
	workAddressZipCode: "",
	workAddressCountryCode: "",
	notes: "",
};

export function ContactDialog({ open, onClose, editContact = null, companyId }) {
	const [formData, setFormData] = useState(initialFormState);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (editContact) {
			setFormData({
				firstName: editContact.firstName || "",
				lastName: editContact.lastName || "",
				title: editContact.title || "",
				department: editContact.department || "",
				contactEmail: editContact.contactEmail || "",
				contactMobilePhone: editContact.contactMobilePhone || "",
				contactBusinessPhone: editContact.contactBusinessPhone || "",
				workAddressStreetLine1: editContact.workAddressStreetLine1 || "",
				workAddressStreetLine2: editContact.workAddressStreetLine2 || "",
				workAddressCity: editContact.workAddressCity || "",
				workAddressStateCode: editContact.workAddressStateCode || "",
				workAddressZipCode: editContact.workAddressZipCode || "",
				workAddressCountryCode: editContact.workAddressCountryCode || "",
				notes: editContact.notes || "",
			});
		} else {
			setFormData(initialFormState);
		}
	}, [editContact]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		setError(null);
	};

	const validateForm = () => {
		if (!formData.firstName?.trim()) {
			setError("First name is required");
			return false;
		}
		if (!formData.lastName?.trim()) {
			setError("Last name is required");
			return false;
		}
		if (formData.contactEmail && !isValidEmail(formData.contactEmail)) {
			setError("Invalid email format");
			return false;
		}
		return true;
	};

	const isValidEmail = (email) => {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	};

	const handleSubmit = async () => {
		if (!validateForm()) return;

		setLoading(true);
		try {
			const contactData = {
				firstName: formData.firstName.trim(),
				lastName: formData.lastName.trim(),
				title: formData.title?.trim() || null,
				department: formData.department?.trim() || null,
				contactEmail: formData.contactEmail?.trim() || null,
				contactMobilePhone: formData.contactMobilePhone?.trim() || null,
				contactBusinessPhone: formData.contactBusinessPhone?.trim() || null,
				workAddressStreetLine1: formData.workAddressStreetLine1?.trim() || null,
				workAddressStreetLine2: formData.workAddressStreetLine2?.trim() || null,
				workAddressCity: formData.workAddressCity?.trim() || null,
				workAddressStateCode: formData.workAddressStateCode?.trim() || null,
				workAddressZipCode: formData.workAddressZipCode?.trim() || null,
				workAddressCountryCode: formData.workAddressCountryCode?.trim() || null,
				notes: formData.notes?.trim() || null,
			};

			if (editContact) {
				// Update existing contact
				await client.models.Contact.update({
					id: editContact.id,
					...contactData,
				});
			} else {
				// Create new contact
				await client.models.Contact.create({
					...contactData,
					companyId,
				});
			}

			onClose();
		} catch (err) {
			console.error("Error saving contact:", err);
			setError(err.message || "Failed to save contact");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth='md'
			fullWidth
			PaperProps={{
				sx: {
					bgcolor: "background.paper",
					color: "text.primary",
				},
			}}
		>
			<DialogTitle>{editContact ? "Edit Contact" : "Add New Contact"}</DialogTitle>
			<DialogContent>
				<Box sx={{ mt: 2 }}>
					{error && (
						<Alert severity='error' sx={{ mb: 2 }}>
							{error}
						</Alert>
					)}

					<Grid container spacing={2}>
						<Grid item xs={12} sm={6}>
							<TextField
								fullWidth
								label='First Name'
								name='firstName'
								value={formData.firstName}
								onChange={handleChange}
								required
								disabled={loading}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								fullWidth
								label='Last Name'
								name='lastName'
								value={formData.lastName}
								onChange={handleChange}
								required
								disabled={loading}
							/>
						</Grid>

						<Grid item xs={12} sm={6}>
							<TextField
								fullWidth
								label='Title'
								name='title'
								value={formData.title}
								onChange={handleChange}
								disabled={loading}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								fullWidth
								label='Department'
								name='department'
								value={formData.department}
								onChange={handleChange}
								disabled={loading}
							/>
						</Grid>

						<Grid item xs={12} sm={6}>
							<TextField
								fullWidth
								label='Email'
								name='contactEmail'
								type='email'
								value={formData.contactEmail}
								onChange={handleChange}
								disabled={loading}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								fullWidth
								label='Mobile Phone'
								name='contactMobilePhone'
								value={formData.contactMobilePhone}
								onChange={handleChange}
								disabled={loading}
							/>
						</Grid>

						<Grid item xs={12} sm={6}>
							<TextField
								fullWidth
								label='Business Phone'
								name='contactBusinessPhone'
								value={formData.contactBusinessPhone}
								onChange={handleChange}
								disabled={loading}
							/>
						</Grid>

						<Grid item xs={12}>
							<Typography variant='subtitle1' sx={{ mb: 1 }}>
								Work Address
							</Typography>
						</Grid>

						<Grid item xs={12}>
							<TextField
								fullWidth
								label='Street Address Line 1'
								name='workAddressStreetLine1'
								value={formData.workAddressStreetLine1}
								onChange={handleChange}
								disabled={loading}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								fullWidth
								label='Street Address Line 2'
								name='workAddressStreetLine2'
								value={formData.workAddressStreetLine2}
								onChange={handleChange}
								disabled={loading}
							/>
						</Grid>

						<Grid item xs={12} sm={6}>
							<TextField
								fullWidth
								label='City'
								name='workAddressCity'
								value={formData.workAddressCity}
								onChange={handleChange}
								disabled={loading}
							/>
						</Grid>
						<Grid item xs={12} sm={3}>
							<TextField
								fullWidth
								label='State'
								name='workAddressStateCode'
								value={formData.workAddressStateCode}
								onChange={handleChange}
								disabled={loading}
							/>
						</Grid>
						<Grid item xs={12} sm={3}>
							<TextField
								fullWidth
								label='ZIP Code'
								name='workAddressZipCode'
								value={formData.workAddressZipCode}
								onChange={handleChange}
								disabled={loading}
							/>
						</Grid>

						<Grid item xs={12}>
							<TextField
								fullWidth
								label='Notes'
								name='notes'
								value={formData.notes}
								onChange={handleChange}
								multiline
								rows={3}
								disabled={loading}
							/>
						</Grid>
					</Grid>
				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} disabled={loading}>
					Cancel
				</Button>
				<Button onClick={handleSubmit} variant='contained' disabled={loading}>
					{loading ? "Saving..." : editContact ? "Save Changes" : "Add Contact"}
				</Button>
			</DialogActions>
		</Dialog>
	);
}
