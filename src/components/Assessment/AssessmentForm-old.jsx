import { Box, Button, Card, CardContent, LinearProgress, Stepper, Step, StepLabel } from "@mui/material";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useAssessmentStore } from "../../stores/assessmentStore";
import { questions } from "../../config/questions";
import { QUESTION_TYPES } from "../../config/questionTypes";
import { ResultsSummary } from "./ResultsSummary";
import { YesNoQuestion } from "./QuestionTypes/YesNoQuestion";
import { MultipleChoiceQuestion } from "./QuestionTypes/MultipleChoiceQuestion";
import { TextQuestion } from "./QuestionTypes/TextQuestion";
import { CodeListQuestion } from "./QuestionTypes/CodeListQuestion";

export function AssessmentForm() {
	const { currentStep, answers, setAnswer, nextStep, prevStep } = useAssessmentStore();
	const currentQuestion = questions[currentStep];
	const progress = ((currentStep + 1) / questions.length) * 100;
	const isComplete = currentStep === questions.length;

	if (isComplete) {
		return <ResultsSummary />;
	}

	const renderQuestion = () => {
		const props = {
			question: currentQuestion,
			value: answers[currentQuestion.id],
			onChange: setAnswer,
		};

		switch (currentQuestion.type) {
			case QUESTION_TYPES.YES_NO:
				return <YesNoQuestion {...props} />;
			case QUESTION_TYPES.MULTIPLE_CHOICE:
				return <MultipleChoiceQuestion {...props} />;
			case QUESTION_TYPES.TEXT:
				return <TextQuestion {...props} />;
			case QUESTION_TYPES.CODE_LIST:
				return <CodeListQuestion {...props} />;
			default:
				return null;
		}
	};

	const isAnswered = () => {
		const answer = answers[currentQuestion.id];
		if (!currentQuestion.required) return true;
		if (!answer) return false;
		if (Array.isArray(answer)) return answer.length > 0;
		return Boolean(answer);
	};

	return (
		<Box sx={{ maxWidth: 800, mx: "auto" }}>
			<LinearProgress variant='determinate' value={progress} sx={{ mb: 4, height: 8, borderRadius: 5 }} />

			<Stepper activeStep={currentStep} sx={{ mb: 4 }}>
				{questions.map((q, index) => (
					<Step key={index}>
						<StepLabel></StepLabel>
					</Step>
				))}
			</Stepper>

			<Card elevation={3}>
				<CardContent>{renderQuestion()}</CardContent>
			</Card>

			<Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
				<Button startIcon={<ArrowLeft />} onClick={prevStep} disabled={currentStep === 0} variant='outlined'>
					Previous
				</Button>

				<Button
					endIcon={<ArrowRight />}
					onClick={nextStep}
					disabled={!isAnswered()}
					variant='contained'
					color='primary'
				>
					{currentStep === questions.length - 1 ? "Finish" : "Next"}
				</Button>
			</Box>
		</Box>
	);
}
