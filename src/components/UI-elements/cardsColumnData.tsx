import CardsColumn from "./CardsColumn";
import type { CardProps } from "./Cards";
import { useTasksQuery } from "../../graphQL/generated/graphql";
import type { TaskTag, TasksQuery, PointEstimate } from "../../graphQL/generated/graphql";

const AVATAR_FILENAMES = [
	"alex.jpg",
	"anna.jpg",
	"christina.jpg",
	"default-avatar.jpg",
	"diego.jpg",
	"jacqueline.jpg",
	"joseph.jpg",
	"jude.jpg",
	"liam.jpg",
	"michelle.jpg",
	"stephanie.jpg",
	"victor.jpg",
];
// Here are ALL the current avatars filenames

const getRandomAvatarFilename = (): string => {
	debugger;
	const randomIndex = Math.floor(Math.random() * AVATAR_FILENAMES.length);
	return AVATAR_FILENAMES[randomIndex];
};

// Helper function to convert PointEstimate enum (string) to a number
const convertPointEstimateToNumber = (pointEstimate: PointEstimate): number | string => {
	switch (pointEstimate) {
		case "ZERO":
			return 0;
		case "ONE":
			return 1;
		case "TWO":
			return 2;
		case "THREE":
			return 3;
		case "FOUR":
			return 4;
		case "EIGHT":
			return 8;
		default:
			console.warn(`Unknown PointEstimate: ${pointEstimate}. Returning original string.`);
			return "unknown"; // Fallback to original string if unknown
	}
};

const TaskBoard = () => {
	// Fetch all tasks using the generated Apollo hook
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
					textColor: "var(--color-neutral-4)",
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
		const assignedAvatarFilename = getRandomAvatarFilename();
		// FUTUREPROOFING: Assignee's avatars are currently blank, if available change:
		// 		const assignedAvatarFilename = ask.assignee?.avatar;
		const assignedAvatarText = task.assignee?.fullName || "Unassigned";

		return {
			title: task.name,
			points: `${convertPointEstimateToNumber(task.pointEstimate)} Points`,
			timeTagText: formatDueDateForCard(task.dueDate),
			tags: task.tags.map((tag) => ({
				text: tag.toString().replace("_", " ").toUpperCase(),
				...getTagColors(tag),
			})),
			avatarFilename: assignedAvatarFilename,
			avatarText: assignedAvatarText,

			// These counts are not in the current API schema, using placeholders as before
			attachmentCount: 0, // Placeholder
			estimateCount: 0, // Placeholder
			chatCount: 0, // Placeholder
		};
	};

	if (loading) {
		return <div className='task-board loading-message'>Loading tasks from API...</div>;
	}

	if (error) {
		return <div className='task-board error-message'>Error loading tasks: {error.message}</div>;
	}

	// Group tasks by status
	const workingCards: CardProps[] = [];
	const inProgressCards: CardProps[] = [];
	const completedCards: CardProps[] = [];

	if (data && data.tasks) {
		data.tasks.forEach((task) => {
			const transformedCard = transformTaskToCardProps(task);
			switch (task.status) {
				case "TODO":
				case "BACKLOG":
					workingCards.push(transformedCard);
					break;
				case "IN_PROGRESS":
					inProgressCards.push(transformedCard);
					break;
				case "DONE":
				case "CANCELLED":
					completedCards.push(transformedCard);
					break;
				default:
					console.warn(`Unknown task status: ${task.status}`);
					break;
			}
		});
	}

	return (
		<div className='task-board'>
			<CardsColumn title='Working' cards={workingCards} />
			<CardsColumn title='In Progress' cards={inProgressCards} />
			<CardsColumn title='Completed' cards={completedCards} />
		</div>
	);
};

export default TaskBoard;
