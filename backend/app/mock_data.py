from typing import List
from .schemas import (
    AnalysisResponse,
    AssumptionItem,
    OverlookedFactor,
    ConflictItem,
    SocraticQuestion,
    PreMortemFailureMode,
    ValidationStep,
    ScenarioPreset
)

PRESET_SCENARIOS: List[ScenarioPreset] = [
    ScenarioPreset(
        id="internship-official",
        title="6-Month Junior Dev Internship",
        category="Career / Education",
        stakes="high",
        confidence_before=85,
        text="Deciding whether to accept a 6-month junior developer internship. Stipend is good, office is close to home, 9 to 6 hours, I have classes three days a week. Mainly considering it for the stipend, closeness, and industry experience.",
        options=["Accept 6-month internship", "Decline and focus on college/studies"]
    ),
    ScenarioPreset(
        id="startup-pivot",
        title="Startup B2B SaaS Pivot",
        category="Entrepreneurship",
        stakes="high",
        confidence_before=70,
        text="We run a B2C consumer habit tracker with 15k free users and 1% paid conversion. Run out of runway in 4 months. Thinking about pivoting entirely to enterprise employee wellness software because an enterprise contact said they would pay $10k/year for a pilot. Team is 3 junior engineers and me.",
        options=["Pivot completely to B2B wellness", "Double down on B2C growth with organic marketing"]
    ),
    ScenarioPreset(
        id="relocation-offer",
        title="Cross-Country Job Relocation",
        category="Career / Personal",
        stakes="medium",
        confidence_before=80,
        text="Offered a senior product manager role in Seattle with a 35% compensation bump. Currently living comfortably in Chicago near family and lifelong friends. Partner works remotely and can move, but neither of us has ever lived on the West Coast. Moving would be exciting and fast-track my promotion.",
        options=["Accept offer and relocate to Seattle", "Stay at current company in Chicago"]
    ),
    ScenarioPreset(
        id="grad-school-vs-job",
        title="Master's Degree vs Continuing Job",
        category="Education / Career",
        stakes="high",
        confidence_before=65,
        text="Admitted into a top 2-year Master's in Computer Science program with a partial scholarship (will still need $40k in student loans). Currently earning $95k as a mid-level software engineer. Worried that if I don't go now, I never will, but taking on debt and giving up 2 years of salary during tech uncertainty feels risky.",
        options=["Enroll in Master's program", "Keep working at current engineering job"]
    )
]

