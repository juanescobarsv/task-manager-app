import Cards from "./Cards";
import type { CardProps } from "./Cards";

interface CardsColumnProps {
	title: string;
	cards: CardProps[];
	className?: string;
}

const CardsColumn: React.FC<CardsColumnProps> = ({ title, cards, className }) => {
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
				{cards.map((cardData, index) => (
					<Cards key={index} {...cardData} />
				))}
			</div>
		</div>
	);
};

export default CardsColumn;
