export interface Option {
  option_letter: string;
  option_text: string;
  is_correct: boolean;
}

export interface Question {
  question_number: number;
  question_text: string;
  options: Option[];
  requires_multiple_answers: boolean;
  explanation: string;
  link: string;
}

export interface QuestionFormData {
  question_text: string;
  options: {
    option_text: string;
    is_correct: boolean;
  }[];
  requires_multiple_answers: boolean;
  explanation: string;
  link: string;
}