OFFICIAL_INTERNSHIP_BENCHMARK: AnalysisResponse = AnalysisResponse(
    conversation_id="benchmark-internship-001",
    decision_summary="You are evaluating whether to accept a 6-month junior developer internship weighing stipend, proximity, and industry experience against existing 3-day weekly college classes.",
    options_detected=[
        "Accept the 6-month junior developer internship",
        "Continue with current academic schedule without the internship"
    ],
    needs_clarification=False,
    clarifying_question=None,
    confidence_before=85,
    confidence_after=55,
    assumptions=[
        AssumptionItem(
            id="asm-1",
            statement="You assume a full-time 9 to 6 schedule can be sustained alongside college classes three days a week without academic penalty.",
            evidence_quote="9 to 6 hours, I have classes three days a week",
            status="unreviewed"
        ),
        AssumptionItem(
            id="asm-2",
            statement="You assume the role of junior developer at this company will provide the specific type of industry experience that advances your career goals.",
            evidence_quote="industry experience",
            status="unreviewed"
        ),
        AssumptionItem(
            id="asm-3",
            statement="You assume the proximity to home will sufficiently offset the physical and mental fatigue of managing work and classes simultaneously.",
            evidence_quote="office is close to home",
            status="unreviewed"
        )
    ],
    overlooked_factors=[
        OverlookedFactor(
            category="academics",
            title="Academic Compatibility & Exam Crunch",
            observation="How the 9-to-6 schedule accommodates university exams, group projects, mandatory lab hours, and class attendance is unaddressed.",
            relevance_why="Academic penalties or failed coursework could delay graduation, altering the net benefit of a 6-month stipend."
        ),
        OverlookedFactor(
            category="learning_quality",
            title="Mentorship & Team Engineering Culture",
            observation="The presence of senior engineering mentorship, code review processes, and actual learning scope is not described.",
            relevance_why="A junior title without active guidance can result in repetitive tasks with little transferable skill acquisition."
        ),
        OverlookedFactor(
            category="time_reversibility",
            title="Contract Terms & Reversibility",
            observation="Notice periods, early exit clauses, and flexibility during university midterms have not been articulated.",
            relevance_why="Knowing whether you can adapt or exit early if coursework demands spike determines your downside risk."
        ),
        OverlookedFactor(
            category="opportunity_cost",
            title="Long-Term Career Alignment",
            observation="How this specific technical stack or domain connects to your intended career trajectory post-graduation is absent.",
            relevance_why="Time invested here displaces personal projects, research, or internships in other specialized domains."
        )
    ],
    conflicts=[
        ConflictItem(
            id="cnf-1",
            statement_a="Mainly considering it for the stipend, the closeness",
            statement_b="industry experience",
            tension="You cite high-value industry experience as a primary motivation, yet the decision factors you emphasize are logistical convenience and immediate cash compensation."
        )
    ],
    socratic_questions=[
        SocraticQuestion(
            id="sq-1",
            text="What would need to be true about the daily engineering work six months from now for you to feel this was the best use of your semester?",
            relates_to="Learning Quality"
        ),
        SocraticQuestion(
            id="sq-2",
            text="How would each option shape your weekly schedule during critical exam periods or heavy project deadlines?",
            relates_to="Academic Compatibility"
        ),
        SocraticQuestion(
            id="sq-3",
            text="What specific information do you currently have about who will mentor you, and what are you inferring or guessing?",
            relates_to="Mentorship Verification"
        ),
        SocraticQuestion(
            id="sq-4",
            text="What would be your criteria for deciding to step back if balancing both work and university becomes unsustainable?",
            relates_to="Reversibility & Boundaries"
        )
    ],
    pre_mortem_analysis=[
        PreMortemFailureMode(
            id="pm-1",
            scenario="Six months in, mandatory class attendance triggers grade drops or exam disqualification while work deadlines prevent study.",
            tied_assumption="Assumes 9-6 schedule fits alongside classes 3 days a week without schedule clashes.",
            neutral_check="What explicit written agreement exists between your university attendance policy and this employer's daily hours?"
        ),
        PreMortemFailureMode(
            id="pm-2",
            scenario="The role turns out to be isolated manual testing or maintenance with no senior code review, yielding negligible resume advancement.",
            tied_assumption="Assumes junior developer title guarantees high-caliber learning experience.",
            neutral_check="What specific technical tasks did the engineering manager confirm you would own during your first 90 days?"
        )
    ],
    validation_plan=[
        ValidationStep(
            id="val-1",
            title="Examine Academic Regulations",
            action_to_verify="Check university handbook on mandatory lecture attendance thresholds and exam reschedule policies.",
            target_dimension="Academics"
        ),
        ValidationStep(
            id="val-2",
            title="Clarify Engineering Team Structure",
            action_to_verify="Inquire during onboarding/interview regarding who conducts code reviews and team meeting frequency.",
            target_dimension="Learning Quality"
        ),
        ValidationStep(
            id="val-3",
            title="Verify Exit Clause & Flexibility",
            action_to_verify="Read offer letter terms for notice period duration and study leave accommodations.",
            target_dimension="Reversibility"
        )
    ],
    scope_disclaimer="This report contains no recommendation. The decision remains entirely yours.",
    guardrail_passed=True,
    guardrail_flags=[]
)
