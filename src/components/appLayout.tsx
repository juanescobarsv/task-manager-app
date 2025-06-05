import { useState } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./UI-elements/TopBar";
import { SwitchButton, AddButton } from "./UI-elements/Buttons";
import TaskBoard from "./UI-elements/cardsColumnData";
import NewTask from "./UI-elements/NewTask";

// import DataViewer from "./Testing/DataViewer";

const AppLayout = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleSwitchSelect = (selected: "menu" | "function") => {
		console.warn("Switch button selected:", selected);
	};

	const handleAddButtonClick = () => {
		setIsModalOpen(true); // Open the modal when AddButton is clicked
	};

	const handleModalClose = () => {
		setIsModalOpen(false); // Close the modal
	};

	const handleCreateTaskSubmit = (taskName: string) => {
		console.warn("New task created:", taskName);
		// PENDING
	};

	return (
		<div className='app-layout'>
			<div className='sidebar-container'>
				<Sidebar />
			</div>

			<div className='main-content'>
				<div className='main-content__header'>
					<TopBar />
				</div>

				{/* Controls for SwitchButton and AddButton */}
				<div className='main-content__controls'>
					<SwitchButton onSelect={handleSwitchSelect} />
					<AddButton onClick={handleAddButtonClick} />
				</div>

				{/* Dashboard */}
				<div className='main-content__task-board-wrapper'>
					<TaskBoard />
					<NewTask
						isOpen={isModalOpen}
						onClose={handleModalClose}
						onSubmit={handleCreateTaskSubmit}
					/>
					{/* FOR API TESTING:
					<DataViewer /> */}
				</div>
			</div>
		</div>
	);
};

export default AppLayout;
