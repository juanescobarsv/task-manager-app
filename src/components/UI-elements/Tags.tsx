import Icons from "./sidebarIcons";

interface LabelProps {
	text: string;
	iconName?: string;
	backgroundColor?: string;
	textColor?: string;
	outlineColor?: string;
	className?: string;
}

const Tags = ({
	text,
	iconName,
	backgroundColor,
	textColor,
	outlineColor,
	className,
}: LabelProps) => {
	const tagStyle: React.CSSProperties = {};
	const classes = ["tag"];

	if (backgroundColor) {
		tagStyle.backgroundColor = backgroundColor;
	}
	if (textColor) {
		tagStyle.color = textColor;
	}
	if (outlineColor) {
		tagStyle.border = `1px solid ${outlineColor}`;
	}

	if (className) {
		classes.push(className);
	}

	return (
		<span className={classes.join(" ")} style={tagStyle}>
			{iconName && (
				<span className='tag__icon'>
					<Icons name={iconName} />
				</span>
			)}
			<span className='tag__text'>{text}</span>
		</span>
	);
};

export default Tags;
