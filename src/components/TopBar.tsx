import React, { useState } from "react";
import MenuIcon from "./UI-elements/sidebarMenuIcon";
import Avatar from "./UI-elements/Avatar";

const TopBar = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [isSearchActive, setIsSearchActive] = useState(false);

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(event.target.value);
		setIsSearchActive(event.target.value.length > 0);
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
	};

	const handleNotificationClick = () => {
		console.warn("Notification icon clicked!");
	};

	const handleAvatarClick = () => {
		console.warn("Avatar clicked!");
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
					<Avatar
						nameForRoboHash='currentuser'
						size='m'
						className='avatar'
						onClick={handleAvatarClick}
					/>
				</div>
			</div>
		</header>
	);
};

export default TopBar;
