import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Expense } from '../models/expense';
import type { ActionProposal } from '../models/action-proposal';
import type { Subscription } from '../models/subscription';
import type { ExecutionRecord } from '../models/execution-record';
import type { UserProfile } from '../models/user-profile';

const KEYS = {
  expenses: '@finai_expenses',
  proposals: '@finai_proposals',
  subscriptions: '@finai_subscriptions',
  executions: '@finai_executions',
  profile: '@finai_profile',
} as const;

// ── Generic helpers ─────────────────────────────────────────────────────────

async function loadArray<T>(key: string): Promise<T[]> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return [];
  return JSON.parse(raw) as T[];
}

async function saveArray<T>(key: string, data: T[]): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(data));
}

async function loadObject<T>(key: string): Promise<T | null> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return null;
  return JSON.parse(raw) as T;
}

async function saveObject<T>(key: string, data: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(data));
}

// ── Expenses ────────────────────────────────────────────────────────────────

export async function loadExpenses(): Promise<Expense[]> {
  return loadArray<Expense>(KEYS.expenses);
}

export async function saveExpenses(expenses: Expense[]): Promise<void> {
  return saveArray(KEYS.expenses, expenses);
}

// ── Proposals ───────────────────────────────────────────────────────────────

export async function loadProposals(): Promise<ActionProposal[]> {
  return loadArray<ActionProposal>(KEYS.proposals);
}

export async function saveProposals(proposals: ActionProposal[]): Promise<void> {
  return saveArray(KEYS.proposals, proposals);
}

// ── Subscriptions ───────────────────────────────────────────────────────────

export async function loadSubscriptions(): Promise<Subscription[]> {
  return loadArray<Subscription>(KEYS.subscriptions);
}

export async function saveSubscriptions(subs: Subscription[]): Promise<void> {
  return saveArray(KEYS.subscriptions, subs);
}

// ── Execution Records ───────────────────────────────────────────────────────

export async function loadExecutions(): Promise<ExecutionRecord[]> {
  return loadArray<ExecutionRecord>(KEYS.executions);
}

export async function saveExecutions(records: ExecutionRecord[]): Promise<void> {
  return saveArray(KEYS.executions, records);
}

// ── User Profile ────────────────────────────────────────────────────────────

export async function loadProfile(): Promise<UserProfile | null> {
  return loadObject<UserProfile>(KEYS.profile);
}

export async function saveProfile(profile: UserProfile): Promise<void> {
  return saveObject(KEYS.profile, profile);
}
