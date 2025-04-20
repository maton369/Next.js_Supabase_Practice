import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtVerify } from "jose";

const useAuth = (): string => {
  const [loginUserEmail, setLoginUserEmail] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/user/login");
        return;
      }

      try {
        const secretKey = new TextEncoder().encode(
          "next-market-route-handlers"
        );
        const decodedJwt = await jwtVerify(token, secretKey);

        const email = decodedJwt.payload.email;
        if (typeof email === "string") {
          setLoginUserEmail(email);
        } else {
          throw new Error("不正なトークン");
        }
      } catch (err) {
        localStorage.removeItem("token"); // 不正なトークンは削除
        router.push("/user/login");
      }
    };

    checkToken();
  }, []); // ← `router` は参照のみのため依存配列不要

  return loginUserEmail;
};

export default useAuth;
