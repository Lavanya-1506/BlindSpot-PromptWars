import React, { useState } from 'react';
import { AssumptionItem } from '../types';
import { Check, X, HelpCircle, MessageSquare, Edit3 } from 'lucide-react';

interface FindingCardProps {
  item: AssumptionItem;
  onUpdate: (id: string, status: 'confirmed' | 'dismissed' | 'unresolved', note?: string) => void;
}

export const FindingCard: React.FC<FindingCardProps> = ({ item, onUpdate }) => {
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteText, setNoteText] = useState(item.user_note || '');

  const handleStatus = (status: 'confirmed' | 'dismissed' | 'unresolved') => {
    onUpdate(item.id, status, noteText);
  };

  const handleSaveNote = () => {
    onUpdate(item.id, item.status === 'unreviewed' ? 'unresolved' : item.status, noteText);
    setShowNoteInput(false);
  };

  const getStatusBadge = () => {
    switch (item.status) {
      case 'confirmed':
        return <span className="badge badge-gold" style={{ background: '#383838' }}>Confirmed by you</span>;
      case 'dismissed':
        return <span className="badge badge-neutral" style={{ textDecoration: 'line-through' }}>Rejected / Not true</span>;
      case 'unresolved':
        return <span className="badge badge-active" style={{ background: '#2B2B2B', borderColor: '#797979' }}>Unexamined</span>;
      default:
        return <span className="badge badge-neutral">Unreviewed</span>;
    }
  };

  return (
    <div
      className="card"
      style={{
        padding: '14px',
        marginBottom: '12px',
        backgroundColor: item.status === 'dismissed' ? '#222222' : 'var(--carbon)',
        borderColor: item.status === 'confirmed' ? 'var(--grey-pewter)' : 'var(--border-default)',
        opacity: item.status === 'dismissed' ? 0.75 : 1
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        {getStatusBadge()}
        <button
          onClick={() => setShowNoteInput(!showNoteInput)}
          className="btn-ghost btn-sm"
          style={{ padding: '2px 6px', fontSize: '11px', color: 'var(--text-muted)' }}
          title="Add personal reflection note"
        >
          <Edit3 size={12} /> {item.user_note ? 'Edit Note' : 'Add Note'}
        </button>
      </div>

      <p style={{ fontSize: '13px', color: 'var(--chalk)', marginBottom: '10px', lineHeight: '1.45' }}>
        {item.statement}
      </p>

      {item.evidence_quote && (
        <div
          style={{
            backgroundColor: 'var(--void)',
            borderLeft: '2px solid var(--grey-pewter)',
            padding: '6px 10px',
            borderRadius: '0 4px 4px 0',
            marginBottom: '12px',
            fontSize: '11px',
            color: 'var(--platinum-soft)',
            fontFamily: 'var(--font-mono)'
          }}
        >
          <span style={{ color: 'var(--grey-neutral)', marginRight: '4px' }}>Based on:</span>
          "{item.evidence_quote}"
        </div>
      )}

      {/* Review Actions */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        <button
          onClick={() => handleStatus('confirmed')}
          className="btn btn-secondary btn-sm"
          style={{
            borderColor: item.status === 'confirmed' ? 'var(--chalk)' : 'var(--border-default)',
            background: item.status === 'confirmed' ? 'var(--slate-dark)' : 'transparent',
            color: item.status === 'confirmed' ? 'var(--chalk)' : 'var(--platinum-soft)'
          }}
        >
          <Check size={12} /> I assume this
        </button>

        <button
          onClick={() => handleStatus('dismissed')}
          className="btn btn-secondary btn-sm"
          style={{
            borderColor: item.status === 'dismissed' ? 'var(--grey-pewter)' : 'var(--border-default)',
            background: item.status === 'dismissed' ? '#2b2b2b' : 'transparent',
            color: item.status === 'dismissed' ? 'var(--platinum-mid)' : 'var(--text-muted)'
          }}
        >
          <X size={12} /> Not true
        </button>

        <button
          onClick={() => handleStatus('unresolved')}
          className="btn btn-secondary btn-sm"
          style={{
            borderColor: item.status === 'unresolved' ? 'var(--grey-pewter)' : 'var(--border-default)',
            background: item.status === 'unresolved' ? 'var(--slate-dark)' : 'transparent',
            color: item.status === 'unresolved' ? 'var(--chalk)' : 'var(--platinum-soft)'
          }}
        >
          <HelpCircle size={12} /> Hadn't thought of it
        </button>
      </div>

      {/* Inline User Note Display/Input */}
      {showNoteInput && (
        <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
          <input
            type="text"
            className="input-base"
            placeholder="Your verification note (e.g. 'I will verify this with the professor')..."
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            style={{ fontSize: '12px', padding: '6px 10px', marginBottom: '6px' }}
            onKeyDown={(e) => e.key === 'Enter' && handleSaveNote()}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
            <button onClick={() => setShowNoteInput(false)} className="btn btn-ghost btn-sm">Cancel</button>
            <button onClick={handleSaveNote} className="btn btn-primary btn-sm">Save Note</button>
          </div>
        </div>
      )}

      {item.user_note && !showNoteInput && (
        <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--platinum-soft)', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <MessageSquare size={11} color="var(--grey-neutral)" />
          <em>Note: {item.user_note}</em>
        </div>
      )}
    </div>
  );
};
