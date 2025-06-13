import { useState, useMemo, useCallback, useEffect } from "react";
import CardsColumn from "./CardsColumn";
import type { CardProps } from "./Cards";
import { useTasksQuery } from "../../graphql/generated/graphql";
import type { Task, TasksQuery, FilterTaskInput, Status } from "../../graphql/generated/graphql";
import { convertPointEstimateToNumber, getTagColors } from "../modals-popovers/NewTask"; // Corrected path to modals-popovers

import {
	DndContext,
	closestCorners,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	type DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";

// Helper function to format dueDate for the card's timeTagText
const formatDueDateForCard = (dueDate: Date | null | undefined): string => {
	if (!dueDate) return "N/A";

	const today = new Date();
	today.setHours(0, 0, 0, 0); // Normalize to start of day
	const yesterday = new Date(today);
	yesterday.setDate(today.getDate() - 1);

	const taskDate = new Date(dueDate);
	taskDate.setHours(0, 0, 0, 0); // Normalize to start of day

	if (taskDate.getTime() === today.getTime()) {
		return "TODAY";
	} else if (taskDate.getTime() === yesterday.getTime()) {
		return "YESTERDAY";
	} else {
		// Format as "DD MONTH,YYYY" format
		const day = taskDate.getDate();
		const month = taskDate.toLocaleString("en-US", { month: "long" }).toUpperCase();
		const year = taskDate.getFullYear();
		return `${day} ${month}, ${year}`;
	}
};

interface DashboardProps {
	onEditTask: (task: Task) => void;
	filterInput?: FilterTaskInput;
}

const Dashboard = ({ onEditTask, filterInput = {} }: DashboardProps) => {
	const { name: nameFilter, ...apiFilterInput } = filterInput;

	const { loading, error, data } = useTasksQuery({
		variables: {
			input: apiFilterInput,
		},
	});

	// --- START: React Hook declarations (MUST be at the top level) ---

	// Local state for tasks to handle drag-and-drop updates immediately in the UI
	const [tasks, setTasks] = useState<Task[]>([]);

	// Helper function to transform a Task object into CardProps for the Cards component
	// Using useCallback to memoize this function as it's passed to useMemo for groupedTasks
	const transformTaskToCardProps = useCallback(
		(task: TasksQuery["tasks"][number]): CardProps => {
			const assignedAvatarText = task.assignee?.fullName ?? "Unassigned";

			return {
				id: task.id,
				title: task.name,
				points: `${convertPointEstimateToNumber(task.pointEstimate)} Points`,
				timeTagText: formatDueDateForCard(task.dueDate),
				tags: task.tags.map((tag) => ({
					text: tag.toString().replace("_", " ").toUpperCase(),
					...getTagColors(tag),
				})),
				// IMPORTANT: Using avatarNameForRoboHash to match the Cards.tsx prop
				avatarName: assignedAvatarText, // Use avatarNameForRoboHash
				avatarText: assignedAvatarText,
				taskData: task,
				onEditTask: onEditTask,

				// These counts are not in the current API schema, using placeholders:
				attachmentCount: 0,
				subtaskCount: 5,
				commentCount: 3,
			};
		},
		[onEditTask],
	);

	// Set up Dnd-Kit sensors for pointer and keyboard interactions
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	// Main drag end handler function
	const handleDragEnd = useCallback(
		(event: DragEndEvent) => {
			const { active, over } = event;

			// If no active or over element, do nothing
			if (!active || !over) return;

			const activeId = String(active.id); // ID of the task being dragged
			const overId = String(over.id); // ID of the element being dragged over

			// Define the expected structure for Dnd-Kit's custom data
			interface DndItemData {
				sortable?: {
					containerId: Status; // The ID of the column (Status enum)
					index: number;
					items: string[];
				};
			}

			// Type assert the active and over data for safer property access
			const activeData = active.data.current as DndItemData | undefined;
			const overData = over.data.current as DndItemData | undefined;

			// Determine the source column ID from the active item's data
			const activeColumnId: Status | undefined = activeData?.sortable?.containerId;
			// Determine the target column ID: it's either the containerId of the over item
			// or the ID of the over element itself (if dropping directly onto a column)
			let targetColumnId: Status | undefined;
			if (overData?.sortable?.containerId) {
				targetColumnId = overData.sortable.containerId;
			} else {
				targetColumnId = typeof over.id === "string" ? (over.id as Status) : undefined;
			}

			// Critical check: ensure both active and target columns are valid
			if (!activeColumnId || !targetColumnId) {
				console.error("Missing column ID for drag operation. Active or Over data incomplete.");
				return;
			}

			// Find the task object that was dragged from the local state
			const draggedTask: Task | undefined = tasks.find((task: Task) => task.id === activeId);

			if (!draggedTask) {
				console.error(`Dragged task with ID ${activeId} not found in state.`);
				return;
			}

			// Scenario 1: Dragging to a new column (status change)
			if (activeColumnId !== targetColumnId) {
				setTasks((prevTasks: Task[]) => {
					// Update the status of the dragged task in the local state
					const newTasks = prevTasks.map((task: Task) =>
						task.id === activeId ? { ...task, status: targetColumnId } : task,
					);
					return newTasks;
				});
				console.warn(`Task ${draggedTask.name} moved from ${activeColumnId} to ${targetColumnId}`);
				// TODO: Implement API mutation for status change here
			}
			// Scenario 2: Dragging within the same column (reordering)
			else {
				// `activeColumnId === targetColumnId` implicitly
				// Filter tasks to get only those in the affected column
				const currentTasksInColumn: Task[] = tasks.filter(
					(task: Task) => task.status === activeColumnId,
				);

				// Find the old and new indices of the dragged item within that specific column's list
				const oldIndex: number = currentTasksInColumn.findIndex(
					(task: Task) => task.id === activeId,
				);
				const newIndex: number = currentTasksInColumn.findIndex((task: Task) => task.id === overId);

				// If both indices are valid and different, perform reordering
				if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
					// Use arrayMove from dnd-kit/sortable to reorder the tasks in the column
					const reorderedColumnTasks: Task[] = arrayMove(currentTasksInColumn, oldIndex, newIndex);

					// Update the main tasks state with the reordered column's tasks
					setTasks((prevTasks: Task[]) => {
						// First, filter out the old tasks from the active column
						const tasksOutsideColumn: Task[] = prevTasks.filter(
							(task: Task) => task.status !== activeColumnId,
						);
						// Combine them with the newly reordered tasks for that column
						return [...tasksOutsideColumn, ...reorderedColumnTasks];
					});
					console.warn(
						`Task ${draggedTask.name} reordered within ${activeColumnId} from index ${oldIndex} to ${newIndex}`,
					);
					// TODO: Implement API mutation for reordering here (requires a 'position' field in backend)
				}
			}
		},
		[tasks], // Dependency array for useCallback: tasks state is needed for correct array manipulation
	);

	// Client-side filtering for task name, derived from the local 'tasks' state
	// Use useMemo to re-calculate only when 'tasks' or 'nameFilter' changes
	const filteredTasks: Task[] = useMemo(() => {
		if (nameFilter) {
			return tasks.filter((task: Task) =>
				task.name.toLowerCase().includes(nameFilter.toLowerCase()),
			);
		}
		return tasks;
	}, [tasks, nameFilter]);

	// Group the filtered tasks by their status for rendering into columns
	const groupedTasks: Record<Status, CardProps[]> = useMemo(() => {
		const initialGroups: Record<Status, CardProps[]> = {
			BACKLOG: [],
			TODO: [],
			IN_PROGRESS: [],
			DONE: [],
			CANCELLED: [],
		};

		filteredTasks.forEach((task: Task) => {
			const transformedCard = transformTaskToCardProps(task);
			if (task.status in initialGroups) {
				initialGroups[task.status].push(transformedCard);
			} else {
				console.warn(`Task with unknown status "${task.status}" encountered.`);
			}
		});
		return initialGroups;
	}, [filteredTasks, transformTaskToCardProps]); // Re-memoize if filteredTasks or transform logic changes

	// --- END: React Hook declarations ---

	// Update local tasks state when the Apollo query data changes
	useEffect(() => {
		if (data?.tasks) {
			setTasks(data.tasks);
		}
	}, [data?.tasks]);

	// Handle loading and error states for the main query
	if (loading) {
		return <div className='dashboard loading-message'>Loading tasks from API...</div>;
	}

	if (error) {
		// Explicitly cast error to Error to ensure 'message' property exists for TypeScript
		return (
			<div className='dashboard error-message'>Error loading tasks: {(error as Error).message}</div>
		);
	}

	// Define the desired order of columns to render
	const columnOrder: Status[] = ["BACKLOG", "TODO", "IN_PROGRESS", "DONE", "CANCELLED"];

	return (
		// The DndContext wraps the entire draggable/droppable area
		<DndContext
			sensors={sensors}
			collisionDetection={closestCorners}
			onDragEnd={(event) => {
				void handleDragEnd(event);
			}}
		>
			<div className='dashboard'>
				{columnOrder.map((status) => (
					<CardsColumn
						key={status}
						columnId={status}
						title={status.replace("_", " ")}
						cards={groupedTasks[status]}
						onEditTask={onEditTask}
					/>
				))}
			</div>
		</DndContext>
	);
};

export default Dashboard;
