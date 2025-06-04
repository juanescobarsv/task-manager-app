import React from "react";
import Sidebar from "./Sidebar";
import TopBar from "./UI-elements/TopBar";
import { SwitchButton, AddButton } from "./UI-elements/Buttons";
import TaskBoard from "./UI-elements/cardsColumnData";
import DataViewer from "./Testing/DataViewer";

const AppLayout: React.FC = () => {
	const handleSwitchSelect = (selected: "menu" | "function") => {
		console.log("Switch button selected:", selected);
	};

	const handleAddButtonClick = () => {
		console.log("Add button clicked!");
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
					{/* FOR API TESTING:
                    <DataViewer /> */}
				</div>
			</div>
		</div>
	);
};

export default AppLayout;
