import * as Popover from "@radix-ui/react-popover";
import React, { useState } from "react";
import Icons from "./Icons";
import { useMutation } from "@apollo/client";
import { DELETE_TASK_MUTATION } from "../../graphQL/mutations";
import { GET_TASKS_LIST } from "../../graphQL/queries";
import type { Task } from "../../graphQL/generated/graphql";
import { toast } from "react-toastify";

interface CardsMoreProps {
	children: React.ReactNode;
	onEditClick: (task: Task) => void;
	onDeleteClick?: () => void;
	taskId: string;
	taskData: Task;
}

const CardsMore = ({ children, onEditClick, onDeleteClick, taskId, taskData }: CardsMoreProps) => {
	const [isOpen, setIsOpen] = useState(false);

	const [deleteTask, { loading: deletingTask, error: deleteTaskError }] = useMutation(
		DELETE_TASK_MUTATION,
		{
			refetchQueries: [{ query: GET_TASKS_LIST, variables: { input: {} } }],
			onCompleted: () => {
				console.warn(`Task with ID ${taskId} deleted successfully.`);
				toast.success(`Task with ${taskData.name} deleted successfully.`);
			},
			onError: (error) => {
				toast.error(`Error deleting task with ID ${taskId}: ${error.message}`);
			},
		},
	);

	const handleEdit = () => {
		onEditClick(taskData);
		setIsOpen(false);
	};

	const handleDelete = async () => {
		if (deletingTask) return;

		const isConfirmed = window.confirm("Are you sure you want to delete this task?");
		if (!isConfirmed) {
			return;
		}

		try {
			await deleteTask({ variables: { input: { id: taskId } } });
			setIsOpen(false);
			onDeleteClick?.();
		} catch (error: unknown) {
			let errorMessage = "An unexpected error occurred.";
			if (error instanceof Error) {
				// Check if it's an instance of Error
				errorMessage = `An unexpected error occurred before deleting task: ${error.message}`;
			} else if (typeof error === "string") {
				// It could also be a string
				errorMessage = `An unexpected error occurred before deleting task: ${error}`;
			}
			toast.error(errorMessage);
		}
	};

	return (
		<Popover.Root open={isOpen} onOpenChange={setIsOpen}>
			<Popover.Trigger asChild>{children}</Popover.Trigger>
			<Popover.Portal>
				<Popover.Content className='cards-more-popover-content' sideOffset={5} align='end'>
					<button className='popover-option' onClick={handleEdit} disabled={deletingTask}>
						<Icons name='pencil' />
						<span>Edit</span>
					</button>

					<button
						className='popover-option popover-option--delete'
						onClick={() => {
							void handleDelete();
						}}
						disabled={deletingTask}
					>
						<Icons name='delete' />
						<span>{deletingTask ? "Deleting..." : "Delete"}</span>
					</button>
					{deleteTaskError && <span className='popover-error-message'>Error deleting!</span>}
					<Popover.Arrow className='popover-arrow' />
				</Popover.Content>
			</Popover.Portal>
		</Popover.Root>
	);
};

export default CardsMore;
