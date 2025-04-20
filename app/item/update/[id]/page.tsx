"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import useAuth from "@/app/utils/useAuth";

interface Item {
  title: string;
  price: string;
  image: string;
  description: string;
  email: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

const UpdateItem = () => {
  const [item, setItem] = useState<Item>({
    title: "",
    price: "",
    image: "",
    description: "",
    email: "",
  });

  const loginUserEmail = useAuth();
  const router = useRouter();
  const params = useParams();
  const itemId = params?.id as string;

  useEffect(() => {
    const getSingleItem = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/item/readsingle/${itemId}`
        );
        const jsonData = await response.json();
        const singleItem = jsonData.item;
        setItem({
          title: singleItem.title,
          price: singleItem.price,
          image: singleItem.image,
          description: singleItem.description,
          email: singleItem.email,
        });
      } catch (err) {
        console.error("アイテム取得エラー:", err);
      }
    };

    if (itemId) getSingleItem();
  }, [itemId]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token || !loginUserEmail) {
        alert("ログイン情報が無効です");
        return;
      }

      const response = await fetch(`${BASE_URL}/api/item/update/${itemId}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: item.title,
          price: item.price,
          image: item.image.trim(),
          description: item.description,
          email: loginUserEmail,
        }),
      });

      const jsonData = await response.json();
      alert(jsonData.message);
      router.push("/");
    } catch (err) {
      alert("アイテム編集失敗");
    }
  };

  if (!loginUserEmail) {
    return <p>ログインを確認中...</p>;
  }

  if (loginUserEmail !== item.email) {
    return <h1>権限がありません</h1>;
  }

  return (
    <div>
      <h1 className="page-title">アイテム編集</h1>
      <form onSubmit={handleSubmit}>
        <input
          value={item.title}
          onChange={(e) => setItem({ ...item, title: e.target.value })}
          type="text"
          name="title"
          placeholder="アイテム名"
          required
        />
        <input
          value={item.price}
          onChange={(e) => setItem({ ...item, price: e.target.value })}
          type="text"
          name="price"
          placeholder="価格"
          required
        />
        <input
          value={item.image}
          onChange={(e) => setItem({ ...item, image: e.target.value })}
          type="text"
          name="image"
          placeholder="画像URL"
          required
        />
        <textarea
          value={item.description}
          onChange={(e) => setItem({ ...item, description: e.target.value })}
          name="description"
          rows={15}
          placeholder="商品説明"
          required
        />
        <button type="submit">編集</button>
      </form>
    </div>
  );
};

export default UpdateItem;
