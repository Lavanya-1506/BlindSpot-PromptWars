import React from 'react';
import { ScenarioPreset } from '../types';
import { PlusCircle, Cpu, ShieldCheck, ChevronRight } from 'lucide-react';

interface SidebarProps {
  scenarios: ScenarioPreset[];
  activeScenarioId?: string;
  onSelectScenario: (scenario: ScenarioPreset) => void;
  onNewAnalysis: () => void;
  onOpenEvaluation: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  scenarios,
  activeScenarioId,
  onSelectScenario,
  onNewAnalysis,
  onOpenEvaluation
}) => {
  return (
    <aside
      style={{
        width: '280px',
        backgroundColor: 'var(--carbon)',
        borderRight: '1px solid var(--border-default)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        flexShrink: 0
      }}
      className="no-print"
    >
      {/* Brand Header */}
      <div style={{ padding: '20px 18px', borderBottom: '1px solid var(--border-default)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              backgroundColor: 'var(--chalk)',
              color: 'var(--void)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '15px'
            }}
          >
            BS
          </div>
          <div>
            <h2 style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--chalk)', margin: 0 }}>
              THE BLIND SPOT
            </h2>
            <div style={{ fontSize: '11px', color: 'var(--grey-neutral)', fontFamily: 'var(--font-mono)' }}>
              Non-Directive Thinking
            </div>
          </div>
        </div>

        <button
          onClick={onNewAnalysis}
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '16px', justifyContent: 'center' }}
        >
          <PlusCircle size={15} /> New Decision
        </button>
      </div>

      {/* Preset Scenarios List */}
      <div style={{ padding: '16px 14px', flex: 1, overflowY: 'auto' }}>
        <div
          style={{
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--grey-neutral)',
            marginBottom: '12px',
            fontFamily: 'var(--font-mono)',
            paddingLeft: '4px'
          }}
        >
          Benchmark Test Scenarios
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {scenarios.map((sc) => {
            const isSelected = activeScenarioId === sc.id;
            return (
              <button
                key={sc.id}
                onClick={() => onSelectScenario(sc)}
                style={{
                  textAlign: 'left',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: isSelected ? 'var(--slate-dark)' : 'transparent',
                  border: isSelected ? '1px solid var(--grey-pewter)' : '1px solid transparent',
                  color: isSelected ? 'var(--chalk)' : 'var(--platinum-soft)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--chalk)' }}>
                    {sc.title}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--grey-neutral)', marginTop: '2px' }}>
                    {sc.category} • <span style={{ textTransform: 'capitalize' }}>{sc.stakes} stakes</span>
                  </div>
                </div>
                <ChevronRight size={14} color="var(--grey-pewter)" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Actions: Evaluation Lab */}
      <div style={{ padding: '16px 18px', borderTop: '1px solid var(--border-default)', backgroundColor: 'var(--void)' }}>
        <button
          onClick={onOpenEvaluation}
          className="btn btn-secondary"
          style={{ width: '100%', justifyContent: 'center', marginBottom: '12px' }}
        >
          <Cpu size={14} /> Evaluation Lab
        </button>

        <div style={{ fontSize: '11px', color: 'var(--grey-neutral)', lineHeight: 1.4, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldCheck size={14} color="var(--platinum-mid)" />
          <span>Anti-advice guardrails active. Output contains zero recommendations.</span>
        </div>
      </div>
    </aside>
  );
};
