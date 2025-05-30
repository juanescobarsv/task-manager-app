import MenuIcon from "./sidebarIcon";

interface SidebarItemProps {
	label: string;
	isSelected?: boolean;
	onClick: () => void;
	iconPath: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
	label,
	isSelected = false,
	onClick,
	iconPath,
}) => {
	const itemClasses = `sidebar-item ${isSelected ? "sidebar-item--selected" : ""}`;
	const iconFillColor = isSelected ? "var(--color-primary-4)" : "var(--color-neutral-2)";

	return (
		<div className={itemClasses} onClick={onClick} role='button' tabIndex={0}>
			<div className='sidebar-item__icon'>
				<MenuIcon iconPath={iconPath} fill={iconFillColor} />
			</div>
			<span className='sidebar-item__label'>{label}</span>
		</div>
	);
};

export default SidebarItem;
