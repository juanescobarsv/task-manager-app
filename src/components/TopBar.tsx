import React, { useState } from "react";
import MenuIcon from "./sidebar-topbar/SidebarMenuIcon";
import Avatar from "./ui-elements/Avatar";
import UserProfilePopover from "./sidebar-topbar/UserProfile";

interface TopBarProps {
	onSearchChange: (searchTerm: string) => void;
}

const TopBar = ({ onSearchChange }: TopBarProps) => {
	const [isUserProfilePopoverOpen, setIsUserProfilePopoverOpen] = useState(false);

	const [searchTerm, setSearchTerm] = useState("");
	const [isSearchActive, setIsSearchActive] = useState(false);

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newSearchTerm = event.target.value;
		setSearchTerm(newSearchTerm);
		setIsSearchActive(newSearchTerm.length > 0);
		onSearchChange(newSearchTerm);
	};

	const handleSearchFocus = () => {
		setIsSearchActive(true);
	};

	const handleSearchBlur = () => {
		if (searchTerm.length === 0) {
			setIsSearchActive(false);
		}
	};

	const handleClearSearch = () => {
		setSearchTerm("");
		setIsSearchActive(false);
		onSearchChange("");
	};

	const handleNotificationClick = () => {
		console.warn("Notification icon clicked!");
	};

	const handleUserProfilePopoverOpenChange = (open: boolean) => {
		setIsUserProfilePopoverOpen(open);
	};

	return (
		<header className='top-navigation-bar'>
			<div className='top-navigation-bar__search-container'>
				<div className='search-icon-wrapper'>
					<MenuIcon iconName='search' />
				</div>
				<input
					type='text'
					placeholder='Search'
					value={searchTerm}
					onChange={handleSearchChange}
					onFocus={handleSearchFocus}
					onBlur={handleSearchBlur}
				/>

				<div className='top-navigation-bar__right-section'>
					{isSearchActive && searchTerm.length > 0 && (
						<div
							className='clear-search-icon-wrapper'
							onClick={handleClearSearch}
							role='button'
							tabIndex={0}
						>
							<MenuIcon iconName='close' />
						</div>
					)}
					<div
						onClick={handleNotificationClick}
						className='notification-icon'
						role='button'
						tabIndex={0}
					>
						<MenuIcon iconName='notification' />
					</div>
					<UserProfilePopover
						isOpen={isUserProfilePopoverOpen}
						onOpenChange={handleUserProfilePopoverOpenChange}
					>
						<Avatar
							avatarName='Current User'
							size='m'
							className={`avatar ${isUserProfilePopoverOpen ? "avatar--active" : ""}`}
						/>
					</UserProfilePopover>
				</div>
			</div>
		</header>
	);
};

export default TopBar;
