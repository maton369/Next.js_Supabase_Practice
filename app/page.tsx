import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

// アイテム型定義
interface Item {
  id: string;
  title: string;
  image: string;
  price: string;
  description: string;
}

// APIからアイテム一覧を取得
const getAllItems = async (): Promise<Item[]> => {
  const response = await fetch("http://localhost:3000/api/item/readall", {
    cache: "no-store",
  });
  const jsonData = await response.json();
  return jsonData.allItems as Item[];
};

const ReadAllItems = async () => {
  const allItems = await getAllItems();

  return (
    <div className="grid-container-in">
      {allItems.map((item) => (
        <Link href={`/item/readsingle/${item.id}`} key={item.id}>
          <div>
            <Image
              src={item.image.trim()}
              width={750}
              height={500}
              alt="item-image"
              priority
            />
            <div>
              <h2>¥{item.price}</h2>
              <h3>{item.title}</h3>
              <p>{item.description?.substring(0, 80)}...</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ReadAllItems;
