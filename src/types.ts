/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum UserRole {
  ADMIN = 'ADMIN',
  ANALYST = 'ANALYST',
  VIEWER = 'VIEWER',
}

export enum TransactionStatus {
  APPROVED = 'APPROVED',
  FLAGGED = 'FLAGGED',
  REJECTED = 'REJECTED',
  PENDING = 'PENDING',
}

export interface Transaction {
  id: string;
  timestamp: string;
  amount: number;
  currency: string;
  merchant: string;
  location: string;
  fraudScore: number; // 0-100
  status: TransactionStatus;
  userId: string;
  category: string;
  cardType: string;
  riskFactors: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface DashboardStats {
  totalAnalyzed: number;
  fraudPrevented: number;
  avgScore: number;
  falsePositiveRate: number;
}
