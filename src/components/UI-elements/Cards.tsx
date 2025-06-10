import MenuIcon from "./sidebarMenuIcon";
import Tags from "./Tags";
import Avatar from "./Avatar";
import CardsMore from "./cardsMore";
import type { Task } from "../../graphQL/generated/graphql";

export interface CardProps {
	id: string;
	title: string;
	points: string;
	timeTagText: string;
	tags: Array<{ text: string; backgroundColor: string; textColor: string }>;
	avatarName: string;
	avatarText: string;
	attachmentCount: number;
	subtaskCount: number;
	commentCount: number;
	className?: string;
	taskData: Task;
	onEditTask: (task: Task) => void;
}

const Cards = ({
	id,
	title,
	points,
	timeTagText,
	tags,
	avatarName,
	avatarText,
	attachmentCount,
	subtaskCount,
	commentCount,
	className,
	taskData,
	onEditTask,
}: CardProps) => {
	const cardClasses = ["card"];
	if (className) {
		cardClasses.push(className);
	}

	const InfoItem = ({ count, iconName }: { count: number; iconName: string }) => (
		<div className='info-item'>
			<span className='info-item__number'>{count}</span>
			<span className='info-item__icon'>
				<MenuIcon iconName={iconName} />
			</span>
		</div>
	);

	const handleEditTask = () => {
		console.warn(`Edit task: ${title} (ID: ${id})`);
		onEditTask(taskData);
	};

	const handleDeleteTask = () => {
		console.warn(`Attempting to delete task: ${title} (ID: ${id})`);
	};

	const getDateTagColors = (
		dueDate: Date | null | undefined,
	): { backgroundColor: string; textColor?: string } => {
		if (!dueDate) {
			// Fallback in case of no Date
			return {
				backgroundColor: "var(--color-neutral-3)",
			};
		}

		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const due = new Date(dueDate);
		due.setHours(0, 0, 0, 0);

		const diffTime = due.getTime() - today.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		if (diffDays < 0) {
			// Date is older than current date (past due)
			return {
				backgroundColor: "var(--color-primary-3)",
				textColor: "var(--color-neutral-1)",
				// backgroundColor: "var(--color-primary-4-1)",
				// textColor: "var(--color-primary-4)",
			};
		} else if (diffDays <= 1) {
			// Less than 2 days left (today or tomorrow)
			return {
				backgroundColor: "var(--color-tertiary-3)",
				textColor: "var(--color-neutral-1)",
				// backgroundColor: "var(--color-tertiary-4-1)",
				// textColor: "var(--color-tertiary-4)",
			};
		} else {
			return {
				backgroundColor: "var(--color-secondary-3)",
				textColor: "var(--color-neutral-1)",
				// backgroundColor: "var(--color-secondary-4-1)",
				// textColor: "var(--color-secondary-4)",
			};
		}
	};

	const dateTagColors = getDateTagColors(taskData.dueDate);

	return (
		<div className={cardClasses.join(" ")}>
			{/* Section 1: Title */}
			<div className='card__section-1'>
				<h3 className='card__title'>{title}</h3>
				<CardsMore
					taskId={id}
					taskData={taskData}
					onEditClick={handleEditTask}
					onDeleteClick={handleDeleteTask}
				>
					<button className='more-icon-button' aria-label='More options for task'>
						<MenuIcon iconName='more_X' />
					</button>
				</CardsMore>
			</div>

			{/* Section 2: Points and Date Tag */}
			<div className='card__section-2'>
				<span className='card__points'>{points}</span>
				<Tags
					text={timeTagText}
					iconName='alarm'
					backgroundColor={dateTagColors.backgroundColor}
					textColor={dateTagColors.textColor}
				/>
			</div>

			{/* Section 3: Tags */}
			<div className='card__section-3'>
				{tags.map((tag, index) => (
					<Tags
						key={index}
						text={tag.text}
						backgroundColor={tag.backgroundColor}
						textColor={tag.textColor}
					/>
				))}
			</div>

			{/* Section 4: Avatar and Info Icons */}
			<div className='card__section-4'>
				<Avatar avatarName={avatarName} size='s' text={avatarText} />{" "}
				<div className='card__info-items'>
					<InfoItem count={attachmentCount} iconName='attachment' />
					<InfoItem count={subtaskCount} iconName='node' />
					<InfoItem count={commentCount} iconName='chat' />
				</div>
			</div>
		</div>
	);
};

export default Cards;

export const EmptyCard = () => {
	return (
		<div className='card empty'>
			{/* Section 1: Title */}
			<div className='card__section-1'>
				<h3 className='card__title'>No tasks in this column yet.</h3>
			</div>
		</div>
	);
};
