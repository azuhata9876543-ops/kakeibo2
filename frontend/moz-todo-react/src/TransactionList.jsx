{
  /*リストクラス*/
}
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function TransactionList({ list = [] }) {
  const navigate = useNavigate();

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
      const targetYearMonth = `${selectedYear}-${selectedMonth}`;
      return item.date.startsWith(targetYearMonth);
    }

    if (viewMode === "YEAR") {
      return item.date.startsWith(selectedYear);
    }

    return true;
  });

  const sortedList = [...filteredList].sort((a, b) => {
    return b.date.localeCompare(a.date);
  });

  //データが一件もなとき表示
  if (list.length === 0) {
    return (
      <div className="card">
        <div className="negative">
          <p className="is-negative">登録されたデータがありません。</p>
          <button
            className="btn entry"
            onClick={() => navigate("/registration")}
          >
            データを登録する
          </button>
        </div>
      </div>
    );
  }

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

        <div className="month-selector" style={{ marginBottom: "15px" }}>
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

        <div className="list">
          <table>
            <thead>
              <tr>
                <th>日付</th>
                <th>収支</th>
                <th>金額</th>
                <th>カテゴリ</th>
                <th>品目</th>
                <th>メモ</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sortedList.length === 0 ? (
                <tr>
                  <td colSpan="7" className="is-negative">
                    選択された月のデータがありません。
                  </td>
                </tr>
              ) : (
                sortedList.map((l, index) => (
                  <tr
                    key={l.id || `tx-${index}`}
                    className={
                      l.category && l.category.type === "EXPENSE"
                        ? "expense-row"
                        : ""
                    }
                  >
                    <td>{l.date}</td>
                    <td>
                      {l.category
                        ? l.category.type === "INCOME"
                          ? "収入"
                          : "支出"
                        : ""}
                    </td>
                    <td>{Number(l.amount).toLocaleString()}円</td>
                    <td>{l.category ? l.category.category : "未分類"}</td>
                    <td className="cell-wrap">{l.item}</td>
                    <td className="cell-wrap">{l.memo}</td>
                    <td>
                      <button
                        className="small-btn lis"
                        type="button"
                        onClick={() => navigate(`/detail/${l.id}`)}
                      >
                        詳細
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TransactionList;
