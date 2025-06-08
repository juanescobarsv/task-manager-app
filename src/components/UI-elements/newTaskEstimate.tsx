import * as Popover from "@radix-ui/react-popover";
import React from "react";
import Icons from "./sidebarIcons";

interface EstimateProps {
	children: React.ReactNode;
	isOpen: boolean;
	onClose: (open: boolean) => void;
	onSelectEstimate: (estimate: number | null) => void;
	selectedEstimate: number | null;
}

const pointEstimates = [0, 1, 2, 4, 8];

const EstimatePopover: React.FC<EstimateProps> = ({
	children,
	isOpen,
	onClose,
	onSelectEstimate,
	selectedEstimate,
}) => {
	const handleSelect = (estimate: number | null) => {
		onSelectEstimate(estimate);
		onClose(false);
	};

	return (
		<Popover.Root open={isOpen} onOpenChange={onClose}>
			<Popover.Trigger asChild>{children}</Popover.Trigger>{" "}
			<Popover.Portal>
				<Popover.Content
					className='task-option-popover estimate-variant'
					sideOffset={5}
					align='start'
				>
					<div className='popover-header'>
						<span className='popover-title'>Estimate</span>
					</div>

					<div className='popover-list'>
						{pointEstimates.map((points) => (
							<button
								key={points}
								className={`estimate-option-button ${selectedEstimate === points ? "estimate-option-button--selected" : ""}`}
								onClick={() => handleSelect(points)}
							>
								<Icons name='increase_decrease' />
								{points} Points
							</button>
						))}
					</div>

					<Popover.Arrow className='popover-arrow' />
				</Popover.Content>
			</Popover.Portal>
		</Popover.Root>
	);
};

export default EstimatePopover;
