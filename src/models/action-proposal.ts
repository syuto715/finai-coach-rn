export type TrustLevel = 'high' | 'medium' | 'low';

export interface ActionProposal {
  id: string;
  createdAt: string;
  title: string;
  body: string;
  trustLevel: TrustLevel;
  applicableScope: string;
  expertNote: string;
  evidenceSource: string;
  evidenceUrl: string;
  evidenceDate: string;
  isExecuted: boolean;
  executedAt?: string;
}
