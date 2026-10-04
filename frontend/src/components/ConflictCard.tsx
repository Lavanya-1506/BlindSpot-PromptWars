import React from 'react';
import { ConflictItem } from '../types';
import { Scale } from 'lucide-react';

interface ConflictCardProps {
  conflict: ConflictItem;
}

export const ConflictCard: React.FC<ConflictCardProps> = ({ conflict }) => {
  return (
    <div
      className="card"
      style={{
        padding: '14px',
        marginBottom: '12px',
        backgroundColor: 'var(--carbon)',
        borderColor: 'var(--border-default)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
        <Scale size={14} color="var(--chalk)" />
        <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--platinum-soft)', fontFamily: 'var(--font-mono)' }}>
          Reasoning Tension Detected
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
        <div
          style={{
            backgroundColor: 'var(--void)',
            padding: '8px 10px',
            borderRadius: 'var(--radius-sm)',
            borderLeft: '2px solid var(--grey-pewter)'
          }}
        >
          <div style={{ fontSize: '10px', color: 'var(--grey-neutral)', textTransform: 'uppercase', marginBottom: '4px' }}>Statement A</div>
          <p style={{ fontSize: '12px', color: 'var(--chalk)', fontFamily: 'var(--font-mono)' }}>
            "{conflict.statement_a}"
          </p>
        </div>

        <div
          style={{
            backgroundColor: 'var(--void)',
            padding: '8px 10px',
            borderRadius: 'var(--radius-sm)',
            borderLeft: '2px solid var(--grey-pewter)'
          }}
        >
          <div style={{ fontSize: '10px', color: 'var(--grey-neutral)', textTransform: 'uppercase', marginBottom: '4px' }}>Statement B</div>
          <p style={{ fontSize: '12px', color: 'var(--chalk)', fontFamily: 'var(--font-mono)' }}>
            "{conflict.statement_b}"
          </p>
        </div>
      </div>

      <div style={{ fontSize: '12px', color: 'var(--platinum-soft)', lineHeight: '1.45', backgroundColor: '#242424', padding: '8px 10px', borderRadius: '4px' }}>
        <span style={{ color: 'var(--chalk)', fontWeight: 500 }}>Tension: </span>
        {conflict.tension}
      </div>
    </div>
  );
};
