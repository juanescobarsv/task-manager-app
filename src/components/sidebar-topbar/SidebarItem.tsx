import MenuIcon from "./SidebarMenuIcon";

interface SidebarItemProps {
	iconName: string;
	isSelected?: boolean;
	label: string;
	onClick: () => void;
}

const SidebarItem = ({ iconName, isSelected = false, label, onClick }: SidebarItemProps) => {
	const itemClasses = `sidebar-item ${isSelected ? "sidebar-item--selected" : ""}`;
	const iconFillColor = isSelected ? "var(--color-primary-4)" : "var(--color-neutral-2)";

	return (
		<div className={itemClasses} onClick={onClick} role='button' tabIndex={0}>
			<div className='sidebar-item__icon'>
				<MenuIcon iconName={iconName} fill={iconFillColor} />
			</div>
			<span className='sidebar-item__label'>{label}</span>
		</div>
	);
};

export default SidebarItem;
