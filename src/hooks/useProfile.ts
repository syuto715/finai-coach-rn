import { useState, useEffect, useCallback } from 'react';
import type { UserProfile } from '../models/user-profile';
import { defaultProfile } from '../models/user-profile';
import { loadProfile, saveProfile } from '../services/storage';

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    const data = await loadProfile();
    if (data) setProfile(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const updateProfile = useCallback(
    async (partial: Partial<UserProfile>) => {
      const next = { ...profile, ...partial };
      setProfile(next);
      await saveProfile(next);
      return next;
    },
    [profile],
  );

  const completeOnboarding = useCallback(async () => {
    return updateProfile({ onboardingCompleted: true });
  }, [updateProfile]);

  return {
    profile,
    loading,
    updateProfile,
    completeOnboarding,
    reload,
    isOnboardingDone: profile.onboardingCompleted,
  };
}
