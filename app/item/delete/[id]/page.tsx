"use client";

import { useState, useEffect, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import useAuth from "@/app/utils/useAuth";

// 環境変数からAPIのベースURLを取得
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

interface Item {
  title: string;
  price: string;
  image: string;
  description: string;
  email: string;
}

const DeleteItem = () => {
  const [item, setItem] = useState<Item>({
    title: "",
    price: "",
    image: "",
    description: "",
    email: "",
  });

  const router = useRouter();
  const params = useParams();
  const itemId = params?.id as string;
  const loginUserEmail = useAuth();

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
      } catch (error) {
        console.error("アイテム取得失敗:", error);
      }
    };

    if (itemId) getSingleItem();
  }, [itemId]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token || !loginUserEmail) {
        alert("認証情報が不正です");
        return;
      }

      const response = await fetch(`${BASE_URL}/api/item/delete/${itemId}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: loginUserEmail }),
      });

      const jsonData = await response.json();
      alert(jsonData.message);
      router.push("/");
    } catch (err) {
      console.error("削除エラー:", err);
      alert("アイテム削除失敗");
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
      <h1 className="page-title">アイテム削除</h1>
      <form onSubmit={handleSubmit}>
        <h2>{item.title}</h2>
        <Image
          src={item.image.trim()}
          width={750}
          height={500}
          alt="item-image"
          priority
        />
        <h3>¥{item.price}</h3>
        <p>{item.description}</p>
        <button>削除</button>
      </form>
    </div>
  );
};

export default DeleteItem;
