import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

import Residents from "./pages/Residents";
import Houses from "./pages/Houses";
import Expenses from "./pages/Expenses";
import BillSettings from "./pages/BillSettings";
import MonthlyBills from "./pages/MonthlyBills";
import Payments from "./pages/Payments";
import ReportDetail from "./pages/ReportDetail";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/residents" element={<Residents />} />
        <Route path="/houses" element={<Houses />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/bill-settings" element={<BillSettings />} />
        <Route path="/monthly-bills" element={<MonthlyBills />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/reports" element={<ReportDetail />} />
      </Routes>
    </MainLayout>
  );
}
