import React, { useState, Suspense } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { SwitchButton, AddButton } from "./UI-elements/Buttons";
import TaskFormModal from "./TaskFormModal";
import type { Task } from "../graphQL/generated/graphql";
const LazyDashboard = React.lazy(() => import("./Dashboard"));

const AppLayout = () => {
	const [isTaskFormModalOpen, setIsTaskFormModalOpen] = useState(false);
	const [taskBeingEdited, setTaskBeingEdited] = useState<Task | null>(null);

	const handleSwitchSelect = (selected: "menu" | "function") => {
		console.warn("Switch button selected:", selected);
	};

	const handleAddButtonClick = () => {
		setTaskBeingEdited(null); //
		setIsTaskFormModalOpen(true);
	};

	const handleEditTask = (task: Task) => {
		setTaskBeingEdited(task);
		setIsTaskFormModalOpen(true);
	};

	const handleTaskFormModalClose = () => {
		setIsTaskFormModalOpen(false);
		setTaskBeingEdited(null);
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
				<div className='main-content__controls'>
					<SwitchButton onSelect={handleSwitchSelect} />
					<AddButton onClick={handleAddButtonClick} />
				</div>

				<div className='main-content__task-board-wrapper'>
					<Suspense fallback={<div>Loading tasks...</div>}>
						<LazyDashboard onEditTask={handleEditTask} />
					</Suspense>
				</div>
			</div>

			<TaskFormModal
				isOpen={isTaskFormModalOpen}
				onClose={handleTaskFormModalClose}
				taskToEdit={taskBeingEdited}
			/>
		</div>
	);
};

export default AppLayout;
