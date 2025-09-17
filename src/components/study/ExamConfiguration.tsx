import React from 'react';
import type { ShowAnswersMode } from '../../types/StudySession';

interface ExamConfigurationProps {
	showAnswersMode: ShowAnswersMode;
	onShowAnswersModeChange: (mode: ShowAnswersMode) => void;
	timeLimit: string;
	onTimeLimitChange: (value: string) => void;
}

const ExamConfiguration: React.FC<ExamConfigurationProps> = ({
	showAnswersMode,
	onShowAnswersModeChange,
	timeLimit,
	onTimeLimitChange,
}) => {
	const answersModes = [
		{
			id: 'immediate' as ShowAnswersMode,
			title: 'Inmediatamente',
			description: 'Después de cada pregunta'
		},
		{
			id: 'end' as ShowAnswersMode,
			title: 'Al finalizar',
			description: 'Después de terminar todo el examen'
		}
	];

	return (
		<div className="mb-10 pb-8 border-b theme-transition" style={{ borderColor: 'var(--border-primary)' }}>
			<h2 className="text-2xl font-semibold mb-4 study-section-title">
				Configuración del Examen
			</h2>

			<div className="grid md:grid-cols-2 gap-6">
				{/* Card: Mostrar respuestas */}
				<div className="p-6 border rounded-xl study-config-container">
					<div className="mb-3">
						<h3 className="text-base font-semibold study-config-title">
							Mostrar Respuestas
						</h3>
					</div>
						<p className="mb-4 text-sm study-config-description">
						Elige cuándo quieres ver las respuestas correctas durante el examen
						</p>

					<div className="space-y-3">
						{answersModes.map((mode) => (
							<button
								key={mode.id}
								onClick={() => onShowAnswersModeChange(mode.id)}
								className={`w-full p-3 rounded-lg border transition-colors text-left study-mode-card ${
									showAnswersMode === mode.id ? 'selected' : ''
								}`}
							>
								<h4 className="font-medium mb-1">{mode.title}</h4>
								<p className="text-sm">{mode.description}</p>
							</button>
						))}
					</div>
				</div>

				{/* Card: Límite de tiempo */}
				<div className="p-6 border rounded-xl study-config-container">
					<div className="mb-3">
						<h3 className="text-base font-semibold study-config-title">
							Límite de Tiempo (opcional)
						</h3>
					</div>
						<p className="mb-4 text-sm study-config-description">
						Establece un tiempo límite para completar el examen. <b>Deja vacío para tiempo ilimitado</b>
						</p>

					<div className="flex items-center gap-2">
						<input
							type="number"
							placeholder="Ej: 30"
							value={timeLimit}
							onChange={(e) => onTimeLimitChange(e.target.value)}
							className="flex-1 p-3 border rounded-lg exam-config-input focus:outline-none"
							min="1"
						/>
						<span className="exam-config-label">minutos</span>
					</div>
					<p className="text-xs mt-2 exam-config-helper-text">
						Deja vacío para tiempo ilimitado
					</p>
				</div>
			</div>
		</div>
	);
};

export default ExamConfiguration;
