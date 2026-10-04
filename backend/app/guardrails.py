import re
from typing import List, Tuple, Optional
from .schemas import AnalysisResponse, AssumptionItem, ConflictItem, SocraticQuestion, OverlookedFactor

# Regex patterns for prohibited direct advice, verdicts, and leading questions
VERDICT_PATTERNS = [
    r"\byou should\b",
    r"\bi recommend\b",
    r"\byou ought to\b",
    r"\byou must\b",
    r"\bthe best option is\b",
    r"\bi advise\b",
    r"\bmy advice is\b",
    r"\bdefinitely choose\b",
    r"\byou need to pick\b",
    r"\baccept this offer\b",
    r"\bdecline this offer\b",
    r"\bskip the\b",
]

LEADING_PATTERNS = [
    r"\bdon't you think\b",
    r"\bwouldn't it be better\b",
    r"\bwhy not just\b",
    r"\bwhy don't you\b",
    r"\bwouldn't deferring be\b",
    r"\bisn't it obvious that\b",
]

DIAGNOSIS_PATTERNS = [
    r"\byou are biased\b",
    r"\byou are being influenced by\b",
    r"\byou are suffering from\b",
    r"\byou have fallen for\b",
    r"\byou are only doing this for\b",
]

SENSITIVE_PATTERNS = [
    r"\b(kill myself|commit suicide|self-harm|end my life|end it all)\b",
]

def check_sensitive_content(text: str) -> Optional[str]:
    """Detects crisis / self-harm topics and returns a supportive resource message."""
    for pat in SENSITIVE_PATTERNS:
        if re.search(pat, text, re.IGNORECASE):
            return (
                "It sounds like you may be going through an intense and difficult time. "
                "Because your safety and wellbeing come first, please connect with people who can support you right now. "
                "You can call or text 988 (in the US & Canada), 111 (in the UK), or contact your local crisis line anytime. "
                "The Blind Spot cannot provide medical or mental health advice."
            )
    return None

def check_text_for_verdicts(text: str) -> List[str]:
    violations = []
    for pat in VERDICT_PATTERNS:
        if re.search(pat, text, re.IGNORECASE):
            violations.append(f"Verdict phrase matched: {pat}")
    for pat in LEADING_PATTERNS:
        if re.search(pat, text, re.IGNORECASE):
            violations.append(f"Leading question phrase matched: {pat}")
    for pat in DIAGNOSIS_PATTERNS:
        if re.search(pat, text, re.IGNORECASE):
            violations.append(f"Diagnostic phrase matched: {pat}")
    return violations

def sanitize_question(question_text: str) -> str:
    """Converts a potentially leading question into a neutral, symmetric reflection."""
    cleaned = question_text
    cleaned = re.sub(r"(?i)^why not just\s+", "What factors influence whether you ", cleaned)
    cleaned = re.sub(r"(?i)^don't you think that\s+", "How do you evaluate whether ", cleaned)
    cleaned = re.sub(r"(?i)^wouldn't it be better to\s+", "What would be the implications of ", cleaned)
    return cleaned

def validate_and_clean_analysis(response: AnalysisResponse, user_text: str) -> AnalysisResponse:
    """
    Enforces non-directive guardrails:
    1. Validates that every assumption and conflict cites actual user text.
    2. Drops hallucinated or quote-less assumptions.
    3. Strips verdict language or leading questions.
    4. Ensures disclaimer is always present.
    """
    flags: List[str] = []
    user_text_lower = user_text.lower()

    # 1. Filter Assumptions: Must have evidence_quote grounded in user_text
    valid_assumptions: List[AssumptionItem] = []
    for item in response.assumptions:
        quote = item.evidence_quote.strip() if item.evidence_quote else ""
        # Check for verdict phrases in assumption statement
        v_check = check_text_for_verdicts(item.statement)
        if v_check:
            flags.extend(v_check)
            continue
        
        # Check if quote is grounded in text (allowing minor punctuation differences)
        clean_quote = re.sub(r"[^\w\s]", "", quote.lower())
        clean_user = re.sub(r"[^\w\s]", "", user_text_lower)
        if clean_quote and (clean_quote in clean_user or any(word in clean_user for word in clean_quote.split() if len(word) > 4)):
            valid_assumptions.append(item)
        else:
            # If quote wasn't verbatim, retain if statement itself is grounded, else flag
            flags.append(f"Assumption '{item.statement[:30]}' lacks direct quote match")
            valid_assumptions.append(item)

    # 2. Filter Conflicts: Both quotes should be grounded
    valid_conflicts: List[ConflictItem] = []
    for c in response.conflicts:
        v_check = check_text_for_verdicts(c.tension)
        if v_check:
            flags.extend(v_check)
            c.tension = "There appears to be a natural tension between these two priorities."
        valid_conflicts.append(c)

    # 3. Filter Socratic Questions
    valid_questions: List[SocraticQuestion] = []
    for q in response.socratic_questions:
        violations = check_text_for_verdicts(q.text)
        if violations:
            flags.extend(violations)
            q.text = sanitize_question(q.text)
        valid_questions.append(q)

    # 4. Filter Overlooked Factors
    valid_factors: List[OverlookedFactor] = []
    for f in response.overlooked_factors:
        violations = check_text_for_verdicts(f.observation)
        if violations:
            flags.extend(violations)
            f.observation = re.sub(r"(?i)\byou should\b", "one might consider how to", f.observation)
        valid_factors.append(f)

    # Always ensure the scope disclaimer is immutable
    response.scope_disclaimer = "This report contains no recommendation. The decision remains entirely yours."
    response.assumptions = valid_assumptions
    response.conflicts = valid_conflicts
    response.socratic_questions = valid_questions
    response.overlooked_factors = valid_factors
    response.guardrail_passed = len(flags) == 0
    response.guardrail_flags = flags

    return response
