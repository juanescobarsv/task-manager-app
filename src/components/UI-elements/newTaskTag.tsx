import * as Popover from "@radix-ui/react-popover";
import * as Checkbox from "@radix-ui/react-checkbox";
import React, { useState, useMemo, useEffect } from "react";
import Icons from "./sidebarIcons";
import type { TaskTag } from "../../graphQL/generated/graphql";

const ALL_TASK_TAG_OPTIONS: TaskTag[] = ["IOS", "ANDROID", "REACT", "NODE_JS", "RAILS"];

const getTagColors = (tag: TaskTag): { backgroundColor: string; textColor: string } => {
	switch (tag) {
		case "IOS":
			return {
				backgroundColor: "var(--color-neutral-4-1)",
				textColor: "var(--color-neutral-1)",
			};
		case "ANDROID":
			return {
				backgroundColor: "var(--color-secondary-4-1)",
				textColor: "var(--color-secondary-4)",
			};
		case "REACT":
			return {
				backgroundColor: "var(--color-blue-light)",
				textColor: "var(--color-blue-bright)",
			};
		case "NODE_JS":
			return {
				backgroundColor: "var(--color-tertiary-4-1)",
				textColor: "var(--color-tertiary-4)",
			};
		case "RAILS":
			return {
				backgroundColor: "var(--color-primary-4-1)",
				textColor: "var(--color-primary-4)",
			};
		default:
			return {
				backgroundColor: "var(--color-neutral-4)",
				textColor: "var(--color-neutral-1)",
			};
	}
};

interface TagProps {
	// Renamed interface from NewTaskPopoverProps to NewTaskTagProps
	children: React.ReactNode;
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	onSelectTags: (tags: TaskTag[]) => void;
	selectedTags: TaskTag[];
}

const TagPopover: React.FC<TagProps> = ({
	// Renamed component from TagPopover to NewTaskTag
	children,
	isOpen,
	onOpenChange,
	onSelectTags,
	selectedTags,
}) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [internalSelectedTags, setInternalSelectedTags] = useState<TaskTag[]>(selectedTags);

	// Sync internal state when prop changes (e.g., popover opens, or parent updates selectedTags)
	useEffect(() => {
		setInternalSelectedTags(selectedTags);
	}, [selectedTags]);

	const filteredTags = useMemo(() => {
		const lowerCaseSearchTerm = searchTerm.toLowerCase();
		if (!lowerCaseSearchTerm) {
			return ALL_TASK_TAG_OPTIONS;
		}
		return ALL_TASK_TAG_OPTIONS.filter((tag: TaskTag) =>
			tag.toLowerCase().includes(lowerCaseSearchTerm),
		);
	}, [searchTerm]);

	// Simplified handleToggleTag: directly adds/removes based on checkbox state
	const handleToggleTag = (tag: TaskTag, checked: boolean) => {
		setInternalSelectedTags((prevTags) => {
			if (checked) {
				return [...prevTags, tag]; // Add tag if checked
			} else {
				return prevTags.filter((t) => t !== tag); // Remove tag if unchecked
			}
		});
	};

	// Removed handleClearTags as the clear button from the popover header was removed in previous updates

	const handleCreateTags = () => {
		// Confirms internal selections to parent
		onSelectTags(internalSelectedTags);
		onOpenChange(false);
		setSearchTerm(""); // Clear search term after confirming
	};

	// handleRemoveTagFromLabels is no longer needed here as selected tag display is moved to parent

	return (
		<Popover.Root open={isOpen} onOpenChange={onOpenChange}>
			{/* Popover.Trigger will now directly wrap the children (the "Label" option button) */}
			<Popover.Trigger asChild>{children}</Popover.Trigger>
			<Popover.Portal>
				<Popover.Content className='task-option-popover tag-variant' sideOffset={5} align='start'>
					<div className='popover-header'>
						<input
							type='text'
							placeholder='Tag Title'
							className='tag-search-input'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>

					<div className='popover-list tag-list'>
						{filteredTags.length === 0 ? (
							<div className='tag-message'>No matching tags found.</div>
						) : (
							filteredTags.map((tag) => {
								const isSelected = internalSelectedTags.includes(tag);
								return (
									// Modified to use a button and directly render Icons for checkbox visual
									<button
										key={tag}
										className={`tag-item ${isSelected ? "tag-item--selected" : ""}`}
										onClick={() => handleToggleTag(tag, !isSelected)} // Toggle on click
									>
										<Icons name={isSelected ? "checkbox_tick" : "checkbox_blank"} />
										<span className='tag-name'>{tag}</span>
									</button>
								);
							})
						)}
					</div>

					<div className='tag-actions'>
						<button className='create-tag-button' onClick={handleCreateTags}>
							Create
						</button>
					</div>

					<Popover.Arrow className='popover-arrow' />
				</Popover.Content>
			</Popover.Portal>
		</Popover.Root>
	);
};

export default TagPopover;
