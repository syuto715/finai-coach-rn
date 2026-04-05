import { useState, useEffect, useCallback } from 'react';
import type { UserProfile } from '../models/user-profile';
import { defaultProfile } from '../models/user-profile';
import { loadProfile, saveProfile } from '../services/storage';

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile().then((data) => {
      if (data) setProfile(data);
      setLoading(false);
    });
  }, []);

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
    isOnboardingDone: profile.onboardingCompleted,
  };
}
