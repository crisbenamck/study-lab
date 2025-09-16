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
		<div className="mb-10 pb-8 border-b border-gray-200 dark:border-slate-600">
			<h2 className="text-2xl font-semibold text-gray-900 dark:text-slate-100 mb-4">
				Configuración del Examen
			</h2>

			<div className="grid md:grid-cols-2 gap-6">
				{/* Card: Mostrar respuestas */}
				<div className="p-6 border border-border dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800/50">
					<div className="mb-3">
						<h3 className="text-base font-semibold text-gray-900 dark:text-slate-200">
							Mostrar Respuestas
						</h3>
					</div>
						<p className="mb-4 text-sm text-muted-foreground dark:text-slate-400">
						Elige cuándo quieres ver las respuestas correctas durante el examen
						</p>

					<div className="space-y-3">
						{answersModes.map((mode) => (
							<button
								key={mode.id}
								onClick={() => onShowAnswersModeChange(mode.id)}
								className={`w-full p-3 rounded-lg border transition-colors text-left ${
									showAnswersMode === mode.id
										? 'border-primary bg-primary-light dark:border-blue-400 dark:bg-blue-900/30'
										: 'border-border dark:border-slate-600 hover:border-border/60 dark:hover:border-slate-500 bg-white dark:bg-slate-700/50'
								}`}
							>
								<h4 className="font-medium mb-1 text-gray-900 dark:text-slate-200">{mode.title}</h4>
								<p className="text-sm text-gray-600 dark:text-slate-400">{mode.description}</p>
							</button>
						))}
					</div>
				</div>

				{/* Card: Límite de tiempo */}
				<div className="p-6 border border-border dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800/50">
					<div className="mb-3">
						<h3 className="text-base font-semibold text-gray-900 dark:text-slate-200">
							Límite de Tiempo (opcional)
						</h3>
					</div>
						<p className="mb-4 text-sm text-muted-foreground dark:text-slate-400">
						Establece un tiempo límite para completar el examen. <b>Deja vacío para tiempo ilimitado</b>
						</p>

					<div className="flex items-center gap-2">
						<input
							type="number"
							placeholder="Ej: 30"
							value={timeLimit}
							onChange={(e) => onTimeLimitChange(e.target.value)}
							className="flex-1 p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 placeholder:text-gray-500 dark:placeholder:text-slate-400 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none"
							min="1"
						/>
						<span className="text-gray-500 dark:text-slate-400">minutos</span>
					</div>
					<p className="text-gray-500 dark:text-slate-400 text-xs mt-2">
						Deja vacío para tiempo ilimitado
					</p>
				</div>
			</div>
		</div>
	);
};

export default ExamConfiguration;
