import { useState, useEffect } from "react";
import * as Popover from "@radix-ui/react-popover";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Icons from "./Icons";
import { useUsersQuery } from "../../graphQL/generated/graphql";
import type {
	PointEstimate,
	Status,
	TaskTag,
	FilterTaskInput,
} from "../../graphQL/generated/graphql";
import * as Dialog from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

interface FilterPanelProps {
	isOpen: boolean;
	onClose: () => void;
	onApplyFilters: (filters: FilterTaskInput) => void;
	currentFilters: FilterTaskInput;
}

const ALL_STATUS_OPTIONS: Status[] = ["BACKLOG", "TODO", "IN_PROGRESS", "DONE", "CANCELLED"];
const ALL_TAG_OPTIONS: TaskTag[] = ["IOS", "ANDROID", "REACT", "NODE_JS", "RAILS"];
const ALL_POINT_ESTIMATE_OPTIONS: PointEstimate[] = ["ZERO", "ONE", "TWO", "FOUR", "EIGHT"];

const FilterPanel = ({ isOpen, onClose, onApplyFilters, currentFilters }: FilterPanelProps) => {
	const [name, setName] = useState<string>(currentFilters.name ?? "");
	const [dueDate, setDueDate] = useState<Date | null>(
		currentFilters.dueDate ? new Date(currentFilters.dueDate) : null,
	);
	const [assigneeId, setAssigneeId] = useState<string | null>(currentFilters.assigneeId ?? null);
	const [status, setStatus] = useState<Status | null>(currentFilters.status ?? null);
	const [tags, setTags] = useState<TaskTag[]>(currentFilters.tags ?? []);
	const [pointEstimate, setPointEstimate] = useState<PointEstimate | null>(
		currentFilters.pointEstimate ?? null,
	);

	// Sync internal state with external currentFilters prop
	useEffect(() => {
		setName(currentFilters.name ?? "");
		setDueDate(currentFilters.dueDate ? new Date(currentFilters.dueDate) : null);
		setAssigneeId(currentFilters.assigneeId ?? null);
		setStatus(currentFilters.status ?? null);
		setTags(currentFilters.tags ?? []);
		setPointEstimate(currentFilters.pointEstimate ?? null);
	}, [currentFilters]);

	// Fetch users
	const { data: usersData } = useUsersQuery();
	const users = usersData?.users ?? [];

	const handleApply = () => {
		const filters: FilterTaskInput = {};
		if (name) filters.name = name.toLowerCase();
		if (dueDate) filters.dueDate = dueDate;
		if (assigneeId) filters.assigneeId = assigneeId;
		if (status) filters.status = status;
		if (tags.length > 0) filters.tags = tags;
		if (pointEstimate) filters.pointEstimate = pointEstimate;

		onApplyFilters(filters);
		onClose();
	};

	const handleClear = () => {
		setName("");
		setDueDate(null);
		setAssigneeId(null);
		setStatus(null);
		setTags([]);
		setPointEstimate(null);
		onApplyFilters({});
	};

	const handleTagChange = (tag: TaskTag, isChecked: boolean) => {
		setTags((prev) => (isChecked ? [...prev, tag] : prev.filter((t) => t !== tag)));
	};

	return (
		<Dialog.Root open={isOpen} onOpenChange={onClose}>
			<Dialog.Portal>
				<Dialog.Overlay className='filter-modal-overlay' />
				<Dialog.Content className='filter-modal-content'>
					<VisuallyHidden.Root>
						<Dialog.Title>Filter Tasks</Dialog.Title>
						<Dialog.Description>Apply filters to refine the task list.</Dialog.Description>
					</VisuallyHidden.Root>
					<div className='filter-panel__header'>
						<h3>Filters</h3>
						<button className='close-button' onClick={onClose} aria-label='Close filters'>
							<Icons name='close' />
						</button>
					</div>
					<div className='filter-section'>
						<label htmlFor='name-filter'>Task Name:</label>
						<input
							id='name-filter'
							type='text'
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder='Filter by name'
						/>
					</div>
					<div className='filter-section'>
						<label htmlFor='due-date-filter'>Due Date:</label>
						<Popover.Root>
							<Popover.Trigger asChild>
								<button className='date-filter-trigger'>
									<Icons name='calendar' />
									{dueDate ? dueDate.toLocaleDateString() : "Select Due Date"}
								</button>
							</Popover.Trigger>
							<Popover.Portal>
								<Popover.Content className='date-popover-content' sideOffset={5} align='start'>
									<DatePicker
										selected={dueDate}
										onChange={(date: Date | null) => setDueDate(date)}
										inline
									/>
									<Popover.Arrow className='popover-arrow' />
								</Popover.Content>
							</Popover.Portal>
						</Popover.Root>
					</div>
					<div className='filter-section'>
						<label htmlFor='owner-filter'>Owner:</label>
						<select
							id='owner-filter'
							value={assigneeId ?? ""}
							onChange={(e) => setAssigneeId(e.target.value ?? null)}
						>
							<option value=''>All Owners</option>
							{users.map((user) => (
								<option key={user.id} value={user.id}>
									{user.fullName}
								</option>
							))}
						</select>
					</div>
					<div className='filter-section'>
						<label htmlFor='status-filter'>Status:</label>
						<select
							id='status-filter'
							value={status ?? ""}
							onChange={(e) => setStatus((e.target.value as Status) ?? null)}
						>
							<option value=''>All Statuses</option>
							{ALL_STATUS_OPTIONS.map((s) => (
								<option key={s} value={s}>
									{s.replace(/_/g, " ")}
								</option>
							))}
						</select>
					</div>
					<div className='filter-section'>
						<label>Tags:</label>
						<div className='tags-checkbox-group'>
							{ALL_TAG_OPTIONS.map((tag) => (
								<div key={tag} className='tag-checkbox-item'>
									<input
										type='checkbox'
										id={`tag-${tag}`}
										checked={tags.includes(tag)}
										onChange={(e) => handleTagChange(tag, e.target.checked)}
									/>
									<label htmlFor={`tag-${tag}`}>{tag.replace(/_/g, " ")}</label>
								</div>
							))}
						</div>
					</div>
					<div className='filter-section'>
						<label htmlFor='point-estimate-filter'>Estimated Points:</label>
						<select
							id='point-estimate-filter'
							value={pointEstimate ?? ""}
							onChange={(e) => setPointEstimate((e.target.value as PointEstimate) ?? null)}
						>
							<option value=''>All Estimates</option>
							{ALL_POINT_ESTIMATE_OPTIONS.map((pe) => (
								<option key={pe} value={pe}>
									{pe.replace(/_/g, " ")}
								</option>
							))}
						</select>
					</div>
					<div className='filter-modal-actions'>
						{" "}
						{/* NEW: Group action buttons */}
						<button onClick={handleClear} className='clear-filters-button'>
							Clear All
						</button>
						<button onClick={handleApply} className='apply-filters-button'>
							Apply Filters
						</button>
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
};

export default FilterPanel;
