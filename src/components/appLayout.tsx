import React, { useState } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { SwitchButton, AddButton } from "./UI-elements/Buttons";
const LazyDashboard = React.lazy(() => import("./Dashboard"));
import NewTask from "./NewTask";

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
					<LazyDashboard />
					<NewTask isOpen={isTaskModalOpen} onClose={handleTaskModalClose} />
				</div>
			</div>
		</div>
	);
};

export default AppLayout;
