import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Icons from "./UI-elements/sidebarIcons";
import { useState } from "react";
import EstimatePopover from "./UI-elements/newTaskEstimate";
import AssigneePopover from "./UI-elements/newTaskAssignee";
import TagPopover from "./UI-elements/newTaskTag";
import DatePopover from "./UI-elements/newTaskDate";
import { useMutation } from "@apollo/client";
import { CREATE_TASK_MUTATION } from "../graphQL/mutations";
import { GET_TASKS_LIST } from "../graphQL/queries";

import type {
	TaskTag,
	User,
	PointEstimate,
	CreateTaskMutation,
} from "../graphQL/generated/graphql";
import { VisuallyHidden } from "radix-ui";

interface TaskModalProps {
	isOpen: boolean;
	onClose: () => void;
	// onSubmit: (
	// 	taskName: string,
	// 	estimate: number | null,
	// 	assignee: User | null,
	// 	tags: TaskTag[],
	// 	dueDate: Date | null,
	// ) => void;
}

const NewTask: React.FC<TaskModalProps> = ({ isOpen, onClose }) => {
	const [taskName, setTaskName] = useState("");
	const [isEstimatePopoverOpen, setIsEstimatePopoverOpen] = useState(false);
	const [selectedEstimate, setSelectedEstimate] = useState<number | null>(null);
	const [isAssigneePopoverOpen, setIsAssigneePopoverOpen] = useState(false);
	const [selectedAssignee, setSelectedAssignee] = useState<User | null>(null);
	const [isTagPopoverOpen, setIsTagPopoverOpen] = useState(false);
	const [selectedTags, setSelectedTags] = useState<TaskTag[]>([]);
	const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);

	const [createTask, { loading: creatingTask, error: createTaskError }] =
		useMutation<CreateTaskMutation>(CREATE_TASK_MUTATION, {
			refetchQueries: [{ query: GET_TASKS_LIST, variables: { input: {} } }],
			onCompleted: (data) => {
				handleClear();
				onClose();
				// eslint-disable-next-line no-console
				console.log("Successfully created task:", data.createTask);
			},
			onError: (error) => {
				console.error("Failed to create task:", error);
			},
		});

	// Helper function to convert number estimate to PointEstimate enum
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

	const handleCreateTask = async () => {
		if (taskName.trim()) {
			const pointEstimateEnum =
				selectedEstimate !== null ? getPointEstimateEnum(selectedEstimate) : null;

			try {
				await createTask({
					variables: {
						input: {
							name: taskName.trim(),
							pointEstimate: pointEstimateEnum,
							assigneeId: selectedAssignee?.id ?? null,
							tags: selectedTags,
							dueDate: selectedDate ? selectedDate.toISOString() : null, // Format date to ISO string
							status: "TODO",
							// position: 0,
						},
					},
				});
				// The onCompleted callback of useMutation will handle closing the modal and clearing state
			} catch (error) {
				// Error handled by onError in useMutation, but can add more specific logic here if needed.
				console.error("Error initiating createTask mutation:", error);
			}
		}
	};

	const handleClear = () => {
		setTaskName("");
		setSelectedEstimate(null);
		setSelectedAssignee(null);
		setSelectedTags([]);
		setSelectedDate(null);
	};

	// Estimate Popover Handlers
	const handleOpenEstimatePopover = () => {
		setIsEstimatePopoverOpen(true);
	};

	const handleCloseEstimatePopover = (open: boolean) => {
		setIsEstimatePopoverOpen(open);
	};

	const handleSelectEstimate = (estimate: number | null) => {
		setSelectedEstimate(estimate);
	};
	// Assignee Popover Handlers
	const handleOpenAssigneePopover = () => setIsAssigneePopoverOpen(true);
	const handleCloseAssigneePopover = (open: boolean) => setIsAssigneePopoverOpen(open);
	const handleSelectAssignee = (assignee: User | null) => {
		setSelectedAssignee(assignee);
	};

	// Tag Popover Handlers
	const handleOpenTagPopover = () => setIsTagPopoverOpen(true);
	const handleCloseTagPopover = (open: boolean) => setIsTagPopoverOpen(open);
	const handleSelectTags = (tags: TaskTag[]) => setSelectedTags(tags);

	// Date Picker Handlers
	const handleOpenDatePicker = () => setIsDatePickerOpen(true);
	const handleCloseDatePicker = (open: boolean) => setIsDatePickerOpen(open);
	const handleSelectDate = (date: Date | null) => setSelectedDate(date);

	// Helper function to get tag colors (copied from NewTaskTag)
	const getTagColors = (tag: TaskTag): { backgroundColor: string; textColor: string } => {
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

	const handleRemoveTagFromLabels = (tagToRemove: TaskTag) => {
		const updatedTags = selectedTags.filter((tag) => tag !== tagToRemove);
		setSelectedTags(updatedTags);
	};

	return (
		<>
			<Dialog.Root open={isOpen} onOpenChange={onClose}>
				<Dialog.Portal>
					<Dialog.Overlay className='task-modal-overlay' />
					<Dialog.Content className='task-modal-content'>
						<VisuallyHidden.Root>
							<Dialog.Title>Create New Task</Dialog.Title>
							<Dialog.Description>
								Fill in the details to create a new task, including name, estimate, assignee, tags,
								and due date.
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
									void handleCreateTask();
								}
							}}
							disabled={creatingTask}
						/>

						<div className='task-modal-options'>
							<EstimatePopover
								isOpen={isEstimatePopoverOpen}
								onClose={handleCloseEstimatePopover}
								onSelectEstimate={handleSelectEstimate}
								selectedEstimate={selectedEstimate}
							>
								<button className='option-button' onClick={handleOpenEstimatePopover}>
									<Icons name='increase_decrease' />
									{selectedEstimate !== null ? `${selectedEstimate} Points` : "Estimate"}
								</button>
							</EstimatePopover>

							<AssigneePopover
								isOpen={isAssigneePopoverOpen}
								onOpenChange={handleCloseAssigneePopover}
								onSelectAssignee={handleSelectAssignee}
								selectedAssigneeId={selectedAssignee?.id ?? null}
							>
								<button
									className={`option-button ${selectedAssignee ? "option-button--assigned" : ""}`}
									onClick={handleOpenAssigneePopover}
								>
									{!selectedAssignee && <Icons name='user' />}
									{selectedAssignee ? selectedAssignee.fullName : "Assignee"}
								</button>
							</AssigneePopover>

							<TagPopover
								isOpen={isTagPopoverOpen}
								onOpenChange={handleCloseTagPopover}
								onSelectTags={handleSelectTags}
								selectedTags={selectedTags}
							>
								<button className='option-button' onClick={handleOpenTagPopover}>
									<Icons name='tag' />
									{selectedTags.length > 0 ? `${selectedTags.length} Tags` : "Label"}
								</button>
							</TagPopover>

							<DatePopover
								isOpen={isDatePickerOpen}
								onOpenChange={handleCloseDatePicker}
								onSelectDate={handleSelectDate}
								selectedDate={selectedDate}
							>
								<button className='option-button' onClick={handleOpenDatePicker}>
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

							{creatingTask && <span className='loading-message'>Creating task...</span>}
							{createTaskError && (
								<span className='error-message'>Error: {createTaskError.message}</span>
							)}
							<button
								className='action-button action-button--cancel'
								onClick={handleClear}
								disabled={creatingTask}
							>
								Cancel
							</button>
							<button
								className='action-button action-button--create'
								onClick={() => {
									void handleCreateTask();
								}}
							>
								Create
							</button>
						</div>
					</Dialog.Content>
				</Dialog.Portal>
			</Dialog.Root>
		</>
	);
};

export default NewTask;
