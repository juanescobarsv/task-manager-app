import type { SVGProps } from "react";
import Icons from "../ui-elements/Icon";

interface MenuIconProps extends SVGProps<SVGSVGElement> {
	iconName: string; // Use like "calendar"
}

const MenuIcon = ({ iconName, ...props }: MenuIconProps) => {
	if (!iconName) {
		console.warn("MenuIcon received an empty iconName prop.");
		return null;
	}

	return <Icons name={iconName} {...props} />;
};

export default MenuIcon;
