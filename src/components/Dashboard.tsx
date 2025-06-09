import CardsColumn from "./UI-elements/CardsColumn";
import type { CardProps } from "./UI-elements/Cards";
import { useTasksQuery } from "../graphQL/generated/graphql";
import type { TasksQuery, TaskTag, PointEstimate } from "../graphQL/generated/graphql";

// Helper function to convert PointEstimate enum (string) to a number
const convertPointEstimateToNumber = (pointEstimate: string): number | string => {
	switch (pointEstimate as PointEstimate) {
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
			console.warn(`Unknown or non-PointEstimate value: ${pointEstimate}. Returning "N/A".`);
			return "N/A"; // Fallback
	}
};

const Dashboard = () => {
	const { loading, error, data } = useTasksQuery({
		variables: {
			input: {},
		},
	});

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

			// FUTUREPROOFING: In case wanting a Locale Datein the future:
			// 		const options: Intl.DateTimeFormatOptions = {
			// 		day: "numeric",
			// 		month: "long",
			// 		year: "numeric",
			// 		};
			// 		return taskDate.toLocaleDateString("en-US", options).toUpperCase();
		}
	};

	// Helper function to map TaskTag string literal to specific background and text colors
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

	const transformTaskToCardProps = (task: TasksQuery["tasks"][number]): CardProps => {
		const assignedAvatarText = task.assignee?.fullName ?? "Unassigned";

		return {
			title: task.name,
			points: `${convertPointEstimateToNumber(task.pointEstimate)} Points`,
			timeTagText: formatDueDateForCard(task.dueDate),
			tags: task.tags.map((tag) => ({
				text: tag.toString().replace("_", " ").toUpperCase(),
				...getTagColors(tag),
			})),
			avatarName: assignedAvatarText,
			avatarText: assignedAvatarText,

			// These counts are not in the current API schema, using placeholders:
			attachmentCount: 0, // Placeholder
			subtaskCount: 5, // Placeholder
			commentCount: 3, // Placeholder
		};
	};

	if (loading) {
		return <div className='task-board loading-message'>Loading tasks from API...</div>;
	}

	if (error) {
		return <div className='task-board error-message'>Error loading tasks: {error.message}</div>;
	}

	const backlogCards: CardProps[] = [];
	const todoCards: CardProps[] = [];
	const inProgressCards: CardProps[] = [];
	const doneCards: CardProps[] = [];
	const cancelledCards: CardProps[] = [];

	if (data?.tasks) {
		data.tasks.forEach((task) => {
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
	}

	return (
		<div className='task-board'>
			<CardsColumn title='BACKLOG' cards={backlogCards} />
			<CardsColumn title='TODO' cards={todoCards} />
			<CardsColumn title='IN PROGRESS' cards={inProgressCards} />
			<CardsColumn title='DONE' cards={doneCards} />
			<CardsColumn title='CANCELLED' cards={cancelledCards} />
		</div>
	);
};

export default Dashboard;
