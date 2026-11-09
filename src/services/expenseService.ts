import api from '@/lib/axios';

/** The signed-in employee's reimbursement claims — /finance/expenses is self-scoped for employees. */

export const EXPENSE_TYPES = ['Travel', 'Food', 'Fuel', 'Hotel', 'Other'] as const;
export type ExpenseType = (typeof EXPENSE_TYPES)[number];
export type ExpenseStatus = 'Pending' | 'Approved' | 'Rejected' | 'Reimbursed';

export interface Expense {
  _id: string;
  type: ExpenseType;
  amount: number;
  date: string;
  description: string;
  receiptUrl?: string;
  status: ExpenseStatus;
  approverComments?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewExpense {
  type: ExpenseType;
  amount: number;
  date: string;
  description: string;
  receiptUrl?: string;
}

export const getMyExpenses = async (): Promise<Expense[]> => (await api.get('/finance/expenses')).data;

export const submitExpense = async (payload: NewExpense): Promise<Expense> => (await api.post('/finance/expenses', payload)).data;

/** Short, stable reference shown to the employee, e.g. "RIM-3FA9C1". */
export const expenseRef = (e: Pick<Expense, '_id'>) => `RIM-${e._id.slice(-6).toUpperCase()}`;
