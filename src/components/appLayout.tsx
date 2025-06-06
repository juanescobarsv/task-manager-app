import { useState } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./UI-elements/TopBar";
import { SwitchButton, AddButton } from "./UI-elements/Buttons";
import TaskBoard from "./UI-elements/cardsColumnData";
import NewTask from "./UI-elements/NewTask";
import type { User } from "./UI-elements/NewTask";

// import DataViewer from "./Testing/DataViewer";

const AppLayout = () => {
	const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

	const handleSwitchSelect = (selected: "menu" | "function") => {
		console.warn("Switch button selected:", selected);
	};

	const handleAddButtonClick = () => {
		setIsTaskModalOpen(true);
	};

	const handleTaskModalClose = () => {
		setIsTaskModalOpen(false);
	};

	// Updated onSubmit signature to accept assignee of type User
	const handleCreateTaskSubmit = (
		taskName: string,
		estimate: number | null,
		assignee: User | null, // NEW: User type
	) => {
		console.warn(
			`New task created: "${taskName}" with estimate: ${estimate} Points, assigned to: ${assignee ? assignee.fullName : "No one"}`,
		);
		// Here, you would typically integrate with your GraphQL mutation
		// to create the task on the backend, using taskName, estimate, and assignee.
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
						isOpen={isTaskModalOpen}
						onClose={handleTaskModalClose}
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
