import React, { useState, Suspense } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { SwitchButton, AddButton } from "./UI-elements/Buttons";
import TaskFormModal from "./TaskFormModal";
import type { Task, FilterTaskInput } from "../graphQL/generated/graphql";
const LazyDashboard = React.lazy(() => import("./Dashboard"));
import FilterPanel from "./UI-elements/FilterPanel";
import Icons from "./UI-elements/Icons";

const AppLayout = () => {
	const [isTaskFormModalOpen, setIsTaskFormModalOpen] = useState(false);
	const [taskBeingEdited, setTaskBeingEdited] = useState<Task | null>(null);

	const [currentFilters, setCurrentFilters] = useState<FilterTaskInput>({});
	const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

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

	const handleApplyFilters = (filters: FilterTaskInput) => {
		setCurrentFilters(filters);
		console.warn("Applied Filters:", filters);
	};

	const handleOpenFilterModal = () => {
		setIsFilterModalOpen(true);
	};

	const handleCloseFilterModal = () => {
		setIsFilterModalOpen(false);
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
					<div>
						<button
							className='filter-button'
							onClick={handleOpenFilterModal}
							aria-label='Open filters'
						>
							<Icons name='filter' />
						</button>
						<AddButton onClick={handleAddButtonClick} />
					</div>
				</div>

				<div className='main-content__task-board-wrapper'>
					<Suspense fallback={<div>Loading tasks...</div>}>
						<LazyDashboard onEditTask={handleEditTask} filterInput={currentFilters} />
					</Suspense>
				</div>
			</div>

			<TaskFormModal
				isOpen={isTaskFormModalOpen}
				onClose={handleTaskFormModalClose}
				taskToEdit={taskBeingEdited}
			/>

			<FilterPanel
				isOpen={isFilterModalOpen}
				onClose={handleCloseFilterModal}
				onApplyFilters={handleApplyFilters}
				currentFilters={currentFilters}
			/>
		</div>
	);
};

export default AppLayout;
