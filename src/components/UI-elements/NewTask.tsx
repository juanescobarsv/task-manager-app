import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Icons from "./sidebarIcons";
import { useState } from "react";
import EstimatePopover from "./newTaskEstimate";
import AssigneePopover from "./newTaskAssignee";
import TagPopover from "./newTaskTag";
import type { TaskTag } from "../../graphQL/generated/graphql";
import type { User } from "../../graphQL/generated/graphql";

interface TaskModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (
		taskName: string,
		estimate: number | null,
		assignee: User | null,
		tags: TaskTag[],
	) => void;
}

const NewTask: React.FC<TaskModalProps> = ({ isOpen, onClose, onSubmit }) => {
	const [taskName, setTaskName] = useState("");
	const [isEstimatePopoverOpen, setIsEstimatePopoverOpen] = useState(false);
	const [selectedEstimate, setSelectedEstimate] = useState<number | null>(null);
	const [isAssigneePopoverOpen, setIsAssigneePopoverOpen] = useState(false);
	const [selectedAssignee, setSelectedAssignee] = useState<User | null>(null);
	const [isTagPopoverOpen, setIsTagPopoverOpen] = useState(false);
	const [selectedTags, setSelectedTags] = useState<TaskTag[]>([]);

	const handleCreateTask = () => {
		if (taskName.trim()) {
			onSubmit(taskName.trim(), selectedEstimate, selectedAssignee, selectedTags);
			setTaskName("");
			setSelectedEstimate(null);
			setSelectedAssignee(null);
			setSelectedTags([]);
			onClose();
		}
	};

	// Estimate Modal Handlers (remain unchanged)
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

	return (
		<>
			<Dialog.Root open={isOpen} onOpenChange={onClose}>
				<Dialog.Portal>
					<Dialog.Overlay className='task-modal-overlay' />
					<Dialog.Content className='task-modal-content'>
						<input
							type='text'
							placeholder='Task name'
							className='task-modal-input'
							value={taskName}
							onChange={(e) => setTaskName(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									handleCreateTask();
								}
							}}
						/>

						<div className='task-modal-options'>
							<EstimatePopover
								isOpen={isEstimatePopoverOpen}
								onClose={handleCloseEstimatePopover} // Changed from onClose to onOpenChange
								onSelectEstimate={handleSelectEstimate}
								selectedEstimate={selectedEstimate} // Pass selectedEstimate to highlight
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
									{/* Conditional rendering of the icon */}
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

							<button className='option-button'>
								<Icons name='calendar' />
								Due date
							</button>
						</div>

						<div className='task-modal-actions'>
							<button className='action-button action-button--cancel' onClick={onClose}>
								Cancel
							</button>
							<button className='action-button action-button--create' onClick={handleCreateTask}>
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
