import React from "react";

type AvatarSize = "s" | "m" | "l";

interface AvatarProps {
	filename: string;
	size: AvatarSize;
	text?: string;
	className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ filename, size, text, className }) => {
	const avatarClasses = ["avatar"];
	avatarClasses.push(`avatar--size-${size}`);

	if (className) {
		avatarClasses.push(className);
	}

	// Hardcoded prefix for easier input, if avatar's images path change, must change it here too:
	const imagePath = `./src/assets/avatars/${filename}`;

	// Fallback image in case the provided src fails to load
	const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
		e.currentTarget.src = `https://placehold.co/${40}x${40}/cccccc/000000?text=User`;
		e.currentTarget.alt = "Fallback User Avatar";
	};

	return (
		<div className='avatar-wrapper'>
			<img
				src={imagePath}
				alt={text ? `${text}'s avatar` : "User Avatar"}
				className={avatarClasses.join(" ")}
				onError={handleError}
			/>
			{text && <span className='avatar__text'>{text}</span>}
		</div>
	);
};

export default Avatar;
