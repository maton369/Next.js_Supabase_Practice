import Image from "next/image";
import Link from "next/link";

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <Link href="/">
          <Image
            src="/header.svg"
            width={1330}
            height={148}
            alt="サイトのロゴ画像"
            priority
          />
        </Link>
      </div>
      <nav className="nav">
        <ul className="nav-list">
          <li>
            <Link href="/user/register">登録</Link>
          </li>
          <li>
            <Link href="/user/login">ログイン</Link>
          </li>
          <li>
            <Link href="/item/create">アイテム作成</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
