export interface AssumptionItem {
  id: string;
  statement: string;
  evidence_quote: string;
  status: 'unreviewed' | 'confirmed' | 'dismissed' | 'unresolved';
  user_note?: string;
}

export interface OverlookedFactor {
  category: string;
  title: string;
  observation: string;
  relevance_why: string;
}

export interface ConflictItem {
  id: string;
  statement_a: string;
  statement_b: string;
  tension: string;
}

export interface SocraticQuestion {
  id: string;
  text: string;
  relates_to: string;
}

export interface PreMortemFailureMode {
  id: string;
  scenario: string;
  tied_assumption: string;
  neutral_check: string;
}

export interface ValidationStep {
  id: string;
  title: string;
  action_to_verify: string;
  target_dimension: string;
}

export interface AnalysisResponse {
  conversation_id: string;
  decision_summary: string;
  options_detected: string[];
  needs_clarification: boolean;
  clarifying_question?: string | null;
  confidence_before?: number;
  confidence_after?: number;
  assumptions: AssumptionItem[];
  overlooked_factors: OverlookedFactor[];
  conflicts: ConflictItem[];
  socratic_questions: SocraticQuestion[];
  pre_mortem_analysis?: PreMortemFailureMode[];
  validation_plan?: ValidationStep[];
  scope_disclaimer: string;
  guardrail_passed: boolean;
  guardrail_flags: string[];
}

export interface ScenarioPreset {
  id: string;
  title: string;
  category: string;
  stakes: string;
  text: string;
  options: string[];
  confidence_before?: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  isClarification?: boolean;
}
