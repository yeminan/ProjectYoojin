"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const ApiUrlKey = process.env.NEXT_PUBLIC_API_BASE_URL;
  useEffect(() => {
    if (token) {
      fetch(`${ApiUrlKey}/api/users/verify?token=${token}`)
        .then((res) => {
          if (res.ok) {
            alert("✅ 이메일 인증이 완료되었습니다.");
            window.close(); // 창 닫기
          } else {
            alert("❌ 인증에 실패했거나 토큰이 만료되었습니다.");
            window.close(); // 실패해도 창 닫기
          }
        })
        .catch(() => {
          alert("❌ 인증 요청 중 오류가 발생했습니다.");
          window.close(); // 에러 시도 창 닫기
        });
    }
  }, [token]);

  return null;
}
