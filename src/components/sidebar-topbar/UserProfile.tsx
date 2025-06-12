import * as Popover from "@radix-ui/react-popover";
import React from "react";
import { useProfileQuery } from "../../graphql/generated/graphql";

interface UserProfilePopoverProps {
	children: React.ReactNode;
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
}

const UserProfilePopover = ({ children, isOpen, onOpenChange }: UserProfilePopoverProps) => {
	const { data, loading, error } = useProfileQuery();
	const profile = data?.profile;

	const formatReadableDate = (isoString: string | Date | undefined | null): string => {
		if (!isoString) return "N/A";
		const date = new Date(isoString);
		return date.toLocaleDateString(undefined, {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	return (
		<Popover.Root open={isOpen} onOpenChange={onOpenChange}>
			<Popover.Trigger asChild>{children}</Popover.Trigger>
			<Popover.Portal>
				<Popover.Content
					className='task-option-popover user-profile-popover'
					sideOffset={5}
					align='end'
				>
					<div className='popover-header'>
						<span className='popover-title'>User Profile</span>
					</div>

					<div className='popover-list user-profile-details'>
						{loading && <p>Loading profile...</p>}
						{error && <p className='error-message'>Error: {error.message}</p>}
						{profile ? (
							<>
								<p>
									<strong>Full Name:</strong> {profile.fullName}
								</p>
								<p>
									<strong>Email:</strong> {profile.email}
								</p>

								<p>
									<strong>Position:</strong> {profile.type}
								</p>

								<p>
									<strong>Created At:</strong> {formatReadableDate(profile.createdAt)}
								</p>
								<p>
									<strong>Updated At:</strong> {formatReadableDate(profile.updatedAt)}
								</p>
							</>
						) : (
							!loading && !error && <p>No profile data available.</p>
						)}
					</div>

					<Popover.Arrow className='popover-arrow' />
				</Popover.Content>
			</Popover.Portal>
		</Popover.Root>
	);
};

export default UserProfilePopover;
