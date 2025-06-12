import Cards, { EmptyCard } from "./Cards";
import type { CardProps } from "./Cards";
import type { Task } from "../../graphql/generated/graphql";

interface CardsColumnProps {
	title: string;
	cards: CardProps[];
	className?: string;
	onEditTask: (task: Task) => void;
}

const CardsColumn = ({ title, cards, className, onEditTask }: CardsColumnProps) => {
	const columnClasses = ["cards-column"];
	if (className) {
		columnClasses.push(className);
	}

	const cardCount = cards.length;

	return (
		<div>
			<h2 className='cards-column__title'>
				{title} ({cardCount === 0 ? "0" : cardCount.toString().padStart(2, "0")})
			</h2>
			<div className='cards-column__list'>
				{cards.length > 0 ? (
					cards.map((card) => <Cards key={card.title} {...card} onEditTask={onEditTask} />)
				) : (
					<div className='cards-column__empty-state'>
						<EmptyCard />
					</div>
				)}
			</div>
		</div>
	);
};

export default CardsColumn;
