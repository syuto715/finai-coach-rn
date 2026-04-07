import { useState, useEffect, useCallback } from 'react';
import { generateId } from '../utils/generateId';
import type { Challenge } from '../models/challenge';
import { WEEKLY_CHALLENGES } from '../constants/challenges';
import { loadChallenge, saveChallenge } from '../services/storage';

export function useChallenge() {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    const data = await loadChallenge();
    // Check if challenge is expired
    if (data && new Date(data.endDate) < new Date()) {
      // Challenge expired, clear it
      setChallenge(null);
    } else {
      setChallenge(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const startNewChallenge = useCallback(async () => {
    const preset = WEEKLY_CHALLENGES[Math.floor(Math.random() * WEEKLY_CHALLENGES.length)];
    const now = new Date();
    const end = new Date(now);
    end.setDate(end.getDate() + 7);

    const newChallenge: Challenge = {
      id: generateId(),
      title: preset.title,
      description: preset.description,
      targetValue: preset.targetValue,
      currentValue: 0,
      unit: preset.unit,
      startDate: now.toISOString(),
      endDate: end.toISOString(),
      isCompleted: false,
      category: preset.category,
    };

    setChallenge(newChallenge);
    await saveChallenge(newChallenge);
    return newChallenge;
  }, []);

  const recordProgress = useCallback(async (increment: number = 1) => {
    if (!challenge) return;
    const updated = {
      ...challenge,
      currentValue: challenge.unit === '円'
        ? challenge.currentValue + increment
        : challenge.currentValue + 1,
    };

    if (updated.unit === '円') {
      updated.isCompleted = updated.currentValue <= updated.targetValue;
    } else {
      // For count-based: completed when reaching target
      // But for "limit" challenges, we track usage toward limit
      updated.isCompleted = updated.currentValue >= updated.targetValue;
    }

    setChallenge(updated);
    await saveChallenge(updated);
    return updated;
  }, [challenge]);

  return {
    challenge,
    loading,
    startNewChallenge,
    recordProgress,
    reload,
  };
}
