export interface MonthlyRevenue {
  monthKey: string;
  monthLabel: string;
  orderCount: number;
  revenue: number;
}

export interface TopProduct {
  productId: string | null;
  productName: string;
  totalQty: number;
  totalRevenue: number;
}

export interface TopCustomer {
  customerPhone: string;
  customerName: string;
  orderCount: number;
  totalSpent: number;
}

export interface ReportPeriod {
  year: number;
  month: number;
}

export interface ReportData {
  periodLabel: string;
  startDate: string;
  endDate: string;
  monthlyRevenue: MonthlyRevenue[];
  topProducts: TopProduct[];
  topCustomers: TopCustomer[];
  periodRevenue: number;
  periodOrderCount: number;
}
