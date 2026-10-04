import React from 'react';
import { AnalysisResponse } from '../types';
import {
  Loader2,
  Sparkles,
  Shield,
  RotateCcw,
  AlertCircle,
  HelpCircle,
  Compass,
  Gauge
} from 'lucide-react';

interface ChatWorkspaceProps {
  decisionText: string;
  setDecisionText: (text: string) => void;
  stakes: string;
  setStakes: (stakes: string) => void;
  deadline: string;
  setDeadline: (deadline: string) => void;
  options: string[];
  setOptions: (options: string[]) => void;
  confidenceBefore: number;
  setConfidenceBefore: (val: number) => void;
  confidenceAfter?: number;
  setConfidenceAfter: (val: number) => void;
  onAnalyze: () => void;
  onReset: () => void;
  analysis: AnalysisResponse | null;
  loading: boolean;
  error: string | null;
}

export const ChatWorkspace: React.FC<ChatWorkspaceProps> = ({
  decisionText,
  setDecisionText,
  stakes,
  setStakes,
  deadline,
  setDeadline,
  options,
  confidenceBefore,
  setConfidenceBefore,
  confidenceAfter,
  setConfidenceAfter,
  onAnalyze,
  onReset,
  analysis,
  loading,
  error
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      if (decisionText.trim() && !loading) {
        onAnalyze();
      }
    }
  };

  return (
    <main
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: 'var(--void)',
        overflow: 'hidden'
      }}
    >
      {/* Top Workspace Header */}
      <header
        style={{
          padding: '14px 24px',
          borderBottom: '1px solid var(--border-default)',
          backgroundColor: 'var(--carbon)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0
        }}
        className="no-print"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h2 style={{ fontSize: '15px', color: 'var(--chalk)', margin: 0, fontWeight: 600 }}>
            {analysis ? 'Active Decision Examination' : 'Decision Workspace'}
          </h2>
          <span className="badge badge-gold" style={{ fontSize: '10px' }}>
            <Shield size={11} /> Non-Directive AI
          </span>
          {stakes && (
            <span className="badge badge-neutral" style={{ textTransform: 'capitalize' }}>
              {stakes} Stakes
            </span>
          )}
        </div>

        {analysis && (
          <button onClick={onReset} className="btn btn-ghost btn-sm" title="Clear and begin new analysis">
            <RotateCcw size={13} /> Reset Session
          </button>
        )}
      </header>

      {/* Main Conversation & Reflection Thread */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px 30px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}
      >
        {/* Welcome Empty State */}
        {!analysis && !loading && (
          <div style={{ maxWidth: '640px', margin: '30px auto', textAlign: 'center' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '12px',
                backgroundColor: 'var(--carbon)',
                border: '1px solid var(--grey-pewter)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                boxShadow: 'var(--shadow-glow)'
              }}
            >
              <Compass size={28} color="var(--chalk)" />
            </div>

            <h1 style={{ fontSize: '26px', fontWeight: 700, color: 'var(--chalk)', marginBottom: '10px' }}>
              See what your reasoning might be missing.
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--platinum-soft)', lineHeight: 1.6, marginBottom: '24px' }}>
              When weighing critical decisions, human attention naturally anchors on visible benefits while skipping unstated assumptions and conflicting priorities. <strong>The Blind Spot</strong> acts as an analytical thinking companion—posing sharp questions without ever dictating what to choose.
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                textAlign: 'left'
              }}
            >
              <div className="card" style={{ padding: '14px', backgroundColor: 'var(--carbon)' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--chalk)', marginBottom: '4px' }}>
                  1. Unstated Assumptions
                </div>
                <div style={{ fontSize: '11px', color: 'var(--grey-neutral)', lineHeight: 1.4 }}>
                  Pinpoints unspoken hypotheses and anchors every claim directly in your own words.
                </div>
              </div>

              <div className="card" style={{ padding: '14px', backgroundColor: 'var(--carbon)' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--chalk)', marginBottom: '4px' }}>
                  2. Silent Dimensions
                </div>
                <div style={{ fontSize: '11px', color: 'var(--grey-neutral)', lineHeight: 1.4 }}>
                  Scans 8 life and operational categories to highlight factors you haven't mentioned.
                </div>
              </div>

              <div className="card" style={{ padding: '14px', backgroundColor: 'var(--carbon)' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--chalk)', marginBottom: '4px' }}>
                  3. Internal Tensions
                </div>
                <div style={{ fontSize: '11px', color: 'var(--grey-neutral)', lineHeight: 1.4 }}>
                  Surfaces points where your stated priorities pull against each other in opposite ways.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Submission Display */}
        {analysis && (
          <div
            style={{
              alignSelf: 'flex-end',
              maxWidth: '80%',
              backgroundColor: 'var(--slate-dark)',
              border: '1px solid var(--grey-pewter)',
              borderRadius: '12px 12px 2px 12px',
              padding: '16px 20px',
              boxShadow: 'var(--shadow-subtle)'
            }}
          >
            <div style={{ fontSize: '11px', color: 'var(--platinum-mid)', marginBottom: '4px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              Your Decision Context
            </div>
            <p style={{ fontSize: '14px', color: 'var(--chalk)', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
              {decisionText}
            </p>
          </div>
        )}

        {/* Clarification Required Alert */}
        {analysis?.needs_clarification && (
          <div
            className="card"
            style={{
              backgroundColor: 'var(--carbon)',
              borderLeft: '4px solid var(--chalk)',
              padding: '18px 22px',
              maxWidth: '85%'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <HelpCircle size={18} color="var(--chalk)" />
              <strong style={{ fontSize: '14px', color: 'var(--chalk)' }}>
                Essential Context Needed to Examine This
              </strong>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--platinum-soft)', lineHeight: 1.5 }}>
              {analysis.clarifying_question}
            </p>
          </div>
        )}

        {/* AI Deconstruction Summary Box */}
        {analysis && !analysis.needs_clarification && (
          <div
            className="card"
            style={{
              backgroundColor: 'var(--carbon)',
              borderLeft: '4px solid var(--platinum-soft)',
              padding: '20px 24px',
              maxWidth: '90%',
              alignSelf: 'flex-start'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Sparkles size={16} color="var(--chalk)" />
              <strong style={{ fontSize: '14px', color: 'var(--chalk)' }}>
                Decision Deconstruction Summary
              </strong>
            </div>

            <p style={{ fontSize: '14px', color: 'var(--chalk)', lineHeight: 1.6, marginBottom: '16px' }}>
              {analysis.decision_summary}
            </p>

            {analysis.options_detected.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--grey-neutral)', marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>
                  Detected Options:
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {analysis.options_detected.map((opt, i) => (
                    <span key={i} className="badge badge-neutral" style={{ textTransform: 'none', fontSize: '12px' }}>
                      {opt}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Confidence Before and After Tracker */}
            <div
              style={{
                backgroundColor: 'var(--void)',
                padding: '14px 18px',
                borderRadius: '6px',
                border: '1px solid var(--border-default)',
                marginBottom: '14px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--chalk)', fontSize: '12px', fontWeight: 600 }}>
                  <Gauge size={14} /> Epistemic Confidence Tracker
                </div>
                <span style={{ fontSize: '11px', color: 'var(--grey-neutral)' }}>
                  Initial: {confidenceBefore}% | Post-Analysis: {confidenceAfter || confidenceBefore}%
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '11px', color: 'var(--platinum-soft)' }}>Adjust post-analysis certainty:</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={confidenceAfter !== undefined ? confidenceAfter : confidenceBefore}
                  onChange={(e) => setConfidenceAfter(Number(e.target.value))}
                  style={{ flex: 1, accentColor: 'var(--chalk)' }}
                />
                <span style={{ fontSize: '12px', color: 'var(--chalk)', fontWeight: 600, minWidth: '35px' }}>
                  {confidenceAfter !== undefined ? confidenceAfter : confidenceBefore}%
                </span>
              </div>
              <div style={{ fontSize: '10px', color: 'var(--grey-neutral)', marginTop: '4px', fontStyle: 'italic' }}>
                Recorded without judgment: examining blind spots often reveals previously unrecognized complexity.
              </div>
            </div>

            <div
              style={{
                backgroundColor: 'var(--void)',
                padding: '12px 16px',
                borderRadius: '6px',
                border: '1px solid var(--border-default)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ fontSize: '12px', color: 'var(--platinum-soft)' }}>
                Surfaced: <strong>{analysis.assumptions.length} assumptions</strong>, <strong>{analysis.overlooked_factors.length} silent dimensions</strong>, <strong>{analysis.conflicts.length} tensions</strong>, and <strong>{analysis.pre_mortem_analysis?.length || 0} pre-mortem failure modes</strong>.
              </div>
              <span style={{ fontSize: '11px', color: 'var(--grey-neutral)', fontFamily: 'var(--font-mono)' }}>
                Examine in right panel →
              </span>
            </div>
          </div>
        )}

        {/* Error Notification */}
        {error && (
          <div
            style={{
              backgroundColor: '#2e1c1c',
              border: '1px solid #753333',
              borderRadius: '6px',
              padding: '12px 16px',
              color: '#fca5a5',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Decision Input Composer Box */}
      <div
        style={{
          padding: '16px 24px',
          borderTop: '1px solid var(--border-default)',
          backgroundColor: 'var(--carbon)'
        }}
        className="no-print"
      >
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ position: 'relative' }}>
            <textarea
              className="input-base"
              rows={4}
              placeholder="Describe the decision you are weighing in your own words. What are the key details, constraints, benefits, and uncertainties?"
              value={decisionText}
              onChange={(e) => setDecisionText(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                fontSize: '14px',
                lineHeight: 1.5,
                resize: 'none',
                paddingBottom: '40px'
              }}
            />

            {/* Character counter & Hint inside composer */}
            <div
              style={{
                position: 'absolute',
                bottom: '10px',
                right: '14px',
                fontSize: '11px',
                color: decisionText.length > 2800 ? '#fca5a5' : 'var(--grey-neutral)',
                fontFamily: 'var(--font-mono)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>{decisionText.length}/3000 chars</span>
              <span style={{ color: 'var(--grey-pewter)' }}>• Cmd+Enter to analyze</span>
            </div>
          </div>

          {/* Controls Bar: Stakes, Deadline, Confidence, and Action Button */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '12px',
              gap: '12px',
              flexWrap: 'wrap'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '12px', color: 'var(--platinum-soft)' }}>Stakes:</span>
                <select
                  value={stakes}
                  onChange={(e) => setStakes(e.target.value)}
                  className="input-base"
                  style={{ width: 'auto', padding: '4px 10px', fontSize: '12px' }}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '12px', color: 'var(--platinum-soft)' }}>Deadline:</span>
                <input
                  type="text"
                  placeholder="e.g. In 2 weeks"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="input-base"
                  style={{ width: '130px', padding: '4px 10px', fontSize: '12px' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '12px', color: 'var(--platinum-soft)' }}>Prior Confidence:</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={confidenceBefore}
                  onChange={(e) => setConfidenceBefore(Number(e.target.value))}
                  style={{ width: '80px', accentColor: 'var(--chalk)' }}
                />
                <span style={{ fontSize: '11px', color: 'var(--chalk)', fontFamily: 'var(--font-mono)' }}>
                  {confidenceBefore}%
                </span>
              </div>
            </div>

            <button
              onClick={onAnalyze}
              disabled={!decisionText.trim() || loading}
              className="btn btn-primary"
              style={{ padding: '10px 20px', fontSize: '14px' }}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Analyzing Reasoning...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Analyze My Reasoning
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};
