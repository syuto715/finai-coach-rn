import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Expense } from '../models/expense';
import type { ActionProposal } from '../models/action-proposal';
import type { Subscription } from '../models/subscription';
import type { ExecutionRecord } from '../models/execution-record';
import type { UserProfile } from '../models/user-profile';
import type { ExpenseCategory } from '../models/category';

const KEYS = {
  PROFILE: '@finai_profile',
  EXPENSES: '@finai_expenses',
  PROPOSALS: '@finai_proposals',
  SUBSCRIPTIONS: '@finai_subscriptions',
  EXECUTIONS: '@finai_executions',
  CATEGORIES: '@finai_categories',
} as const;

// ── Generic helpers ─────────────────────────────────────────────────────────

async function loadArray<T>(key: string): Promise<T[]> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return [];
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

async function saveArray<T>(key: string, data: T[]): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch {
    // silently fail
  }
}

async function loadObject<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function saveObject<T>(key: string, data: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch {
    // silently fail
  }
}

// ── Expenses ────────────────────────────────────────────────────────────────

export async function loadExpenses(): Promise<Expense[]> {
  return loadArray<Expense>(KEYS.EXPENSES);
}

export async function saveExpenses(expenses: Expense[]): Promise<void> {
  return saveArray(KEYS.EXPENSES, expenses);
}

// ── Proposals ───────────────────────────────────────────────────────────────

export async function loadProposals(): Promise<ActionProposal[]> {
  return loadArray<ActionProposal>(KEYS.PROPOSALS);
}

export async function saveProposals(proposals: ActionProposal[]): Promise<void> {
  return saveArray(KEYS.PROPOSALS, proposals);
}

// ── Subscriptions ───────────────────────────────────────────────────────────

export async function loadSubscriptions(): Promise<Subscription[]> {
  return loadArray<Subscription>(KEYS.SUBSCRIPTIONS);
}

export async function saveSubscriptions(subs: Subscription[]): Promise<void> {
  return saveArray(KEYS.SUBSCRIPTIONS, subs);
}

// ── Execution Records ───────────────────────────────────────────────────────

export async function loadExecutions(): Promise<ExecutionRecord[]> {
  return loadArray<ExecutionRecord>(KEYS.EXECUTIONS);
}

export async function saveExecutions(records: ExecutionRecord[]): Promise<void> {
  return saveArray(KEYS.EXECUTIONS, records);
}

// ── User Profile ────────────────────────────────────────────────────────────

export async function loadProfile(): Promise<UserProfile | null> {
  return loadObject<UserProfile>(KEYS.PROFILE);
}

export async function saveProfile(profile: UserProfile): Promise<void> {
  return saveObject(KEYS.PROFILE, profile);
}

// ── Categories ──────────────────────────────────────────────────────────────

export async function loadCategories(): Promise<ExpenseCategory[]> {
  return loadArray<ExpenseCategory>(KEYS.CATEGORIES);
}

export async function saveCategories(categories: ExpenseCategory[]): Promise<void> {
  return saveArray(KEYS.CATEGORIES, categories);
}

// ── Delete helpers ──────────────────────────────────────────────────────────

export async function deleteProfile(): Promise<void> {
  try {
    await AsyncStorage.removeItem(KEYS.PROFILE);
  } catch {
    // silently fail
  }
}
