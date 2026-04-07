import { useState, useEffect, useCallback } from 'react';
import { generateId } from '../utils/generateId';
import type { ExecutionRecord } from '../models/execution-record';
import { loadExecutions, saveExecutions } from '../services/storage';

export function useExecutions() {
  const [executions, setExecutions] = useState<ExecutionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    const data = await loadExecutions();
    setExecutions(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const addExecution = useCallback(
    async (proposalId: string, proposalTitle: string, memo: string = '') => {
      const record: ExecutionRecord = {
        id: generateId(),
        proposalId,
        proposalTitle,
        executedAt: new Date().toISOString(),
        memo,
      };
      const next = [...executions, record];
      setExecutions(next);
      await saveExecutions(next);
      return record;
    },
    [executions],
  );

  const sortedExecutions = [...executions].sort(
    (a, b) => new Date(b.executedAt).getTime() - new Date(a.executedAt).getTime(),
  );

  return {
    executions: sortedExecutions,
    loading,
    addExecution,
    reload,
  };
}
