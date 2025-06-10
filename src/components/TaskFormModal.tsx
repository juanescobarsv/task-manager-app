import { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import Icons from "./UI-elements/Icons";
import PointsPopover from "./UI-elements/newTaskPoints";
import AssigneePopover from "./UI-elements/newTaskAssignee";
import TagPopover from "./UI-elements/newTaskTag";
import DatePopover from "./UI-elements/newTaskDate";
import { useMutation } from "@apollo/client";
import { CREATE_TASK_MUTATION, UPDATE_TASK_MUTATION } from "../graphQL/mutations";
import { GET_TASKS_LIST } from "../graphQL/queries";
import { toast } from "react-toastify";

import type {
	TaskTag,
	User,
	PointEstimate,
	CreateTaskMutation,
	UpdateTaskMutation,
	Task,
} from "../graphQL/generated/graphql";

interface TaskModalProps {
	isOpen: boolean;
	onClose: () => void;
	taskToEdit: Task | null;
}

// Helper functions for PointsEstimate
const getPointEstimateEnum = (estimate: number | null): PointEstimate | null => {
	switch (estimate) {
		case 0:
			return "ZERO";
		case 1:
			return "ONE";
		case 2:
			return "TWO";
		case 4:
			return "FOUR";
		case 8:
			return "EIGHT";
		default:
			console.warn(
				`Attempted to convert unknown estimate number: ${estimate}. Defaulting to ZERO.`,
			);
			return "ZERO";
	}
};

export const convertPointEstimateToNumber = (
	pointEstimate: PointEstimate | null | undefined,
): number | null => {
	switch (pointEstimate) {
		case "ZERO":
			return 0;
		case "ONE":
			return 1;
		case "TWO":
			return 2;
		case "FOUR":
			return 4;
		case "EIGHT":
			return 8;
		default:
			return null;
	}
};

// Helper functions for Tags
export const getTagColors = (tag: TaskTag): { backgroundColor: string; textColor: string } => {
	switch (tag) {
		case "IOS":
			return {
				backgroundColor: "var(--color-neutral-4-1)",
				textColor: "var(--color-neutral-1)",
			};
		case "ANDROID":
			return {
				backgroundColor: "var(--color-secondary-4-1)",
				textColor: "var(--color-secondary-4)",
			};
		case "REACT":
			return {
				backgroundColor: "var(--color-blue-light)",
				textColor: "var(--color-blue-bright)",
			};
		case "NODE_JS":
			return {
				backgroundColor: "var(--color-tertiary-4-1)",
				textColor: "var(--color-tertiary-4)",
			};
		case "RAILS":
			return {
				backgroundColor: "var(--color-primary-4-1)",
				textColor: "var(--color-primary-4)",
			};
		default:
			return {
				backgroundColor: "var(--color-neutral-4)",
				textColor: "var(--color-neutral-1)",
			};
	}
};

const TaskFormModal = ({ isOpen, onClose, taskToEdit }: TaskModalProps) => {
	const [taskName, setTaskName] = useState("");
	const [selectedEstimate, setSelectedEstimate] = useState<number | null>(null);
	const [selectedAssignee, setSelectedAssignee] = useState<User | null>(null);
	const [selectedTags, setSelectedTags] = useState<TaskTag[]>([]);
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);

	// Popover open/close states
	const [isEstimatePopoverOpen, setIsEstimatePopoverOpen] = useState(false);
	const [isAssigneePopoverOpen, setIsAssigneePopoverOpen] = useState(false);
	const [isTagPopoverOpen, setIsTagPopoverOpen] = useState(false);
	const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

	useEffect(() => {
		if (taskToEdit) {
			setTaskName(taskToEdit.name || "");
			setSelectedEstimate(convertPointEstimateToNumber(taskToEdit.pointEstimate));
			setSelectedAssignee(taskToEdit.assignee ?? null);
			setSelectedTags(taskToEdit.tags || []);
			setSelectedDate(taskToEdit.dueDate ? new Date(taskToEdit.dueDate) : null);
		} else {
			handleClear();
		}
	}, [taskToEdit]); // Dependency array: re-run when taskToEdit changes

	// Apollo Mutations
	const [createTask, { loading: creatingTask, error: createTaskError }] =
		useMutation<CreateTaskMutation>(CREATE_TASK_MUTATION, {
			refetchQueries: [{ query: GET_TASKS_LIST, variables: { input: {} } }],
			onCompleted: (_data) => {
				handleClear();
				onClose();
				toast.success(`Task ${_data.createTask.name} created successfully!`);
			},
			onError: (error) => {
				toast.error(`Failed to create task: ${error.message}`);
			},
		});

	const [updateTask, { loading: updatingTask, error: updateTaskError }] =
		useMutation<UpdateTaskMutation>(UPDATE_TASK_MUTATION, {
			refetchQueries: [{ query: GET_TASKS_LIST, variables: { input: {} } }],
			onCompleted: (data) => {
				handleClear();
				onClose();
				console.warn("Successfully updated task:", data.updateTask);
				toast.success(`Task ${data.updateTask.name} updated successfully!`);
			},
			onError: (error) => {
				console.error("Failed to update task:", error);
				toast.error(`Failed to update task: ${error.message}`);
			},
		});

	const handleRemoveTagFromLabels = (tagToRemove: TaskTag) => {
		const updatedTags = selectedTags.filter((tag) => tag !== tagToRemove);
		setSelectedTags(updatedTags);
	};

	const isLoading = creatingTask ?? updatingTask;
	const currentError = createTaskError ?? updateTaskError;

	// Functions for Submit and Clear
	const handleSubmit = async () => {
		if (!taskName.trim()) {
			toast.error("Task name cannot be empty.");
			return;
		}

		const pointEstimateEnum =
			selectedEstimate !== null ? getPointEstimateEnum(selectedEstimate) : null;

		const inputVariables = {
			name: taskName.trim(),
			pointEstimate: pointEstimateEnum,
			assigneeId: selectedAssignee?.id ?? null,
			tags: selectedTags,
			dueDate: selectedDate ? selectedDate.toISOString() : null,
		};

		try {
			if (taskToEdit) {
				if (!taskToEdit.id) {
					console.error("No task ID provided for update.");
					toast.error("Cannot update task: No task ID found.");
					return;
				}
				await updateTask({
					variables: {
						input: {
							id: taskToEdit.id,
							...inputVariables,
							status: taskToEdit.status,
							position: taskToEdit.position,
						},
					},
				});
			} else {
				await createTask({
					variables: {
						input: {
							...inputVariables,
							status: "TODO", // Default status for new tasks
						},
					},
				});
			}
		} catch (error) {
			// Error handling is done by onError callbacks
			console.error("Error during task operation:", error);
		}
	};

	const handleClear = () => {
		setTaskName("");
		setSelectedEstimate(null);
		setSelectedAssignee(null);
		setSelectedTags([]);
		setSelectedDate(null);
	};

	const modalTitle = taskToEdit ? "Edit Task" : "Create New Task";
	const submitButtonText = taskToEdit ? "Update" : "Create";

	return (
		<Dialog.Root open={isOpen} onOpenChange={onClose}>
			<Dialog.Portal>
				<Dialog.Overlay className='task-modal-overlay' />
				<Dialog.Content className='task-modal-content'>
					<VisuallyHidden.Root>
						<Dialog.Title>{modalTitle}</Dialog.Title>
						<Dialog.Description>
							{taskToEdit
								? "Edit the details of this task."
								: "Fill in the details to create a new task."}
						</Dialog.Description>
					</VisuallyHidden.Root>

					<input
						type='text'
						placeholder='Task name'
						className='task-modal-input'
						value={taskName}
						onChange={(e) => setTaskName(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								void handleSubmit();
							}
						}}
						disabled={isLoading}
					/>

					<div className='task-modal-options'>
						<PointsPopover
							isOpen={isEstimatePopoverOpen}
							onClose={(open) => setIsEstimatePopoverOpen(open)}
							onSelectEstimate={(estimate) => setSelectedEstimate(estimate)}
							selectedEstimate={selectedEstimate}
						>
							<button className='option-button' onClick={() => setIsEstimatePopoverOpen(true)}>
								<Icons name='increase_decrease' />
								{selectedEstimate !== null ? `${selectedEstimate} Points` : "Estimate"}
							</button>
						</PointsPopover>

						<AssigneePopover
							isOpen={isAssigneePopoverOpen}
							onOpenChange={(open) => setIsAssigneePopoverOpen(open)}
							onSelectAssignee={(assignee) => setSelectedAssignee(assignee)}
							selectedAssigneeId={selectedAssignee?.id ?? null}
						>
							<button
								className={`option-button ${selectedAssignee ? "option-button--assigned" : ""}`}
								onClick={() => setIsAssigneePopoverOpen(true)}
							>
								{!selectedAssignee && <Icons name='user' />}
								{selectedAssignee ? selectedAssignee.fullName : "Assignee"}
							</button>
						</AssigneePopover>

						<TagPopover
							isOpen={isTagPopoverOpen}
							onOpenChange={(open) => setIsTagPopoverOpen(open)}
							onSelectTags={(tags) => setSelectedTags(tags)}
							selectedTags={selectedTags}
						>
							<button className='option-button' onClick={() => setIsTagPopoverOpen(true)}>
								<Icons name='tag' />
								{selectedTags.length > 0 ? `${selectedTags.length} Tags` : "Label"}
							</button>
						</TagPopover>

						<DatePopover
							isOpen={isDatePickerOpen}
							onOpenChange={(open) => setIsDatePickerOpen(open)}
							onSelectDate={(date) => setSelectedDate(date)}
							selectedDate={selectedDate}
						>
							<button className='option-button' onClick={() => setIsDatePickerOpen(true)}>
								<Icons name='calendar' />
								{selectedDate ? selectedDate.toLocaleDateString() : "Due date"}
							</button>
						</DatePopover>
					</div>

					<div className='task-modal-actions'>
						{selectedTags.length > 0 && (
							<div className='selected-tag-labels'>
								{selectedTags.map((tag) => {
									const { backgroundColor, textColor } = getTagColors(tag);
									return (
										<span
											key={tag}
											className='tag-label'
											style={{ backgroundColor, color: textColor }}
										>
											<span className='tag-label__text'>{tag.toUpperCase()}</span>
											<button
												className='tag-label__close-button'
												onClick={() => handleRemoveTagFromLabels(tag)}
												aria-label={`Remove ${tag} tag`}
											>
												<Icons name='close' />
											</button>
										</span>
									);
								})}
							</div>
						)}

						{isLoading && <span className='loading-message'>{submitButtonText} task...</span>}
						{currentError && <span className='error-message'>Error: {currentError.message}</span>}
						<button
							className='action-button action-button--cancel'
							onClick={() => {
								handleClear(); // Clear form fields
								onClose(); // Close modal
							}}
							disabled={isLoading}
						>
							Cancel
						</button>
						<button
							className='action-button action-button--create'
							onClick={() => {
								void handleSubmit();
							}}
							disabled={isLoading || !taskName.trim()}
						>
							{submitButtonText}
						</button>
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
};

export default TaskFormModal;
