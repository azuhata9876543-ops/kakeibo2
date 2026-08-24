import { Link, useLocation, useNavigate } from "react-router-dom";
import { DialogButton } from "./DialogButton";

const PAGE_CONFIG = {
  "/top": {
    title: "トップページ",
    links: [
      { to: "/list", label: "リスト" },
      { to: "/registration", label: "登録" },
    ],
  },
  "/list": {
    title: "リスト",
    links: [
      { to: "/top", label: "トップページ" },
      { to: "/registration", label: "登録" },
    ],
  },
  "/registration": {
    title: "登録",
    links: [
      { to: "/top", label: "トップページ" },
      { to: "/list", label: "リスト" },
    ],
  },
  "/detail": {
    title: "詳細画面",
    links: [
      { to: "/top", label: "トップページ" },
      { to: "/list", label: "リスト" },
    ],
  },
};

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/", { replace: true });
  };

  const currentPath = location.pathname.startsWith("/detail")
    ? "/detail"
    : location.pathname;
  const config = PAGE_CONFIG[currentPath];

  const pageTitle = config ? config.title : "ログイン";
  const pageLink = config ? (
    <>
      <DialogButton
        buttonText="ログアウト"
        dialogTitle="本当にログアウトしますか？"
        onConfirm={handleLogout}
        className="btn logout"
      />
      {config.links.map((link) => (
        <Link key={link.to} to={link.to} className="btn link">
          {link.label}
        </Link>
      ))}
    </>
  ) : null;

  return (
    <header>
      <h2>{pageTitle}</h2>
      {pageLink}
    </header>
  );
}

export default Header;
