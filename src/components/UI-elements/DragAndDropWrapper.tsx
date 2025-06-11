// import { useMemo, useCallback } from "react";
// import {
// 	DndContext,
// 	closestCorners,
// 	KeyboardSensor,
// 	PointerSensor,
// 	useSensor,
// 	useSensors,
// 	type DragEndEvent,
// } from "@dnd-kit/core";
// import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
// import { useTasksQuery, useUpdateTaskMutation } from "../../graphQL/generated/graphql";
// import type { Task, FilterTaskInput, Status } from "../../graphQL/generated/graphql";
// import { GET_TASKS_LIST } from "../../graphQL/queries";

// interface DndWrapperProps {
// 	onEditTask: (task: Task) => void;
// 	filterInput: FilterTaskInput;
// 	searchTerm: string;
// }

// interface DndItemData {
// 	sortable?: {
// 		containerId: Status;
// 		index: number;
// 		items: string[];
// 		// Add other properties if needed for more complex D&D logic
// 	};
// 	// Add other custom data if your draggable/droppable components provide it
// 	id: string;
// }

// const DNDWrapper = ({ onEditTask, filterInput, searchTerm }: DndWrapperProps) => {
// 	const { loading, error, data, refetch } = useTasksQuery({
// 		variables: {
// 			input: filterInput,
// 		},
// 	});

// 	const groupedTasks: Record<Status, Task[]> = useMemo(() => {
// 		const initialGroups: Record<Status, Task[]> = {
// 			BACKLOG: [],
// 			TODO: [],
// 			IN_PROGRESS: [],
// 			DONE: [],
// 			CANCELLED: [],
// 		};

// 		const allTasks: Task[] = data?.tasks ?? [];
// 		const filteredTasks = allTasks.filter((task: Task) => {
// 			const matchesSearch = searchTerm
// 				? task.name.toLowerCase().includes(searchTerm.toLowerCase())
// 				: true;
// 			return matchesSearch;
// 		});

// 		filteredTasks.forEach((task) => {
// 			if (task.status in initialGroups) {
// 				initialGroups[task.status].push(task);
// 			}
// 		});
// 		return initialGroups;
// 	}, [data, searchTerm, filterInput]);

// 	const sensors = useSensors(
// 		useSensor(PointerSensor),
// 		useSensor(KeyboardSensor, {
// 			coordinateGetter: sortableKeyboardCoordinates,
// 		}),
// 	);

// 	const [updateTaskMutation] = useUpdateTaskMutation({
// 		refetchQueries: [{ query: GET_TASKS_LIST, variables: { input: filterInput } }],
// 		onError: (err) => {
// 			console.error("Failed to update task via D&D:", err.message);
// 			alert(`Failed to update task: ${err.message}`);
// 			void refetch();
// 		},
// 	});

// 	// Main drag end handler
// 	const handleDragEnd = useCallback(
// 		async (event: DragEndEvent) => {
// 			const { active, over } = event;

// 			if (!active || !over) return;

// 			// ID of the task being dragged
// 			const activeId = String(active.id);
// 			const overId = String(over.id);

// 			// Safely access and type the custom data from dnd-kit's active and over elements
// 			const activeData = active.data.current as DndItemData | undefined;
// 			const overData = over.data.current as DndItemData | undefined;

// 			const activeColumnId = activeData.sortable!.containerId as Status;
// 			const targetColumnId = (overData?.sortable?.containerId ?? over.id) as Status;

// 			const draggedTask = Object.values(groupedTasks)
// 				.flat()
// 				.find((task) => task.id === activeId);

// 			if (!draggedTask) return;

// 			// Scenario 1: Dragging to a new column (status change)
// 			if (activeColumnId !== targetColumnId) {
// 				try {
// 					await updateTaskMutation({
// 						variables: {
// 							input: {
// 								id: draggedTask.id,
// 								status: targetColumnId,
// 							},
// 						},
// 					});
// 					console.warn(
// 						`Task ${draggedTask.name} moved from ${activeColumnId} to ${targetColumnId}`,
// 					);
// 				} catch (err) {
// 					// Error handled by `onError` in `useUpdateTaskMutation`
// 				}
// 			}
// 			// Scenario 2: Dragging within the same column (reordering)
// 			else {
// 				const currentTasksInColumn: Task[] = groupedTasks[activeColumnId];
// 				const oldIndex: number = currentTasksInColumn.findIndex((task) => task.id === activeId);
// 				const newIndex: number = currentTasksInColumn.findIndex((task) => task.id === overId);

// 				if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
// 					console.warn(
// 						`Task ${draggedTask.name} reordered within ${activeColumnId} from index ${oldIndex} to ${newIndex}`,
// 					);
// 					// NOTE: For persistent reordering within a column, you would need
// 					// to implement a backend field (e.g., 'position') and send an update
// 					// mutation for the affected tasks here. The dnd-kit visual reordering
// 					// is handled by SortableContext and verticalListSortingStrategy in CardsColumnData/CardsColumn.
// 				}
// 			}
// 		},
// 		[groupedTasks, updateTaskMutation, refetch, filterInput],
// 	); // Dependencies for useCallback

// 	if (loading) {
// 		return <div className='loading-screen'>Loading tasks for board...</div>;
// 	}

// 	if (error) {
// 		return <div className='error-screen'>Error loading tasks: {error.message}</div>;
// 	}

// 	return (
// 		<DndContext
// 			sensors={sensors}
// 			collisionDetection={closestCorners}
// 			onDragEnd={(event) => {
// 				void handleDragEnd(event);
// 			}}
// 		>
// 			{/* {children} */}
// 		</DndContext>
// 	);
// };

// export default DNDWrapper;
