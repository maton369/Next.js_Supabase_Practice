import Image from "next/image";
import Link from "next/link";

// 型定義
interface Item {
  id: string;
  title: string;
  image: string;
  price: string;
  description: string;
}

// 環境変数からベースURLを取得
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

// データ取得関数
const getSingleItem = async (id: string): Promise<Item | null> => {
  try {
    const response = await fetch(`${BASE_URL}/api/item/readsingle/${id}`, {
      cache: "no-store",
    });
    const jsonData = await response.json();
    return jsonData.item ?? null;
  } catch (err) {
    console.error("アイテム取得エラー:", err);
    return null;
  }
};

// ページコンポーネント
const ReadSingleItem = async ({ params }: any) => {
  const singleItem = await getSingleItem(params.id);

  if (!singleItem) {
    return (
      <div>
        <h2>アイテムが見つかりませんでした。</h2>
      </div>
    );
  }

  return (
    <div className="grid-container-si">
      <div>
        <Image
          src={singleItem.image.trim()}
          width={750}
          height={500}
          alt="item-image"
          priority
        />
      </div>
      <div>
        <h1>{singleItem.title}</h1>
        <h2>¥{singleItem.price}</h2>
        <hr />
        <p>{singleItem.description}</p>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Link href={`/item/update/${singleItem.id}`}>アイテム編集</Link>
          <Link href={`/item/delete/${singleItem.id}`}>アイテム削除</Link>
        </div>
      </div>
    </div>
  );
};

export default ReadSingleItem;
