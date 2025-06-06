import * as Popover from "@radix-ui/react-popover";
import React, { useState, useMemo } from "react";
import Avatar from "../UI-elements/Avatar";
import { useUsersQuery, type User } from "../../graphQL/generated/graphql";

interface AssigneePopoverProps {
	children: React.ReactNode;
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	onSelectAssignee: (assignee: User | null) => void;
	selectedAssigneeId: string | null;
}

const AssigneePopover: React.FC<AssigneePopoverProps> = ({
	children,
	isOpen,
	onOpenChange,
	onSelectAssignee,
	selectedAssigneeId,
}) => {
	const [searchTerm, setSearchTerm] = useState("");
	const { data, loading, error } = useUsersQuery();

	const filteredUsers = useMemo(() => {
		const allUsers: User[] = data?.users ?? [];
		if (!searchTerm) {
			return allUsers;
		}
		return allUsers.filter(
			(user) =>
				user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
				user.email.toLowerCase().includes(searchTerm.toLowerCase()),
		);
	}, [searchTerm, data?.users]);

	const handleSelect = (assignee: User | null) => {
		onSelectAssignee(assignee);
		onOpenChange(false);
		setSearchTerm("");
	};

	return (
		<Popover.Root open={isOpen} onOpenChange={onOpenChange}>
			<Popover.Trigger asChild>{children}</Popover.Trigger>
			<Popover.Portal>
				<Popover.Content
					className='task-option-popover assignee'
					sideOffset={5}
					align='start'
				>
					<div className='popover-header'>
						<input
							type='text'
							placeholder='Assign to...'
							className='assignee-search-input'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>

					<div className='popover-list assignee-list'>
						{loading && <div className='assignee-message'>Loading users...</div>}
						{error && (
							<div className='assignee-message assignee-message--error'>
								Error loading users: {error.message}
							</div>
						)}
						{!loading && !error && filteredUsers.length === 0 && (
							<div className='assignee-message'>No matching users found.</div>
						)}
						{!loading &&
							!error &&
							filteredUsers.length > 0 &&
							filteredUsers.map((user) => (
								<button
									key={user.id}
									className={`assignee-item ${selectedAssigneeId === user.id ? "assignee-item--selected" : ""}`}
									onClick={() => handleSelect(user)}
								>
									<Avatar nameForRoboHash={user.fullName} size='s' text={user.fullName} />
								</button>
							))}
					</div>

					<Popover.Arrow className='popover-arrow' />
				</Popover.Content>
			</Popover.Portal>
		</Popover.Root>
	);
};

export default AssigneePopover;
