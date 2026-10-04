from typing import List, Optional
from pydantic import BaseModel, Field

class DecisionInput(BaseModel):
    text: str = Field(..., description="The user's description of their decision, context, and reasons.")
    options: Optional[List[str]] = Field(default_factory=list, description="Explicit options if provided.")
    stakes: Optional[str] = Field("medium", description="Perceived stakes: low, medium, high.")
    deadline: Optional[str] = Field(None, description="Timeline or deadline for the decision.")
    confidence_before: Optional[int] = Field(75, description="Initial confidence score (0-100%).")

class AssumptionItem(BaseModel):
    id: str
    statement: str
    evidence_quote: str = Field(..., description="Direct verbatim quote from user text grounding this assumption.")
    status: str = Field("unreviewed", description="'unreviewed', 'confirmed', 'dismissed', or 'unresolved'")
    user_note: Optional[str] = None

class OverlookedFactor(BaseModel):
    category: str = Field(..., description="E.g., academics, learning_quality, career_path, wellbeing, financial, stakeholders, time_reversibility, info_gaps, values")
    title: str
    observation: str = Field(..., description="Describes the absence of the topic or unaddressed dimension; never gives advice.")
    relevance_why: str = Field(..., description="Why examining this absence matters.")

class ConflictItem(BaseModel):
    id: str
    statement_a: str = Field(..., description="First verbatim quote from user.")
    statement_b: str = Field(..., description="Second conflicting verbatim quote from user.")
    tension: str = Field(..., description="Neutral description of the tension between A and B.")

class SocraticQuestion(BaseModel):
    id: str
    text: str = Field(..., description="Specific, open-ended, non-leading question applying symmetrically.")
    relates_to: str

class PreMortemFailureMode(BaseModel):
    id: str
    scenario: str = Field(..., description="Hypothetical failure mechanism under prospective hindsight.")
    tied_assumption: str = Field(..., description="The unexamined assumption that enables this failure.")
    neutral_check: str = Field(..., description="Non-directive inquiry to verify before committing.")

class ValidationStep(BaseModel):
    id: str
    title: str
    action_to_verify: str = Field(..., description="Concrete, neutral action step to test or verify unexamined facts.")
    target_dimension: str

class AnalysisResponse(BaseModel):
    conversation_id: str
    decision_summary: str
    options_detected: List[str] = Field(default_factory=list)
    needs_clarification: bool = False
    clarifying_question: Optional[str] = None
    confidence_before: Optional[int] = 75
    confidence_after: Optional[int] = None
    assumptions: List[AssumptionItem] = Field(default_factory=list)
    overlooked_factors: List[OverlookedFactor] = Field(default_factory=list)
    conflicts: List[ConflictItem] = Field(default_factory=list)
    socratic_questions: List[SocraticQuestion] = Field(default_factory=list)
    pre_mortem_analysis: List[PreMortemFailureMode] = Field(default_factory=list)
    validation_plan: List[ValidationStep] = Field(default_factory=list)
    scope_disclaimer: str = "This report contains no recommendation. The decision remains entirely yours."
    guardrail_passed: bool = True
    guardrail_flags: List[str] = Field(default_factory=list)

class FollowupInput(BaseModel):
    conversation_id: str
    decision_text: str
    question_id: str
    question_text: str
    user_answer: str
    current_assumptions: List[AssumptionItem] = Field(default_factory=list)

class AssumptionUpdateInput(BaseModel):
    id: str
    status: str
    user_note: Optional[str] = None

class ScenarioPreset(BaseModel):
    id: str
    title: str
    category: str
    stakes: str
    text: str
    options: List[str]
    confidence_before: Optional[int] = 80
