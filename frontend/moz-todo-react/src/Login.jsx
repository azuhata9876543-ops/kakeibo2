import { useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";
const API_URL = `${BASE_URL}/api/auth/login`;

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [credentials, setCredentials] = useState({
    id: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    //パスワード設定できるようになったら消す
    setLoginError(false);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (res.ok) {
        localStorage.setItem("userId", credentials.id);
        navigate("/top");
      } else {
        setLoginError(true);
      }
    } catch (err) {
      console.error(err);
      setLoginError(true);
    }
  };

  return (
    <div className="card">
      <div className="login-form">
        <h1>家計簿</h1>
        <form onSubmit={handleLoginSubmit}>
          {loginError && (
            <p className="is-negative">
              ログインに失敗しました。
              <br />
              IDまたはパスワードが正しくありません。
            </p>
          )}

          <label>
            ユーザー名
            <input
              type="text"
              name="id"
              value={credentials.id}
              onChange={handleChange}
              placeholder="ログインIDを入力してください"
            />
          </label>

          <label>
            パスワード
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={credentials.password}
              onChange={handleChange}
              placeholder="パスワードを入力してください"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "非表示" : "表示"}
            </button>
          </label>

          <button className="btn login" type="submit">
            ログイン
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
