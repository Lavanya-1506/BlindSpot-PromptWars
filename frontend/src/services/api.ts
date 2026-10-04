import { AnalysisResponse, ScenarioPreset, AssumptionItem } from '../types';

const API_BASE = '/api';

export async function fetchScenarios(): Promise<ScenarioPreset[]> {
  try {
    const res = await fetch(`${API_BASE}/scenarios`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Fallback to local scenarios list:', err);
    return [
      {
        id: 'internship-official',
        title: '6-Month Junior Dev Internship',
        category: 'Career / Education',
        stakes: 'high',
        confidence_before: 85,
        text: 'Deciding whether to accept a 6-month junior developer internship. Stipend is good, office is close to home, 9 to 6 hours, I have classes three days a week. Mainly considering it for the stipend, closeness, and industry experience.',
        options: ['Accept 6-month internship', 'Decline and focus on college/studies']
      },
      {
        id: 'startup-pivot',
        title: 'Startup B2B SaaS Pivot',
        category: 'Entrepreneurship',
        stakes: 'high',
        confidence_before: 70,
        text: 'We run a B2C consumer habit tracker with 15k free users and 1% paid conversion. Run out of runway in 4 months. Thinking about pivoting entirely to enterprise employee wellness software because an enterprise contact said they would pay $10k/year for a pilot. Team is 3 junior engineers and me.',
        options: ['Pivot completely to B2B wellness', 'Double down on B2C growth with organic marketing']
      },
      {
        id: 'relocation-offer',
        title: 'Cross-Country Job Relocation',
        category: 'Career / Personal',
        stakes: 'medium',
        confidence_before: 80,
        text: 'Offered a senior product manager role in Seattle with a 35% compensation bump. Currently living comfortably in Chicago near family and lifelong friends. Partner works remotely and can move, but neither of us has ever lived on the West Coast. Moving would be exciting and fast-track my promotion.',
        options: ['Accept offer and relocate to Seattle', 'Stay at current company in Chicago']
      }
    ];
  }
}

export async function analyzeDecision(
  text: string,
  options: string[] = [],
  stakes: string = 'medium',
  deadline?: string,
  confidence_before: number = 75
): Promise<AnalysisResponse> {
  const res = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, options, stakes, deadline, confidence_before })
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Analysis failed (${res.status}): ${errorText}`);
  }

  return await res.json();
}

export async function followupReflection(
  conversation_id: string,
  decision_text: string,
  question_id: string,
  question_text: string,
  user_answer: string,
  current_assumptions: AssumptionItem[]
) {
  const res = await fetch(`${API_BASE}/followup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      conversation_id,
      decision_text,
      question_id,
      question_text,
      user_answer,
      current_assumptions
    })
  });

  if (!res.ok) {
    throw new Error(`Followup failed (${res.status})`);
  }

  return await res.json();
}

export async function fetchEvaluationSummary() {
  const res = await fetch(`${API_BASE}/evaluation`);
  if (!res.ok) throw new Error('Evaluation check failed');
  return await res.json();
}
