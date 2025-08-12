
import React from 'react';
import Modal from '../Modal';
import Button from './Button';

interface AlertModalProps {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	message: string;
	type?: 'info' | 'success' | 'warning' | 'error';
	buttonText?: string;
}

// AlertModal: Shows a simple alert dialog with a message and a single button
const AlertModal: React.FC<AlertModalProps> = ({
	isOpen,
	onClose,
	title,
	message,
	type = 'info',
	buttonText = 'Entendido'
}) => {
	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === 'Enter' || event.key === ' ') {
			onClose();
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={title}
			type={type}
			showCloseButton={false}
		>
			<div className="space-y-4">
				<div className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
					{message}
				</div>
				<div className="flex justify-center pt-2">
					<Button
						onClick={onClose}
						onKeyDown={handleKeyDown}
						autoFocus
						variant="primary"
						size="lg"
					>
						{buttonText}
					</Button>
				</div>
			</div>
		</Modal>
	);
};

export default AlertModal;
