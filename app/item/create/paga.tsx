"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/app/utils/useAuth";

const CreateItem = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");

  const router = useRouter();
  const loginUserEmail = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (!token || !loginUserEmail) {
        alert("ログイン情報が見つかりません。再度ログインしてください。");
        return;
      }

      const response = await fetch("http://localhost:3000/api/item/create", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          price,
          image: image.trim(),
          description,
          email: loginUserEmail,
        }),
      });

      const jsonData = await response.json();

      if (!response.ok) {
        throw new Error(jsonData.message || "作成に失敗しました");
      }

      alert(jsonData.message);
      router.push("/");
    } catch (err: any) {
      alert(err.message || "アイテム作成失敗");
    }
  };

  if (!loginUserEmail) {
    return <p>読み込み中またはログインが必要です...</p>;
  }

  return (
    <div>
      <h1 className="page-title">アイテム作成</h1>
      <form onSubmit={handleSubmit}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          name="title"
          placeholder="アイテム名"
          required
        />
        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          type="text"
          name="price"
          placeholder="価格"
          required
        />
        <input
          value={image}
          onChange={(e) => setImage(e.target.value)}
          type="text"
          name="image"
          placeholder="画像URL"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          name="description"
          rows={15}
          placeholder="商品説明"
          required
        ></textarea>
        <button type="submit">作成</button>
      </form>
    </div>
  );
};

export default CreateItem;
