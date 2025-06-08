import * as Popover from "@radix-ui/react-popover";
import React, { useState, useMemo, useEffect } from "react";
import Icons from "./sidebarIcons";
import type { TaskTag } from "../../graphQL/generated/graphql";

const ALL_TASK_TAG_OPTIONS: TaskTag[] = ["IOS", "ANDROID", "REACT", "NODE_JS", "RAILS"];

interface TagProps {
	children: React.ReactNode;
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	onSelectTags: (tags: TaskTag[]) => void;
	selectedTags: TaskTag[];
}

const TagPopover: React.FC<TagProps> = ({
	children,
	isOpen,
	onOpenChange,
	onSelectTags,
	selectedTags,
}) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [internalSelectedTags, setInternalSelectedTags] = useState<TaskTag[]>(selectedTags);

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

	const handleToggleTag = (tag: TaskTag, checked: boolean) => {
		setInternalSelectedTags((prevTags) => {
			if (checked) {
				return [...prevTags, tag];
			} else {
				return prevTags.filter((t) => t !== tag);
			}
		});
	};

	const handleCreateTags = () => {
		onSelectTags(internalSelectedTags);
		onOpenChange(false);
		setSearchTerm("");
	};

	return (
		<Popover.Root open={isOpen} onOpenChange={onOpenChange}>
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
									<button
										key={tag}
										className={`tag-item ${isSelected ? "tag-item--selected" : ""}`}
										onClick={() => handleToggleTag(tag, !isSelected)}
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
