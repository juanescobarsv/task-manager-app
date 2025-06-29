import React, { useState, Suspense } from "react";
import Sidebar from "./sidebar-topbar/Sidebar";
import TopBar from "./sidebar-topbar/TopBar";
import Icons from "./ui-elements/Icon";
import { SwitchButton, AddButton } from "./ui-elements/Button";
import TaskFormModal from "./modals-popovers/NewTask";
import type { Task, FilterTaskInput } from "../graphql/generated/graphql";
const LazyDashboard = React.lazy(() => import("./dashboard/Dashboard"));
import FilterPanel from "./modals-popovers/FilterPanel";

const AppLayout = () => {
	const [isTaskFormModalOpen, setIsTaskFormModalOpen] = useState(false);
	const [taskBeingEdited, setTaskBeingEdited] = useState<Task | null>(null);

	const [, setSearchTerm] = useState<string>("");
	const [currentFilters, setCurrentFilters] = useState<FilterTaskInput>({});
	const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

	const handleSwitchSelect = (selected: "menu" | "function") => {
		console.warn("Switch button selected:", selected);
	};

	const handleAddButtonClick = () => {
		setTaskBeingEdited(null);
		setIsTaskFormModalOpen(true);
	};

	const handleSearchChange = (term: string) => {
		setSearchTerm(term);
		setCurrentFilters((prevFilters) => ({
			...prevFilters,
			name: term ? term.toLowerCase() : undefined,
		}));
	};

	const handleApplyFilters = (filters: FilterTaskInput) => {
		setCurrentFilters(filters);
		setSearchTerm(filters.name ?? "");
		console.warn("Applied Filters:", filters);
	};

	const handleEditTask = (task: Task) => {
		setTaskBeingEdited(task);
		setIsTaskFormModalOpen(true);
	};

	const handleTaskFormModalClose = () => {
		setIsTaskFormModalOpen(false);
		setTaskBeingEdited(null);
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
					<TopBar onSearchChange={handleSearchChange} />
				</div>
				<div className='main-content__controls'>
					<SwitchButton onSelect={handleSwitchSelect} />
					<div className='switch-button-group'>
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
