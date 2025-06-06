import * as Dialog from "@radix-ui/react-dialog";
import React from "react";
import Icons from "./sidebarIcons";

interface EstimateModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSelectEstimate: (estimate: number) => void;
}

const pointEstimates = [0, 1, 2, 4, 8];

const EstimateModal: React.FC<EstimateModalProps> = ({ isOpen, onClose, onSelectEstimate }) => {
	const handleSelect = (estimate: number) => {
		onSelectEstimate(estimate);
		onClose();
	};

	return (
		<Dialog.Root open={isOpen} onOpenChange={onClose}>
			<Dialog.Portal>
				<Dialog.Overlay className='estimate-modal-overlay' />
				<Dialog.Content className='estimate-modal-content'>
					<Dialog.Title className='estimate-modal-title'>Estimate</Dialog.Title>

					<div className='estimate-options'>
						{pointEstimates.map((points) => (
							<button
								key={points}
								className='estimate-option-button'
								onClick={() => handleSelect(points)}
							>
								<Icons name='increase_decrease' />
								{points} Points
							</button>
						))}
					</div>

					<Dialog.Close asChild>
						<button className='estimate-modal-close-button' aria-label='Close'>
							<Icons name='close' />
						</button>
					</Dialog.Close>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
};

export default EstimateModal;
