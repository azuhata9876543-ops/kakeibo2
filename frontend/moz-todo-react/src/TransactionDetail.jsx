{
  /*詳細クラス*/
}
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DialogButton } from "./DialogButton";

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

function TransactionDetail({ list, onUpdate, onDelete }) {
  const { id } = useParams();
  const transactionId = Number(id);

  const transaction = list.find((l) => l.id === transactionId);

  const navigate = useNavigate();

  const [errors, setErrors] = useState({
    date: "",
    amount: "",
    category: "",
    item: "",
    memo: "",
  });

  const [isEdit, setIsEdit] = useState(null);
  const [editForm, setEditForm] = useState(() => {
    if (!transaction) return {};
    return {
      id: transaction.id,
      date: transaction.date,
      categoryType: transaction.category
        ? transaction.category.type
        : "EXPENSE",
      amount: transaction.amount,
      category: transaction.category ? transaction.category.category : "",
      item: transaction.item || "",
      memo: transaction.memo,
    };
  });

  if (!transaction) {
    return (
      <div className="negative">
        <p className="is-negative">該当するデータが見つかりませんでした。</p>
        <button onClick={() => navigate("/list")}>リストに戻る</button>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (type) => {
    const defaultCategory = CATEGORYNAME[type][0];

    setEditForm((prev) => ({
      ...prev,
      categoryType: type,
      category: defaultCategory,
    }));
  };

  const handleCancel = (fieldName) => {
    setErrors((prev) => ({ ...prev, [fieldName]: "" }));

    if (transaction) {
      setEditForm({
        id: transaction.id,
        date: transaction.date,
        categoryType: transaction.category
          ? transaction.category.type
          : "EXPENSE",
        amount: transaction.amount,
        category: transaction.category ? transaction.category.category : "",
        item: transaction.item || "",
        memo: transaction.memo,
      });
    }
    setIsEdit(null);
  };

  const handleSave = () => {
    if (!onUpdate) return;

    let hasError = false;
    const newErrors = {
      date: "",
      amount: "",
      category: "",
      item: "",
      memo: "",
    };

    if (!editForm.date) {
      newErrors.date = "日付を入力してください。";
      hasError = true;
    }
    if (!editForm.amount || Number(editForm.amount) <= 0) {
      newErrors.amount = "金額は１円以上を入力してください。";
      hasError = true;
    }
    if (!editForm.category || editForm.category === "未入力") {
      newErrors.category = "カテゴリを選択してください。";
      hasError = true;
    }
    if (editForm.item && editForm.item.length > 20) {
      newErrors.item = "品目は20字以内で入力してください。";
      hasError = true;
    }
    if (editForm.memo && editForm.memo.length > 40) {
      newErrors.memo = "メモは40字以内で入力してください。";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    setErrors({ date: "", amount: "", category: "", item: "", memo: "" });

    const selectedId = categoryMap[editForm.category] || null;
    const updateData = {
      id: editForm.id,
      date: editForm.date,
      memo: editForm.memo,
      item: editForm.item,
      amount: Number(editForm.amount),
      category: selectedId
        ? {
            id: selectedId,
            type: editForm.categoryType,
            category: editForm.category,
          }
        : null,
      categoryName: editForm.category,
      categoryType: editForm.categoryType,
    };

    onUpdate(updateData);

    setEditForm({
      ...editForm,
      amount: Number(editForm.amount),
    });

    setIsEdit(null);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(transaction.id);
    }
    navigate("/list");
  };

  const renderRow = (label, fieldName, type = "text") => {
    const isFieldEdit = isEdit === fieldName;

    const hasAnyError = Object.values(errors).some((error) => error !== "");

    let displayValue = editForm[fieldName];
    if (fieldName === "categoryType") {
      displayValue = editForm.categoryType === "INCOME" ? "収入" : "支出";
    }
    if (fieldName === "category") {
      displayValue = editForm.category ? editForm.category : "未入力";
    }

    if (fieldName === "item") {
      displayValue = editForm.item || "未入力";
    }

    return (
      <div className="detail-row">
        {isFieldEdit && errors[fieldName] && (
          <p className="is-negative"> {errors[fieldName]} </p>
        )}
        <div className="row-upper">
          <strong>{label}</strong>
          {isFieldEdit ? (
            fieldName === "categoryType" ? (
              <div className="type">
                <button
                  type="button"
                  className={`small-btn income ${editForm.categoryType === "INCOME" ? "active" : ""}`}
                  onClick={() => handleTypeChange("INCOME")}
                >
                  収入
                </button>
                <button
                  type="button"
                  className={`small-btn expense ${editForm.categoryType === "EXPENSE" ? "active" : ""}`}
                  onClick={() => handleTypeChange("EXPENSE")}
                >
                  支出
                </button>
              </div>
            ) : fieldName === "category" ? (
              <select
                name="category"
                value={editForm.category || ""}
                onChange={handleChange}
              >
                <option value="">カテゴリを選択してください</option>
                {CATEGORYNAME[editForm.categoryType].map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={type}
                name={fieldName}
                value={editForm[fieldName] || ""}
                onChange={handleChange}
              />
            )
          ) : (
            <div className="text-wrap">
              {displayValue}
              {fieldName === "amount" ? "円" : ""}
            </div>
          )}

          {isFieldEdit ? (
            <div className="row-lower">
              <button className="small-btn keep" onClick={() => handleSave()}>
                保存
              </button>
              <button
                className="small-btn"
                onClick={() => handleCancel(fieldName)}
                disabled={hasAnyError}
              >
                戻る
              </button>
            </div>
          ) : (
            <button
              className="small-btn lis"
              onClick={() => setIsEdit(fieldName)}
              disabled={isEdit !== null}
            >
              編集
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="card">
      <div className="detail">
        {renderRow("日付", "date", "date")}
        {renderRow("収支", "categoryType")}
        {renderRow("金額", "amount", "number")}
        {renderRow("カテゴリ", "category")}
        {renderRow("品目", "item")}
        {renderRow("メモ", "memo")}
        <DialogButton
          buttonText="削除"
          dialogTitle="本当に削除しますか？"
          onConfirm={handleDelete}
          className="btn delete"
        />
      </div>
    </div>
  );
}

export default TransactionDetail;
