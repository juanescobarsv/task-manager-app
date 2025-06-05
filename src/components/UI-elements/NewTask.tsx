import * as Dialog from "@radix-ui/react-dialog";
import Icons from "./sidebarIcons";
import { useState } from "react";

interface TaskModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (taskName: string) => void;
}

const NewTask = ({ isOpen, onClose, onSubmit }: TaskModalProps) => {
	const [taskName, setTaskName] = useState("");

	const handleCreateTask = () => {
		if (taskName.trim()) {
			onSubmit(taskName.trim());
			setTaskName("");
			onClose();
		}
	};

	return (
		<Dialog.Root open={isOpen} onOpenChange={onClose}>
			<Dialog.Portal>
				<Dialog.Overlay className='task-modal-overlay' />
				<Dialog.Content className='task-modal-content'>
					{/* Task Name Input */}
					<input
						type='text'
						placeholder='Task Title'
						className='task-modal-input'
						value={taskName}
						onChange={(e) => setTaskName(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								handleCreateTask();
							}
						}}
					/>

					{/* Option Buttons */}
					<div className='task-modal-options'>
						<button className='option-button'>
							<Icons name='increase_decrease' />
							Estimate
						</button>
						<button className='option-button'>
							<Icons name='user' />
							Assignee
						</button>
						<button className='option-button'>
							<Icons name='tag' />
							Label
						</button>
						<button className='option-button'>
							<Icons name='calendar_check' />
							Due date
						</button>
					</div>

					{/* Action Buttons */}
					<div className='task-modal-actions'>
						<button className='action-button action-button--cancel' onClick={onClose}>
							Cancel
						</button>
						<button className='action-button action-button--create' onClick={handleCreateTask}>
							Create
						</button>
					</div>

					{/* Radix UI provides a close button primitive, but we're using our own for styling */}
					{/* <Dialog.Close asChild>
                        <button className="IconButton" aria-label="Close">
                            <Cross2Icon />
                        </button>
                    </Dialog.Close> */}
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
};

export default NewTask;
