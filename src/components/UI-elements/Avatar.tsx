import React from "react";

type AvatarSize = "s" | "m" | "l";

interface AvatarProps {
	nameForRoboHash?: string;
	size?: AvatarSize;
	text?: string;
	className?: string;
	onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const Avatar = ({ nameForRoboHash, size = "m", text, className }: AvatarProps) => {
	const avatarClasses = ["avatar"];
	avatarClasses.push(`avatar--size-${size}`);

	if (className) {
		avatarClasses.push(className);
	}

	let pixelSize: string;
	switch (size) {
		case "s":
			pixelSize = "32";
			break;
		case "m":
			pixelSize = "40";
			break;
		case "l":
			pixelSize = "48";
			break;
		default:
			pixelSize = "40";
	}

	const finalImageUrl: string =
		(nameForRoboHash
			? `https://robohash.org/${encodeURIComponent(nameForRoboHash)}.png?set=set3`
			: "") || `https://placehold.co/${pixelSize}x${pixelSize}/cccccc/000000?text=User`;

	// Fallback image in case the provided src fails to load
	const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>): void => {
		e.currentTarget.src = `https://placehold.co/${pixelSize}x${pixelSize}/cccccc/000000?text=User`;
		e.currentTarget.alt = "Fallback User Avatar";
	};

	return (
		<div className='avatar-wrapper'>
			<img
				src={finalImageUrl}
				alt={text ? `${text}'s avatar` : "User Avatar"}
				className={avatarClasses.join(" ")}
				onError={handleError}
			/>
			{text && <span className='avatar__text'>{text}</span>}
		</div>
	);
};

export default Avatar;
