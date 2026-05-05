/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Transaction, TransactionStatus, UserRole, UserProfile } from './types';

export const MOCK_USERS: UserProfile[] = [
  { id: 'u1', name: 'Alex Rivera', email: 'alex.r@guardianx.ai', role: UserRole.ADMIN },
  { id: 'u2', name: 'Sam Chen', email: 'sam.c@guardianx.ai', role: UserRole.ANALYST },
  { id: 'u3', name: 'Jordan Taylor', email: 'jordan.t@guardianx.ai', role: UserRole.VIEWER },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'TX-90210',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    amount: 1250.00,
    currency: 'USD',
    merchant: 'Electronics Hub',
    location: 'Dubai, UAE',
    fraudScore: 82,
    status: TransactionStatus.FLAGGED,
    userId: 'cust-552',
    category: 'Electronics',
    cardType: 'Visa Signature',
    riskFactors: ['Geographic Anomaly', 'High Value Purchase', 'New Device'],
  },
  {
    id: 'TX-90211',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    amount: 45.50,
    currency: 'USD',
    merchant: 'Local Coffee Shop',
    location: 'San Francisco, CA',
    fraudScore: 5,
    status: TransactionStatus.APPROVED,
    userId: 'cust-101',
    category: 'Food & Dining',
    cardType: 'Mastercard Gold',
    riskFactors: [],
  },
  {
    id: 'TX-90212',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    amount: 3200.00,
    currency: 'USD',
    merchant: 'Crypto Exchange',
    location: 'Vilnius, LT',
    fraudScore: 95,
    status: TransactionStatus.REJECTED,
    userId: 'cust-998',
    category: 'Financial Services',
    cardType: 'Amex Platinum',
    riskFactors: ['Known High-Risk Merchant', 'Rapid Onboarding', 'VPN Detected'],
  },
  {
    id: 'TX-90213',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    amount: 120.00,
    currency: 'USD',
    merchant: 'Amazon.com',
    location: 'Seattle, WA',
    fraudScore: 12,
    status: TransactionStatus.APPROVED,
    userId: 'cust-441',
    category: 'Retail',
    cardType: 'Visa Debit',
    riskFactors: [],
  },
];
