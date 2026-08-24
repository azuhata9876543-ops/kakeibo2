{
  /*登録クラス*/
}
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CATEGORY_MASTER = [
  { id: 1, type: "INCOME", name: "給与" },
  { id: 2, type: "INCOME", name: "副収入" },
  { id: 3, type: "EXPENSE", name: "固定費" },
  { id: 4, type: "EXPENSE", name: "食費" },
  { id: 5, type: "EXPENSE", name: "日用品" },
  { id: 6, type: "EXPENSE", name: "医療" },
  { id: 7, type: "EXPENSE", name: "装飾" },
  { id: 8, type: "EXPENSE", name: "車" },
  { id: 9, type: "EXPENSE", name: "特別費" },
  { id: 10, type: "EXPENSE", name: "その他" },
];

const CATEGORYNAME = {
  INCOME: CATEGORY_MASTER.filter((c) => c.type === "INCOME").map((c) => c.name),
  EXPENSE: CATEGORY_MASTER.filter((c) => c.type === "EXPENSE").map(
    (c) => c.name,
  ),
};

const categoryMap = CATEGORY_MASTER.reduce((map, item) => {
  map[item.name] = item.id;
  return map;
}, {});

function TransactionForm({ onCreated }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    date: "",
    categoryType: "EXPENSE",
    amount: "",
    category: "",
    item: "",
    memo: "",
  });

  const [errors, setErrors] = useState({
    date: "",
    amount: "",
    category: "",
    item: "",
    memo: "",
  });

  const updateForm = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTypeChange = (type) => {
    setForm((prev) => ({
      ...prev,
      categoryType: type,
      category: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedId = categoryMap[form.category] || null;

    let hasError = false;
    const newError = {
      date: "",
      amount: "",
      category: "",
      item: "",
      memo: "",
    };

    if (!form.date) {
      newError.date = "日付を入力してください。";
      hasError = true;
    }

    if (!form.amount || Number(form.amount) <= 0) {
      newError.amount = "金額は1円以上を入力してください。";
      hasError = true;
    }

    if (!form.category || form.category === "未入力") {
      newError.category = "カテゴリを選択してください。";
      hasError = true;
    }

    if (form.item && form.item.length > 20) {
      newError.item = "品目は20字以内で入力してください。";
      hasError = true;
    }

    if (form.memo && form.memo.length > 40) {
      newError.memo = "メモは40字以内で入力してください。";
      hasError = true;
    }

    if (hasError) {
      setErrors(newError);
      return;
    }

    setErrors({ date: "", amount: "", category: "", item: "", memo: "" });

    const newTransaction = {
      date: form.date,
      amount: Number(form.amount),
      memo: form.memo,
      item: form.item,
      category: selectedId ? { id: selectedId } : null,
      categoryName: form.category,
      categoryType: form.categoryType,
    };

    if (typeof onCreated === "function") {
      onCreated(newTransaction, navigate);
    }
    setForm({
      date: "",
      categoryType: "EXPENSE",
      amount: "",
      category: "",
      item: "",
      memo: "",
    });
  };

  return (
    <div className="card">
      <form className="form" onSubmit={handleSubmit}>
        <div className="left">
          {errors.date && <p className="is-negative">{errors.date}</p>}
          <label>
            日付
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={updateForm}
              className={form.date ? "has-value" : "is-empty"}
            />
          </label>

          <label>
            収支
            <div className="type-buttons">
              <button
                type="button"
                className={`btn income ${form.categoryType === "INCOME" ? "active" : ""}`}
                onClick={() => handleTypeChange("INCOME")}
              >
                収入
              </button>
              <button
                type="button"
                className={`btn expense ${form.categoryType === "EXPENSE" ? "active" : ""}`}
                onClick={() => handleTypeChange("EXPENSE")}
              >
                支出
              </button>
            </div>
          </label>

          {errors.category && <p className="is-negative">{errors.category}</p>}
          <label>
            カテゴリ
            <select
              name="category"
              value={form.category}
              onChange={updateForm}
              className={form.category ? "has-value" : ""}
            >
              <option value="">カテゴリを選択してください</option>
              {CATEGORYNAME[form.categoryType].map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="right">
          {errors.amount && <p className="is-negative">{errors.amount}</p>}
          <label>
            金額入力
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={updateForm}
              placeholder="金額を入力してください"
            />
          </label>

          {errors.item && <p className="is-negative">{errors.item}</p>}
          <label>
            品目
            <input
              type="text"
              name="item"
              value={form.item}
              onChange={updateForm}
              placeholder="品目を入力してください"
            />
          </label>

          {errors.memo && <p className="is-negative">{errors.memo}</p>}
          <label>
            メモ
            <input
              type="text"
              name="memo"
              value={form.memo}
              onChange={updateForm}
              placeholder="メモを入力してください"
            />
          </label>
        </div>

        <button className="btn submit" type="submit">
          登録
        </button>
      </form>
    </div>
  );
}
export default TransactionForm;
