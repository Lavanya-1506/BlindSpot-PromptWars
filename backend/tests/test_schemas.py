import pytest
from app.schemas import DecisionInput, AssumptionItem, OverlookedFactor, ConflictItem, SocraticQuestion, AnalysisResponse

def test_decision_input_validation():
    inp = DecisionInput(text="Deciding whether to take a sabbatical from work.", stakes="high")
    assert inp.stakes == "high"
    assert len(inp.options) == 0

def test_assumption_item_defaults():
    item = AssumptionItem(
        id="asm-1",
        statement="You assume finances are sufficient.",
        evidence_quote="I have $10,000 saved"
    )
    assert item.status == "unreviewed"
    assert item.user_note is None

def test_analysis_response_structure():
    resp = AnalysisResponse(
        conversation_id="conv-1",
        decision_summary="Evaluating moving abroad.",
        options_detected=["Move", "Stay"],
        assumptions=[],
        overlooked_factors=[],
        conflicts=[],
        socratic_questions=[]
    )
    assert "no recommendation" in resp.scope_disclaimer.lower()
    assert resp.guardrail_passed is True
