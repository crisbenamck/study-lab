
import React from 'react';
import Modal from '../Modal';
import Button from './Button';

interface ConfirmModalProps {
	isOpen: boolean;
	onConfirm: () => void;
	onCancel: () => void;
	title?: string;
	message: string;
	confirmText?: string;
	cancelText?: string;
	type?: 'info' | 'success' | 'warning' | 'error';
}

// ConfirmModal: Shows a confirmation dialog with confirm and cancel actions
const ConfirmModal: React.FC<ConfirmModalProps> = ({
	isOpen,
	onConfirm,
	onCancel,
	title,
	message,
	confirmText = 'Confirmar',
	cancelText = 'Cancelar',
	type = 'warning'
}) => {
	const handleConfirm = () => {
		onConfirm();
		onCancel(); // Close modal after confirm
	};

	const handleKeyDown = (event: React.KeyboardEvent, action: 'confirm' | 'cancel') => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			if (action === 'confirm') {
				handleConfirm();
			} else {
				onCancel();
			}
		}
	};

	// Determine button variant based on confirmText
	const getConfirmButtonVariant = (): 'primary' | 'danger' => {
		const isDownloadAction = confirmText.toLowerCase().includes('descargar');
		const isProcessAction = confirmText.toLowerCase().includes('procesar');
		if (isDownloadAction || isProcessAction) {
			return 'primary';
		} else {
			return 'danger';
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onCancel}
			title={title}
			type={type}
			showCloseButton={false}
		>
			<div className="space-y-6">
				<div className="text-primary whitespace-pre-wrap text-sm leading-relaxed">
					{message}
				</div>
				<div className="flex justify-center space-x-3 pt-2">
					<Button
						onClick={onCancel}
						onKeyDown={(e) => handleKeyDown(e, 'cancel')}
						variant="secondary"
						size="lg"
					>
						{cancelText}
					</Button>
					<Button
						onClick={handleConfirm}
						onKeyDown={(e) => handleKeyDown(e, 'confirm')}
						autoFocus
						variant={getConfirmButtonVariant()}
						size="lg"
					>
						{confirmText}
					</Button>
				</div>
			</div>
		</Modal>
	);
};

export default ConfirmModal;
