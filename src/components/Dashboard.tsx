import CardsColumn from "./UI-elements/CardsColumn";
import type { CardProps } from "./UI-elements/Cards";
import { useTasksQuery } from "../graphQL/generated/graphql";
import type { Task, TasksQuery, FilterTaskInput } from "../graphQL/generated/graphql";
import { convertPointEstimateToNumber, getTagColors } from "../components/TaskFormModal";

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
		// Format as "DD MONTH, YYYY" format
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

	const transformTaskToCardProps = (task: TasksQuery["tasks"][number]): CardProps => {
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
			avatarName: assignedAvatarText,
			avatarText: assignedAvatarText,
			taskData: task,
			onEditTask: onEditTask,

			// These counts are not in the current API schema, using placeholders:
			attachmentCount: 0, 
			subtaskCount: 5, 
			commentCount: 3,
		};
	};

	if (loading) {
		return <div className='task-board loading-message'>Loading tasks from API...</div>;
	}

	if (error) {
		return <div className='task-board error-message'>Error loading tasks: {error.message}</div>;
	}

	const allTasks = data?.tasks ?? [];

	// Client-side filtering for task name
	const filteredTasks = nameFilter
		? allTasks.filter((task) => task.name.toLowerCase().includes(nameFilter.toLowerCase()))
		: allTasks;

	const backlogCards: CardProps[] = [];
	const todoCards: CardProps[] = [];
	const inProgressCards: CardProps[] = [];
	const doneCards: CardProps[] = [];
	const cancelledCards: CardProps[] = [];

	filteredTasks.forEach((task) => {
		const transformedCard = transformTaskToCardProps(task);
		switch (task.status) {
			case "BACKLOG":
				backlogCards.push(transformedCard);
				break;
			case "TODO":
				todoCards.push(transformedCard);
				break;
			case "IN_PROGRESS":
				inProgressCards.push(transformedCard);
				break;
			case "DONE":
				doneCards.push(transformedCard);
				break;
			case "CANCELLED":
				cancelledCards.push(transformedCard);
				break;
			default:
				console.warn(`Unknown task status: ${String(task.status)}`);
				break;
		}
	});

	return (
		<div className='task-board'>
			<CardsColumn title='BACKLOG' cards={backlogCards} onEditTask={onEditTask} />
			<CardsColumn title='TODO' cards={todoCards} onEditTask={onEditTask} />
			<CardsColumn title='IN PROGRESS' cards={inProgressCards} onEditTask={onEditTask} />
			<CardsColumn title='DONE' cards={doneCards} onEditTask={onEditTask} />
			<CardsColumn title='CANCELLED' cards={cancelledCards} onEditTask={onEditTask} />
		</div>
	);
};

export default Dashboard;
