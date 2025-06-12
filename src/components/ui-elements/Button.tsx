import React from "react";
import Icons from "./Icon";
import { useState } from "react";

// GENERAL BUTTON
interface ButtonProps {
	children: React.ReactNode;
	onClick?: () => void;
	backgroundColor?: string;
	textColor?: string;
	className?: string;
}

export const Button = ({
	children,
	onClick,
	backgroundColor,
	textColor,
	className,
}: ButtonProps) => {
	const buttonStyle: React.CSSProperties = {};
	const classes = ["button"];

	if (backgroundColor) {
		buttonStyle.backgroundColor = backgroundColor;
	}
	if (textColor) {
		buttonStyle.color = textColor;
	}
	if (className) {
		classes.push(className);
	}

	return (
		<button className={classes.join(" ")} onClick={onClick} style={buttonStyle}>
			{children}
		</button>
	);
};

// Used by SwitchButton and AddButton
interface IconButtonProps {
	iconName: string;
	onClick?: () => void;
	isSelected?: boolean;
	className?: string;
}

const IconButton = ({ iconName, onClick, isSelected = false, className }: IconButtonProps) => {
	const classes = ["icon-button"];
	if (isSelected) {
		classes.push("icon-button--selected");
	}
	if (className) {
		classes.push(className);
	}

	return (
		<div className={classes.join(" ")} onClick={onClick} role='button' tabIndex={0}>
			<Icons name={iconName} />
		</div>
	);
};

// SWITCH BUTTONS
interface SwitchButtonProps {
	onSelect: (selected: "menu" | "function") => void;
	initialSelected?: "menu" | "function";
}

export const SwitchButton = ({ onSelect, initialSelected = "function" }: SwitchButtonProps) => {
	const [selectedIcon, setSelectedIcon] = useState<"menu" | "function">(initialSelected);

	const handleSelect = (icon: "menu" | "function") => {
		setSelectedIcon(icon);
		onSelect(icon);
	};

	return (
		<div className='switch-button-group'>
			<IconButton
				iconName='menu'
				isSelected={selectedIcon === "menu"}
				onClick={() => handleSelect("menu")}
			/>
			<IconButton
				iconName='function'
				isSelected={selectedIcon === "function"}
				onClick={() => handleSelect("function")}
			/>
		</div>
	);
};

// ADD BUTTON
interface AddButtonProps {
	onClick?: () => void;
	className?: string; // For additional custom classes
}

export const AddButton = ({ onClick, className }: AddButtonProps) => {
	const classes = ["add-button"];
	if (className) {
		classes.push(className);
	}

	return (
		<div className={classes.join(" ")} onClick={onClick} role='button' tabIndex={0}>
			<Icons name='add' />
		</div>
	);
};
