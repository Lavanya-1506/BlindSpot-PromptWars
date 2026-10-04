import pytest
from app.guardrails import (
    check_text_for_verdicts,
    sanitize_question,
    check_sensitive_content,
    validate_and_clean_analysis
)
from app.schemas import AnalysisResponse, AssumptionItem, OverlookedFactor, ConflictItem, SocraticQuestion

def test_verdict_detection():
    text_with_advice = "In my opinion, you should accept the first option because it is better."
    violations = check_text_for_verdicts(text_with_advice)
    assert len(violations) > 0
    assert any("you should" in v.lower() for v in violations)

def test_leading_question_detection():
    leading_q = "Why not just ask your boss for part-time hours? Don't you think that is safer?"
    violations = check_text_for_verdicts(leading_q)
    assert len(violations) >= 2

def test_sensitive_crisis_filter():
    crisis_text = "I feel so overwhelmed by this decision that I want to end my life."
    msg = check_sensitive_content(crisis_text)
    assert msg is not None
    assert "988" in msg

def test_neutral_text_passes_guardrails():
    neutral_text = "You noted that your class schedule requires attendance on Monday and Wednesday."
    violations = check_text_for_verdicts(neutral_text)
    assert len(violations) == 0

def test_sanitize_question():
    q = "Why not just take a semester off?"
    cleaned = sanitize_question(q)
    assert not cleaned.lower().startswith("why not just")
    assert "what factors influence" in cleaned.lower()

def test_validate_and_clean_analysis_preserves_disclaimer():
    raw_response = AnalysisResponse(
        conversation_id="test-123",
        decision_summary="Evaluating a role change.",
        options_detected=["Role A", "Role B"],
        assumptions=[
            AssumptionItem(
                id="a1",
                statement="You assume the commute will be fine.",
                evidence_quote="commute is 15 minutes",
                status="unreviewed"
            )
        ],
        overlooked_factors=[],
        conflicts=[],
        socratic_questions=[
            SocraticQuestion(id="q1", text="What would success look like in 6 months?", relates_to="Goals")
        ]
    )
    cleaned = validate_and_clean_analysis(raw_response, "The commute is 15 minutes by subway.")
    assert cleaned.guardrail_passed is True
    assert "no recommendation" in cleaned.scope_disclaimer.lower()
