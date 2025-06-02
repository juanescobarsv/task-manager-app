import CardsColumn from "./CardsColumn";
import type { CardProps } from "./Cards";

const CardsColumnData: React.FC = () => {
	const workingCards: CardProps[] = [
		{
			title: "Slack",
			points: "4 Points",
			timeTagText: "TODAY",
			tags: [
				{
					text: "IOS APP",
					backgroundColor: "var(--color-secondary-4-1)",
					textColor: "var(--color-secondary-4)",
				},
				{
					text: "ANDROID",
					backgroundColor: "var(--color-tertiary-4-1)",
					textColor: "var(--color-tertiary-4)",
				},
			],
			avatarFilename: "christina.jpg", // Example filename
			avatarText: "Jerome Bell",
			attachmentCount: 5,
			estimateCount: 3,
			chatCount: 0,
		},
		{
			title: "Google",
			points: "4 Points",
			timeTagText: "6 JULY, 2020",
			tags: [
				{
					text: "IOS APP",
					backgroundColor: "var(--color-secondary-4-1)",
					textColor: "var(--color-secondary-4)",
				},
				{
					text: "ANDROID",
					backgroundColor: "var(--color-tertiary-4-1)",
					textColor: "var(--color-tertiary-4)",
				},
			],
			avatarFilename: "anna.jpg", // Example filename
			avatarText: "Jerome Bell",
			attachmentCount: 5,
			estimateCount: 3,
			chatCount: 0,
		},
	];

	const inProgressCards: CardProps[] = [
		{
			title: "Twitter",
			points: "1 Points",
			timeTagText: "YESTERDAY",
			tags: [
				{
					text: "IOS APP",
					backgroundColor: "var(--color-secondary-4-1)",
					textColor: "var(--color-secondary-4)",
				},
				{
					text: "ANDROID",
					backgroundColor: "var(--color-tertiary-4-1)",
					textColor: "var(--color-tertiary-4)",
				},
			],
			avatarFilename: "stephanie.jpg", // Example filename
			avatarText: "Jerome Bell",
			attachmentCount: 5,
			estimateCount: 3,
			chatCount: 0,
		},
		{
			title: "Maxxis Tyres",
			points: "4 Points",
			timeTagText: "6 JULY, 2020",
			tags: [
				{
					text: "IOS APP",
					backgroundColor: "var(--color-secondary-4-1)",
					textColor: "var(--color-secondary-4)",
				},
				{
					text: "ANDROID",
					backgroundColor: "var(--color-tertiary-4-1)",
					textColor: "var(--color-tertiary-4)",
				},
			],
			avatarFilename: "jude.jpg", // Example filename
			avatarText: "Jerome Bell",
			attachmentCount: 5,
			estimateCount: 3,
			chatCount: 0,
		},
		{
			title: "Samsung",
			points: "4 Points",
			timeTagText: "6 JULY, 2020",
			tags: [
				{
					text: "IOS APP",
					backgroundColor: "var(--color-secondary-4-1)",
					textColor: "var(--color-secondary-4)",
				},
				{
					text: "ANDROID",
					backgroundColor: "var(--color-tertiary-4-1)",
					textColor: "var(--color-tertiary-4)",
				},
			],
			avatarFilename: "jacqueline.jpg",
			avatarText: "Jerome Bell",
			attachmentCount: 5,
			estimateCount: 3,
			chatCount: 0,
		},
	];

	const completedCards: CardProps[] = [];

	return (
		<div className='task-board'>
			<CardsColumn title='Working' cards={workingCards} />
			<CardsColumn title='In Progress' cards={inProgressCards} />
			<CardsColumn title='Completed' cards={completedCards} />
		</div>
	);
};

export default CardsColumnData;
