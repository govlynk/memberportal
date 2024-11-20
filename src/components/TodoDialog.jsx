import React, { useEffect, useState } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Button,
	Box,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Chip,
	Stack,
} from "@mui/material";
import { Tag, X } from "lucide-react";
import { useTodoStore } from "../stores/todoStore";
import { useAuthStore } from "../stores/authStore";

const initialFormState = {
	title: "",
	description: "",
	priority: "MEDIUM",
	status: "TODO",
	dueDate: "",
	estimatedEffort: "",
	actualEffort: "",
	tags: [],
};

export function TodoDialog({ open, onClose, editTodo = null }) {
	const user = useAuthStore((state) => state.user);
	const { todos, addTodo, updateTodo } = useTodoStore();
	const [tagInput, setTagInput] = useState("");
	const [formData, setFormData] = useState(initialFormState);

	useEffect(() => {
		if (!open) {
			setFormData(initialFormState);
			setTagInput("");
			return;
		}

		if (editTodo) {
			setFormData({
				...editTodo,
				dueDate: new Date(editTodo.dueDate).toISOString().split("T")[0],
				tags: editTodo.tags || [],
				estimatedEffort: editTodo.estimatedEffort || "",
				actualEffort: editTodo.actualEffort || "",
			});
		} else {
			const statusTodos = todos.filter((t) => t.status === "TODO");
			const maxPosition = Math.max(...statusTodos.map((t) => t.position), -1);

			setFormData({
				...initialFormState,
				position: maxPosition + 1,
				assigneeId: user?.sub || null,
			});
		}
	}, [open, editTodo, user, todos]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleAddTag = (e) => {
		if (e.key === "Enter" && tagInput.trim()) {
			e.preventDefault();
			const newTag = tagInput.trim().toLowerCase();
			if (!formData.tags.includes(newTag)) {
				setFormData((prev) => ({
					...prev,
					tags: [...prev.tags, newTag],
				}));
			}
			setTagInput("");
		}
	};

	const handleRemoveTag = (tagToRemove) => {
		setFormData((prev) => ({
			...prev,
			tags: prev.tags.filter((tag) => tag !== tagToRemove),
		}));
	};

	const handleSubmit = async () => {
		if (!formData.title.trim() || !formData.description.trim() || !formData.dueDate) {
			return;
		}

		const todoData = {
			...formData,
			title: formData.title.trim(),
			description: formData.description.trim(),
			tags: formData.tags || [],
			estimatedEffort: parseFloat(formData.estimatedEffort) || 0,
			actualEffort: parseFloat(formData.actualEffort) || 0,
			dueDate: new Date(formData.dueDate).toISOString(),
		};

		if (editTodo) {
			await updateTodo(editTodo.id, todoData);
		} else {
			await addTodo(todoData);
		}

		onClose();
	};

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth='sm'
			fullWidth
			PaperProps={{
				sx: {
					bgcolor: "background.paper",
					color: "text.primary",
				},
			}}
		>
			<DialogTitle>{editTodo ? "Edit Task" : "Add New Task"}</DialogTitle>
			<DialogContent>
				<Box component='form' sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
					<TextField
						fullWidth
						label='Title'
						name='title'
						value={formData.title}
						onChange={handleChange}
						required
					/>
					<TextField
						fullWidth
						label='Description'
						name='description'
						value={formData.description}
						onChange={handleChange}
						multiline
						rows={3}
						required
					/>
					<Box sx={{ display: "flex", gap: 2 }}>
						<FormControl fullWidth>
							<InputLabel>Priority</InputLabel>
							<Select name='priority' value={formData.priority} onChange={handleChange} label='Priority'>
								<MenuItem value='LOW'>Low</MenuItem>
								<MenuItem value='MEDIUM'>Medium</MenuItem>
								<MenuItem value='HIGH'>High</MenuItem>
							</Select>
						</FormControl>
						<TextField
							fullWidth
							type='date'
							label='Due Date'
							name='dueDate'
							value={formData.dueDate}
							onChange={handleChange}
							InputLabelProps={{ shrink: true }}
							required
						/>
					</Box>
					<Box sx={{ display: "flex", gap: 2 }}>
						<TextField
							fullWidth
							label='Estimated Effort (hours)'
							name='estimatedEffort'
							type='number'
							value={formData.estimatedEffort}
							onChange={handleChange}
							InputProps={{ inputProps: { min: 0, step: 0.5 } }}
						/>
						<TextField
							fullWidth
							label='Actual Effort (hours)'
							name='actualEffort'
							type='number'
							value={formData.actualEffort}
							onChange={handleChange}
							InputProps={{ inputProps: { min: 0, step: 0.5 } }}
						/>
					</Box>
					<Box>
						<TextField
							fullWidth
							label='Add Tags'
							value={tagInput}
							onChange={(e) => setTagInput(e.target.value)}
							onKeyDown={handleAddTag}
							placeholder='Press Enter to add tags'
							helperText='Press Enter to add multiple tags'
						/>
						{formData.tags && formData.tags.length > 0 && (
							<Stack direction='row' spacing={1} sx={{ mt: 1, flexWrap: "wrap", gap: 1 }}>
								{formData.tags.map((tag, index) => (
									<Chip
										key={`${tag}-${index}`}
										icon={<Tag size={14} />}
										label={tag}
										onDelete={() => handleRemoveTag(tag)}
										deleteIcon={<X size={14} />}
										color='secondary'
										variant='outlined'
										sx={{
											bgcolor: "background.paper",
											color: "text.primary",
											"& .MuiChip-icon": {
												color: "inherit",
											},
										}}
									/>
								))}
							</Stack>
						)}
					</Box>
				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button onClick={handleSubmit} variant='contained' color='primary'>
					{editTodo ? "Save Changes" : "Add Task"}
				</Button>
			</DialogActions>
		</Dialog>
	);
}