import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatWorkspace } from './components/ChatWorkspace';
import { FindingsPanel } from './components/FindingsPanel';
import { ReportModal } from './components/ReportModal';
import { EvaluationModal } from './components/EvaluationModal';
import { ScenarioPreset, AnalysisResponse } from './types';
import { fetchScenarios, analyzeDecision } from './services/api';

export function App() {
  const [scenarios, setScenarios] = useState<ScenarioPreset[]>([]);
  const [activeScenarioId, setActiveScenarioId] = useState<string | undefined>(undefined);
  
  const [decisionText, setDecisionText] = useState('');
  const [stakes, setStakes] = useState('high');
  const [deadline, setDeadline] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [confidenceBefore, setConfidenceBefore] = useState<number>(85);
  const [confidenceAfter, setConfidenceAfter] = useState<number | undefined>(undefined);
  
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showReportModal, setShowReportModal] = useState(false);
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);

  // Load scenarios on mount
  useEffect(() => {
    fetchScenarios().then(data => {
      setScenarios(data);
      if (data.length > 0) {
        const official = data.find(s => s.id === 'internship-official') || data[0];
        setActiveScenarioId(official.id);
        setDecisionText(official.text);
        setStakes(official.stakes);
        setOptions(official.options);
        setConfidenceBefore(official.confidence_before || 85);
      }
    });
  }, []);

  const handleSelectScenario = async (scenario: ScenarioPreset) => {
    setActiveScenarioId(scenario.id);
    setDecisionText(scenario.text);
    setStakes(scenario.stakes);
    setOptions(scenario.options);
    setConfidenceBefore(scenario.confidence_before || 75);
    setConfidenceAfter(undefined);
    setError(null);
    
    setLoading(true);
    try {
      const result = await analyzeDecision(
        scenario.text,
        scenario.options,
        scenario.stakes,
        undefined,
        scenario.confidence_before || 75
      );
      setAnalysis(result);
      if (result.confidence_after) {
        setConfidenceAfter(result.confidence_after);
      }
    } catch (err: any) {
      setError(err.message || 'Analysis error');
    } finally {
      setLoading(false);
    }
  };

  const handleNewAnalysis = () => {
    setActiveScenarioId(undefined);
    setDecisionText('');
    setStakes('medium');
    setDeadline('');
    setOptions([]);
    setConfidenceBefore(75);
    setConfidenceAfter(undefined);
    setAnalysis(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!decisionText.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeDecision(decisionText, options, stakes, deadline, confidenceBefore);
      setAnalysis(result);
      setConfidenceAfter(result.confidence_after || Math.max(30, confidenceBefore - 20));
    } catch (err: any) {
      setError(err.message || 'Analysis request failed. Please check network/API status.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAssumption = (id: string, status: 'confirmed' | 'dismissed' | 'unresolved', note?: string) => {
    if (!analysis) return;
    const updatedAssumptions = analysis.assumptions.map(item => {
      if (item.id === id) {
        return { ...item, status, user_note: note !== undefined ? note : item.user_note };
      }
      return item;
    });
    setAnalysis({
      ...analysis,
      assumptions: updatedAssumptions
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        backgroundColor: 'var(--void)'
      }}
    >
      {/* 1. Left Sidebar */}
      <Sidebar
        scenarios={scenarios}
        activeScenarioId={activeScenarioId}
        onSelectScenario={handleSelectScenario}
        onNewAnalysis={handleNewAnalysis}
        onOpenEvaluation={() => setShowEvaluationModal(true)}
      />

      {/* 2. Center Stage: Chat Workspace */}
      <ChatWorkspace
        decisionText={decisionText}
        setDecisionText={setDecisionText}
        stakes={stakes}
        setStakes={setStakes}
        deadline={deadline}
        setDeadline={setDeadline}
        options={options}
        setOptions={setOptions}
        confidenceBefore={confidenceBefore}
        setConfidenceBefore={setConfidenceBefore}
        confidenceAfter={confidenceAfter}
        setConfidenceAfter={setConfidenceAfter}
        onAnalyze={handleAnalyze}
        onReset={handleNewAnalysis}
        analysis={analysis}
        loading={loading}
        error={error}
      />

      {/* 3. Right Panel: Live Cognitive Findings */}
      <FindingsPanel
        analysis={analysis}
        decisionText={decisionText}
        onUpdateAssumption={handleUpdateAssumption}
        onOpenReport={() => setShowReportModal(true)}
        loading={loading}
      />

      {/* 4. Modals */}
      {showReportModal && analysis && (
        <ReportModal
          analysis={{
            ...analysis,
            confidence_before: confidenceBefore,
            confidence_after: confidenceAfter
          }}
          originalText={decisionText}
          onClose={() => setShowReportModal(false)}
        />
      )}

      {showEvaluationModal && (
        <EvaluationModal onClose={() => setShowEvaluationModal(false)} />
      )}
    </div>
  );
}

export default App;
