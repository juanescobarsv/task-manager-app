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
	const [isEstimateModalOpen, setIsEstimateModalOpen] = useState(false);
	const [selectedEstimate, setSelectedEstimate] = useState<number | null>(null);
	const [isAssigneePopoverOpen, setIsAssigneePopoverOpen] = useState(false);
	const [selectedAssignee, setSelectedAssignee] = useState<User | null>(null); // Type is User now

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
	const handleOpenEstimateModal = () => setIsEstimateModalOpen(true);
	const handleCloseEstimateModal = () => setIsEstimateModalOpen(false);
	const handleSelectEstimate = (estimate: number) => setSelectedEstimate(estimate);

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
							onKeyPress={(e) => {
								if (e.key === "Enter") {
									handleCreateTask();
								}
							}}
						/>

						<div className='task-modal-options'>
							<button className='option-button' onClick={handleOpenEstimateModal}>
								<Icons name='increase_decrease' />
								{selectedEstimate !== null ? `${selectedEstimate} Points` : "Estimate"}
							</button>

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

			<EstimateModal
				isOpen={isEstimateModalOpen}
				onClose={handleCloseEstimateModal}
				onSelectEstimate={handleSelectEstimate}
			/>
		</>
	);
};

export default NewTask;
