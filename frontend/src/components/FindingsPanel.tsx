import React, { useState } from 'react';
import { AnalysisResponse, AssumptionItem } from '../types';
import { FindingCard } from './FindingCard';
import { ConflictCard } from './ConflictCard';
import {
  FileText,
  Search,
  Scale,
  HelpCircle,
  Send,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  ListChecks
} from 'lucide-react';
import { followupReflection } from '../services/api';

interface FindingsPanelProps {
  analysis: AnalysisResponse | null;
  decisionText: string;
  onUpdateAssumption: (id: string, status: 'confirmed' | 'dismissed' | 'unresolved', note?: string) => void;
  onOpenReport: () => void;
  loading: boolean;
}

export const FindingsPanel: React.FC<FindingsPanelProps> = ({
  analysis,
  decisionText,
  onUpdateAssumption,
  onOpenReport,
  loading
}) => {
  const [activeTab, setActiveTab] = useState<'assumptions' | 'overlooked' | 'conflicts' | 'premortem' | 'validation' | 'questions'>('assumptions');
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState('');
  const [followupLoading, setFollowupLoading] = useState(false);
  const [followupResults, setFollowupResults] = useState<{ [qId: string]: any }>({});

  if (loading) {
    return (
      <div
        style={{
          width: '450px',
          backgroundColor: 'var(--carbon)',
          borderLeft: '1px solid var(--border-default)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          flexShrink: 0
        }}
      >
        <Loader2 className="animate-spin" size={32} color="var(--chalk)" style={{ marginBottom: '16px' }} />
        <h3 style={{ fontSize: '15px', color: 'var(--chalk)', marginBottom: '6px' }}>
          Deconstructing Reasoning...
        </h3>
        <p style={{ fontSize: '12px', color: 'var(--grey-neutral)', textAlign: 'center', maxWidth: '300px', lineHeight: 1.5 }}>
          Examining unstated premises, checking quote grounding, scanning silent dimensions, and executing anti-advice guardrail pass.
        </p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div
        style={{
          width: '450px',
          backgroundColor: 'var(--carbon)',
          borderLeft: '1px solid var(--border-default)',
          padding: '30px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          height: '100vh',
          flexShrink: 0
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: 'var(--slate-dark)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px'
          }}
        >
          <Search size={22} color="var(--platinum-soft)" />
        </div>
        <h3 style={{ fontSize: '16px', color: 'var(--chalk)', marginBottom: '8px' }}>
          Live Cognitive Findings
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--grey-neutral)', lineHeight: 1.5, maxWidth: '300px' }}>
          Submit a decision in the workspace or click a benchmark scenario to uncover unexamined premises, reasoning tensions, and validation plans.
        </p>
      </div>
    );
  }

  const reviewedAssumptionsCount = analysis.assumptions.filter(a => a.status !== 'unreviewed').length;

  const handleSendFollowup = async (qId: string, qText: string) => {
    if (!answerText.trim() || followupLoading) return;
    setFollowupLoading(true);
    try {
      const res = await followupReflection(
        analysis.conversation_id,
        decisionText,
        qId,
        qText,
        answerText,
        analysis.assumptions
      );
      setFollowupResults(prev => ({ ...prev, [qId]: res }));
      setAnswerText('');
    } catch (e) {
      console.error('Followup failed:', e);
    } finally {
      setFollowupLoading(false);
    }
  };

  return (
    <aside
      style={{
        width: '460px',
        backgroundColor: 'var(--carbon)',
        borderLeft: '1px solid var(--border-default)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        flexShrink: 0
      }}
      className="no-print"
    >
      {/* Panel Top Header */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-default)',
          backgroundColor: 'var(--slate-dark)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--grey-neutral)', fontFamily: 'var(--font-mono)' }}>
            Epistemic Audit Panel
          </div>
          <h3 style={{ fontSize: '15px', color: 'var(--chalk)', margin: 0, fontWeight: 600 }}>
            Structured Findings
          </h3>
        </div>

        <button onClick={onOpenReport} className="btn btn-primary btn-sm" title="Preview and export decision brief">
          <FileText size={13} /> Decision Brief
        </button>
      </div>

      {/* Tabs Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          borderBottom: '1px solid var(--border-default)',
          backgroundColor: 'var(--void)'
        }}
      >
        <button
          onClick={() => setActiveTab('assumptions')}
          style={{
            padding: '10px 2px',
            backgroundColor: activeTab === 'assumptions' ? 'var(--carbon)' : 'transparent',
            border: 'none',
            borderBottom: activeTab === 'assumptions' ? '2px solid var(--chalk)' : '2px solid transparent',
            color: activeTab === 'assumptions' ? 'var(--chalk)' : 'var(--grey-neutral)',
            fontSize: '10px',
            fontWeight: 600,
            cursor: 'pointer',
            textAlign: 'center'
          }}
          title="Extracted Assumptions"
        >
          Assumptions ({analysis.assumptions.length})
        </button>

        <button
          onClick={() => setActiveTab('overlooked')}
          style={{
            padding: '10px 2px',
            backgroundColor: activeTab === 'overlooked' ? 'var(--carbon)' : 'transparent',
            border: 'none',
            borderBottom: activeTab === 'overlooked' ? '2px solid var(--chalk)' : '2px solid transparent',
            color: activeTab === 'overlooked' ? 'var(--chalk)' : 'var(--grey-neutral)',
            fontSize: '10px',
            fontWeight: 600,
            cursor: 'pointer',
            textAlign: 'center'
          }}
          title="Overlooked Dimensions"
        >
          Silent ({analysis.overlooked_factors.length})
        </button>

        <button
          onClick={() => setActiveTab('conflicts')}
          style={{
            padding: '10px 2px',
            backgroundColor: activeTab === 'conflicts' ? 'var(--carbon)' : 'transparent',
            border: 'none',
            borderBottom: activeTab === 'conflicts' ? '2px solid var(--chalk)' : '2px solid transparent',
            color: activeTab === 'conflicts' ? 'var(--chalk)' : 'var(--grey-neutral)',
            fontSize: '10px',
            fontWeight: 600,
            cursor: 'pointer',
            textAlign: 'center'
          }}
          title="Reasoning Contradictions"
        >
          Tensions ({analysis.conflicts.length})
        </button>

        <button
          onClick={() => setActiveTab('premortem')}
          style={{
            padding: '10px 2px',
            backgroundColor: activeTab === 'premortem' ? 'var(--carbon)' : 'transparent',
            border: 'none',
            borderBottom: activeTab === 'premortem' ? '2px solid var(--chalk)' : '2px solid transparent',
            color: activeTab === 'premortem' ? 'var(--chalk)' : 'var(--grey-neutral)',
            fontSize: '10px',
            fontWeight: 600,
            cursor: 'pointer',
            textAlign: 'center'
          }}
          title="Pre-Mortem Failure Analysis"
        >
          Pre-Mortem ({analysis.pre_mortem_analysis?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('validation')}
          style={{
            padding: '10px 2px',
            backgroundColor: activeTab === 'validation' ? 'var(--carbon)' : 'transparent',
            border: 'none',
            borderBottom: activeTab === 'validation' ? '2px solid var(--chalk)' : '2px solid transparent',
            color: activeTab === 'validation' ? 'var(--chalk)' : 'var(--grey-neutral)',
            fontSize: '10px',
            fontWeight: 600,
            cursor: 'pointer',
            textAlign: 'center'
          }}
          title="Validation Action Steps"
        >
          Validate ({analysis.validation_plan?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('questions')}
          style={{
            padding: '10px 2px',
            backgroundColor: activeTab === 'questions' ? 'var(--carbon)' : 'transparent',
            border: 'none',
            borderBottom: activeTab === 'questions' ? '2px solid var(--chalk)' : '2px solid transparent',
            color: activeTab === 'questions' ? 'var(--chalk)' : 'var(--grey-neutral)',
            fontSize: '10px',
            fontWeight: 600,
            cursor: 'pointer',
            textAlign: 'center'
          }}
          title="Socratic Symmetric Questions"
        >
          Socratic ({analysis.socratic_questions.length})
        </button>
      </div>

      {/* Tab Body */}
      <div style={{ padding: '16px', flex: 1, overflowY: 'auto' }}>
        {/* ASSUMPTIONS TAB */}
        {activeTab === 'assumptions' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontSize: '12px', color: 'var(--platinum-soft)' }}>
                Triage unstated premises grounded in your quotes:
              </span>
              <span className="badge badge-neutral" style={{ fontSize: '10px' }}>
                {reviewedAssumptionsCount}/{analysis.assumptions.length} Reviewed
              </span>
            </div>

            {analysis.assumptions.length === 0 ? (
              <div style={{ color: 'var(--grey-neutral)', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
                No explicit assumptions extracted.
              </div>
            ) : (
              analysis.assumptions.map(item => (
                <FindingCard key={item.id} item={item} onUpdate={onUpdateAssumption} />
              ))
            )}
          </div>
        )}

        {/* OVERLOOKED FACTORS TAB */}
        {activeTab === 'overlooked' && (
          <div>
            <div style={{ fontSize: '12px', color: 'var(--platinum-soft)', marginBottom: '14px' }}>
              Systematic scan of dimensions absent from your description:
            </div>

            {analysis.overlooked_factors.length === 0 ? (
              <div style={{ color: 'var(--grey-neutral)', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
                No unexamined dimensions flagged.
              </div>
            ) : (
              analysis.overlooked_factors.map((factor, idx) => (
                <div
                  key={idx}
                  className="card"
                  style={{
                    padding: '14px',
                    marginBottom: '12px',
                    backgroundColor: 'var(--carbon)',
                    borderColor: 'var(--border-default)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h4 style={{ fontSize: '13px', color: 'var(--chalk)', margin: 0 }}>
                      {factor.title}
                    </h4>
                    <span className="badge badge-neutral" style={{ fontSize: '10px' }}>
                      {factor.category}
                    </span>
                  </div>

                  <p style={{ fontSize: '12px', color: 'var(--platinum-soft)', lineHeight: 1.45, marginBottom: '8px' }}>
                    {factor.observation}
                  </p>

                  <div style={{ fontSize: '11px', color: 'var(--grey-neutral)', backgroundColor: 'var(--void)', padding: '6px 10px', borderRadius: '4px' }}>
                    <span style={{ color: 'var(--platinum-mid)', fontWeight: 500 }}>Why examine this: </span>
                    {factor.relevance_why}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* CONFLICTS TAB */}
        {activeTab === 'conflicts' && (
          <div>
            <div style={{ fontSize: '12px', color: 'var(--platinum-soft)', marginBottom: '14px' }}>
              Direct quotes where your statements pull in opposite directions:
            </div>

            {analysis.conflicts.length === 0 ? (
              <div style={{ color: 'var(--grey-neutral)', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
                No direct internal contradictions surfaced.
              </div>
            ) : (
              analysis.conflicts.map(conflict => (
                <ConflictCard key={conflict.id} conflict={conflict} />
              ))
            )}
          </div>
        )}

        {/* PRE-MORTEM TAB */}
        {activeTab === 'premortem' && (
          <div>
            <div style={{ fontSize: '12px', color: 'var(--platinum-soft)', marginBottom: '14px' }}>
              Prospective hindsight: Plausible failure mechanisms if assumptions prove false.
            </div>

            {(!analysis.pre_mortem_analysis || analysis.pre_mortem_analysis.length === 0) ? (
              <div style={{ color: 'var(--grey-neutral)', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
                No failure modes flagged for this scenario.
              </div>
            ) : (
              analysis.pre_mortem_analysis.map((pm, i) => (
                <div
                  key={pm.id || i}
                  className="card"
                  style={{
                    padding: '14px',
                    marginBottom: '12px',
                    backgroundColor: 'var(--carbon)',
                    borderLeft: '3px solid var(--grey-pewter)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <AlertTriangle size={14} color="var(--chalk)" />
                    <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--chalk)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                      Plausible Failure Scenario
                    </span>
                  </div>

                  <p style={{ fontSize: '13px', color: 'var(--chalk)', marginBottom: '8px', lineHeight: 1.45 }}>
                    {pm.scenario}
                  </p>

                  <div style={{ fontSize: '11px', color: 'var(--platinum-soft)', backgroundColor: 'var(--void)', padding: '6px 10px', borderRadius: '4px', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--grey-neutral)' }}>Root Assumption: </span>
                    {pm.tied_assumption}
                  </div>

                  <div style={{ fontSize: '11px', color: 'var(--platinum-mid)' }}>
                    <strong>Diagnostic Check: </strong> {pm.neutral_check}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* VALIDATION PLAN TAB */}
        {activeTab === 'validation' && (
          <div>
            <div style={{ fontSize: '12px', color: 'var(--platinum-soft)', marginBottom: '14px' }}>
              Objective non-prescriptive actions to test your assumptions before deciding:
            </div>

            {(!analysis.validation_plan || analysis.validation_plan.length === 0) ? (
              <div style={{ color: 'var(--grey-neutral)', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
                No specific validation actions generated.
              </div>
            ) : (
              analysis.validation_plan.map((val, i) => (
                <div
                  key={val.id || i}
                  className="card"
                  style={{
                    padding: '14px',
                    marginBottom: '12px',
                    backgroundColor: 'var(--carbon)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ListChecks size={14} color="var(--chalk)" />
                      <strong style={{ fontSize: '13px', color: 'var(--chalk)' }}>
                        {val.title}
                      </strong>
                    </div>
                    <span className="badge badge-neutral" style={{ fontSize: '10px' }}>
                      {val.target_dimension}
                    </span>
                  </div>

                  <p style={{ fontSize: '12px', color: 'var(--platinum-soft)', lineHeight: 1.45 }}>
                    {val.action_to_verify}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {/* SOCRATIC QUESTIONS TAB */}
        {activeTab === 'questions' && (
          <div>
            <div style={{ fontSize: '12px', color: 'var(--platinum-soft)', marginBottom: '14px' }}>
              Non-leading inquiries that apply symmetrically to all options:
            </div>

            {analysis.socratic_questions.map((q) => {
              const isReplying = activeQuestionId === q.id;
              const result = followupResults[q.id];

              return (
                <div
                  key={q.id}
                  className="card"
                  style={{
                    padding: '14px',
                    marginBottom: '12px',
                    backgroundColor: 'var(--carbon)',
                    borderColor: isReplying ? 'var(--grey-pewter)' : 'var(--border-default)'
                  }}
                >
                  <div style={{ fontSize: '10px', color: 'var(--grey-neutral)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
                    Focus: {q.relates_to}
                  </div>

                  <p style={{ fontSize: '13px', color: 'var(--chalk)', lineHeight: 1.45, marginBottom: '10px', fontWeight: 500 }}>
                    {q.text}
                  </p>

                  {/* Toggle Reflection Answer Box */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => {
                        setActiveQuestionId(isReplying ? null : q.id);
                        setAnswerText('');
                      }}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '11px', padding: '4px 8px' }}
                    >
                      {isReplying ? 'Close' : 'Reflect on this question'}
                    </button>
                  </div>

                  {isReplying && (
                    <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                      <textarea
                        className="input-base"
                        rows={2}
                        placeholder="Write your answer or thoughts..."
                        value={answerText}
                        onChange={(e) => setAnswerText(e.target.value)}
                        style={{ fontSize: '12px', resize: 'vertical', marginBottom: '8px' }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => handleSendFollowup(q.id, q.text)}
                          disabled={!answerText.trim() || followupLoading}
                          className="btn btn-primary btn-sm"
                        >
                          {followupLoading ? <Loader2 className="animate-spin" size={12} /> : <Send size={12} />}
                          Deepen Analysis
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Followup Result Insight */}
                  {result && (
                    <div style={{ marginTop: '12px', padding: '10px', backgroundColor: 'var(--void)', borderRadius: '6px', borderLeft: '2px solid var(--chalk)' }}>
                      <div style={{ fontSize: '11px', color: 'var(--chalk)', marginBottom: '4px', fontWeight: 600 }}>
                        Perspective Nuance:
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--platinum-soft)', marginBottom: '6px' }}>
                        {result.clarified_insight || result.acknowledgment}
                      </div>
                      {result.new_questions?.map((nq: any, i: number) => (
                        <div key={i} style={{ fontSize: '11px', color: 'var(--chalk)', fontStyle: 'italic', marginTop: '4px' }}>
                          → Follow-up to consider: "{nq.text}"
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Scope Verification Notice */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-default)', backgroundColor: 'var(--void)', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <CheckCircle2 size={13} color="var(--platinum-mid)" />
        <span style={{ fontSize: '11px', color: 'var(--grey-neutral)' }}>
          {analysis.scope_disclaimer}
        </span>
      </div>
    </aside>
  );
};
