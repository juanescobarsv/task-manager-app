import React, { useState, useEffect } from "react";
import type { SVGProps } from "react";

interface MenuIconProps extends SVGProps<SVGSVGElement> {
	iconPath: string;
}

const MenuIcon = ({ iconPath, ...props }: MenuIconProps) => {
	const [SvgComponent, setSvgComponent] = useState<React.FC<SVGProps<SVGSVGElement>> | null>(null);
	const [error, setError] = useState<boolean>(false);

	useEffect(() => {
		setError(false);
		if (iconPath) {
			import(/* @vite-ignore */ `${iconPath}?react`)
				.then((module) => {
					setSvgComponent(() => module.default);
				})
				.catch((err) => {
					console.error(`Failed to load SVG icon from ${iconPath}:`, err);
					setError(true);
					setSvgComponent(null);
				});
		} else {
			setSvgComponent(null);
		}
	}, [iconPath]);

	if (error) {
		// Fallback icon
		return (
			<span className='menu-icon--error' title={`Error loading icon: ${iconPath}`}>
				!
			</span>
		);
	}

	if (!SvgComponent) {
		return <div className='menu-icon--loading'></div>;
	}

	return <SvgComponent {...props} />;
};

export default MenuIcon;
