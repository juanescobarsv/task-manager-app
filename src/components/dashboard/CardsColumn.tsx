import Cards, { EmptyCard } from "./Cards";
import type { CardProps } from "./Cards";
import type { Task } from "../../graphql/generated/graphql";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

interface CardsColumnProps {
	title: string;
	cards: CardProps[];
	className?: string;
	onEditTask: (task: Task) => void; // Callback trigger fpr NewTask moda
	columnId: string; // ID for dnd-kit
}

const CardsColumn = ({ title, cards, className, onEditTask, columnId }: CardsColumnProps) => {
	const columnClasses = ["cards-column"];
	if (className) {
		columnClasses.push(className);
	}

	// Make the entire column a droppable area (its ID is columnId)
	const { setNodeRef: setDroppableNodeRef, isOver } = useDroppable({
		id: columnId,
	});

	const cardCount = cards.length;

	return (
		<div
			ref={setDroppableNodeRef}
			className={columnClasses.join(" ")}
			style={{
				// Visual feedback when a column is being dragged over:
				backgroundColor: isOver ? "rgba(var(--color-primary-4-rgb), 0.1)" : undefined,
				borderRadius: isOver ? "var(--border-radius-lg)" : undefined,
			}}
		>
			{" "}
			<h2 className='cards-column__title'>
				{title} ({cardCount === 0 ? "0" : cardCount.toString().padStart(2, "0")})
			</h2>
			<div className='cards-column__list'>
				<SortableContext
					items={cards.map((card) => card.id)}
					strategy={verticalListSortingStrategy}
				>
					{cards.length > 0 ? (
						cards.map((card) => (
							// Pass the onEditTask callback to each Card
							<Cards key={card.id} {...card} onEditTask={onEditTask} />
						))
					) : (
						<div className='cards-column__empty-state'>
							<EmptyCard />
							{/* Display droppable message if column is empty and being dragged over */}
							{isOver && <p>Drop here</p>}
						</div>
					)}
				</SortableContext>
			</div>
		</div>
	);
};

export default CardsColumn;
