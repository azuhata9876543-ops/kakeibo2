import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function Balance({ list = [] }) {
  const currentYear = new Date().getFullYear();
  const currentMonth = String(new Date().getMonth() + 1).padStart(2, "0");

  const [viewMode, setViewMode] = useState("MONTH");

  const [selectedYear, setSelectedYear] = useState(String(currentYear));
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const years = [
    currentYear - 2,
    currentYear - 1,
    currentYear,
    currentYear + 1,
  ];

  const months = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0"),
  );

  const filteredList = list.filter((item) => {
    if (!item.date) return false;

    if (viewMode === "MONTH") {
      // 月別: "YYYY-MM" が一致するか
      const targetYearMonth = `${selectedYear}-${selectedMonth}`;
      return item.date.startsWith(targetYearMonth);
    }

    if (viewMode === "YEAR") {
      // 年別: "YYYY" が一致するか
      return item.date.startsWith(selectedYear);
    }

    return true;
  });

  const totalIncome = filteredList
    .filter((item) => item.category && item.category.type === "INCOME")
    .reduce((sum, item) => sum + item.amount, 0);

  const totalExpense = filteredList
    .filter((item) => item.category && item.category.type === "EXPENSE")
    .reduce((sum, item) => sum + item.amount, 0);

  const totalBalance = totalIncome - totalExpense;

  const categoryMap = {};

  filteredList
    .filter((item) => item.category && item.category.type === "EXPENSE")
    .forEach((item) => {
      const name = item.category.category || "未分類";
      if (!categoryMap[name]) {
        categoryMap[name] = 0;
      }
      categoryMap[name] += item.amount;
    });

  const chartData = Object.keys(categoryMap).map((key) => ({
    name: key,
    value: categoryMap[key],
  }));

  const COLORS = [
    "#007bff",
    "#28a745",
    "#ffc107",
    "#dc3545",
    "#17a2b8",
    "#6c757d",
    "#6f42c1",
    "#e83e8c",
  ];

  return (
    <div className="card">
      <div className="balance-content">
        <div className="mode-buttons">
          <button
            type="button"
            className={`btn ${viewMode === "MONTH" ? "active" : ""}`}
            onClick={() => setViewMode("MONTH")}
          >
            月別
          </button>
          <button
            type="button"
            className={`btn ${viewMode === "YEAR" ? "active" : ""}`}
            onClick={() => setViewMode("YEAR")}
          >
            年別
          </button>
          <button
            type="button"
            className={`btn ${viewMode === "ALL" ? "active" : ""}`}
            onClick={() => setViewMode("ALL")}
          >
            すべてのデータ
          </button>
        </div>

        <div className="month-selector">
          {viewMode !== "ALL" && (
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}年
                </option>
              ))}
            </select>
          )}
          {viewMode === "MONTH" && (
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {months.map((m) => (
                <option key={m} value={m}>
                  {Number(m)}月
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="total-balance">
          <div className="pie">
            {chartData.length === 0 ? (
              <p className="is-negative">
                支出データがないため、グラフを表示できません。
              </p>
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "300px",
                  borderRadius: "8px",
                  padding: "10px",
                }}
              >
                <ResponsiveContainer
                  key={`${viewMode}-${selectedYear}-${selectedMonth}`}
                >
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }) =>
                        `${name} (${(percent * 100).toFixed(0)}%)`
                      }
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => `${value.toLocaleString()}円`}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
          <div className="balance">
            <div className="total">
              <h2>総収入</h2>
              <p>{totalIncome.toLocaleString()}円</p>
            </div>
            <div className="total">
              <h2>総支出</h2>
              <p>{totalExpense.toLocaleString()}円</p>
            </div>
            <div className="total">
              <h2>現在の残高</h2>
              <p className={totalBalance < 0 ? "is-negative" : ""}>
                {totalBalance.toLocaleString()}円
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Balance;
