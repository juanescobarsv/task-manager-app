import { useState } from "react";
import MenuIcon from "./sidebarMenuIcon";
import JE from "../../assets/avatars/juan.jpg";

const TopBar = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [isSearchActive, setIsSearchActive] = useState(false); // New state to track search bar activity

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
		console.log("Notification icon clicked!");
	};

	const handleAvatarClick = () => {
		console.log("Avatar clicked!");
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
					<img
						src={JE}
						alt='User Avatar'
						className='avatar'
						onClick={handleAvatarClick}
						role='button'
						tabIndex={0}
						onError={(e) => {
							e.currentTarget.src = "https://placehold.co/40x40/cccccc/000000?text=User";
						}}
					/>
				</div>
			</div>
		</header>
	);
};

export default TopBar;
