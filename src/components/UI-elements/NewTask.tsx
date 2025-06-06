import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Icons from "./sidebarIcons";
import { useState } from "react";
import EstimateModal from "./newTaskEstimate";
import AssigneePopover from "./newTaskAssignee";

// Define the type for Assignee to be used in TaskModal's state (should match User from API)
export interface User {
	id: string;
	fullName: string;
	email: string;
}

interface TaskModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (taskName: string, estimate: number | null, assignee: User | null) => void;
}

const NewTask: React.FC<TaskModalProps> = ({ isOpen, onClose, onSubmit }) => {
	const [taskName, setTaskName] = useState("");
	const [isEstimatePopoverOpen, setIsEstimatePopoverOpen] = useState(false);
	const [selectedEstimate, setSelectedEstimate] = useState<number | null>(null);
	const [isAssigneePopoverOpen, setIsAssigneePopoverOpen] = useState(false);
	const [selectedAssignee, setSelectedAssignee] = useState<User | null>(null);

	const handleCreateTask = () => {
		if (taskName.trim()) {
			onSubmit(taskName.trim(), selectedEstimate, selectedAssignee);
			setTaskName("");
			setSelectedEstimate(null);
			setSelectedAssignee(null); // Reset assignee
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
		// Type is User now
		setSelectedAssignee(assignee);
	};

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
							<EstimateModal
								isOpen={isEstimatePopoverOpen}
								onClose={handleCloseEstimatePopover} // Changed from onClose to onOpenChange
								onSelectEstimate={handleSelectEstimate}
								selectedEstimate={selectedEstimate} // Pass selectedEstimate to highlight
							>
								<button className='option-button' onClick={handleOpenEstimatePopover}>
									<Icons name='increase_decrease' />
									{selectedEstimate !== null ? `${selectedEstimate} Points` : "Estimate"}
								</button>
							</EstimateModal>

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

							<button className='option-button'>
								<Icons name='tag' />
								Label
							</button>
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
