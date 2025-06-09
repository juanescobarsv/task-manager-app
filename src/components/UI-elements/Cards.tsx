import MenuIcon from "./sidebarMenuIcon";
import Tags from "./Tags";
import Avatar from "./Avatar";

export interface CardProps {
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
}

const Cards = ({
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

	return (
		<div className={cardClasses.join(" ")}>
			{/* Section 1: Title */}
			<div className='card__section-1'>
				<h3 className='card__title'>{title}</h3>
				<div className='more-icon' role='button' tabIndex={0}>
					<MenuIcon iconName='more_X' />
				</div>
			</div>

			{/* Section 2: Points and Date Tag */}
			<div className='card__section-2'>
				<span className='card__points'>{points}</span>
				<Tags
					text={timeTagText}
					iconName='alarm'
					backgroundColor='var(--color-neutral-3)'
					textColor='var(--color-neutral-1)'
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
