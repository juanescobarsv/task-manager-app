import { useState } from "react";
import SidebarItem from "./SidebarItem";

// Define a type for your navigation items
interface NavItem {
	id: string;
	label: string;
	iconName: string; // Corresponds to the name in Icons.tsx
}

const navItems: NavItem[] = [
	{ id: "dashboard", label: "DASHBOARD", iconName: "function" },
	{ id: "my-task", label: "MY TASK", iconName: "menu" },
	{ id: "projects", label: "PROJECTS", iconName: "suitcase" },
	{ id: "calendar", label: "CALENDAR", iconName: "calendar" },
	{ id: "time-manage", label: "TIME MANAGE", iconName: "time" },
	{ id: "reports", label: "REPORTS", iconName: "pie" },
	{ id: "settings", label: "SETTINGS", iconName: "setting" },
];

// Sidebar component
const Sidebar = () => {
	const [selectedItem, setSelectedItem] = useState("dashboard");

	const handleItemClick = (id: string) => {
		setSelectedItem(id);
		console.warn(`Sidebar item clicked: ${id}`);
		// Change using react-router-dom
		// navigate(`/${id}`);
	};

	return (
		<aside className='sidebar'>
			<div className='sidebar__logo'>
				<img src='/logo.svg' alt='Raven Logo' />
			</div>
			<nav className='sidebar__nav'>
				{navItems.map((item) => (
					<SidebarItem
						key={item.id}
						label={item.label}
						iconName={item.iconName}
						isSelected={selectedItem === item.id}
						onClick={() => handleItemClick(item.id)}
					/>
				))}
			</nav>
		</aside>
	);
};

export default Sidebar;
