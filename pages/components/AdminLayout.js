import React, { useState,useEffect } from "react";
import { Container, Row, Col, Nav, Button } from "react-bootstrap";
import { useRouter } from "next/router";
export default function AdminLayout({ children }) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리
  const [dashboardOpen, setDashboardOpen] = useState(false); // 대시보드 하위 메뉴 토글
  const [usersOpen, setUsersOpen] = useState(false); // 사용자 관리 하위 메뉴 토글
  const [settingsOpen, setSettingsOpen] = useState(false); // 프로그램 관리 하위 메뉴 토글
  const [setpaysOpen, setPaysOpen] = useState(false); // 프로그램 관리 하위 메뉴 토글
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const ApiUrlKey = process.env.NEXT_PUBLIC_API_BASE_URL;
useEffect(() => {
  fetch(`${ApiUrlKey}/api/users/check-auth`, {
    method: "GET",
    credentials: "include",
  })
    .then((res) => {
      if (!res.ok) throw new Error("Unauthorized");
      return res.json();
    })
    .then((data) => {
      if (!data.loggedIn) {
        router.push("/");
      } else {
        setIsLoggedIn(true); // ✅ 로그인된 상태 반영
      }
    })
    .catch(() => {
      setIsLoggedIn(false);
      router.push("/");
    })
    .finally(() => {
      setIsCheckingAuth(false);
    });
}, []);


  // 로그인 버튼 클릭 시 로그인 페이지로 이동
  const handleLogin = () => {
    router.push("/");
  };

  // 로그아웃 버튼 클릭 시 상태 변경
  const handleLogout = async () => {
    await fetch(`${ApiUrlKey}/api/users/logout`, {
      method: "POST",
      credentials: "include",
    });

    setIsLoggedIn(false);
    alert("로그아웃 되었습니다.");
    router.push("/");
  };

  // 회원가입 페이지 이동
  const handleSignup = () => {
    router.push("/signup/personal");
  };

  return (
    <Container fluid>
      <Row>
        {/* 사이드바 */}
        <Col md={2} className="bg-dark text-white min-vh-100 p-3">
          <h4 className="text-center">관리자</h4>
          <Nav defaultActiveKey="/admin/dashboard" className="flex-column">
            {/* 대시보드 (하위 메뉴) */}
            <Nav.Link
              className="text-white"
              onClick={() => setDashboardOpen(!dashboardOpen)}
              style={{ cursor: "pointer" }}
            >
              📊 대시보드 {dashboardOpen ? "▲" : "▼"}
            </Nav.Link>
            {dashboardOpen && (
              <div className="ms-3">
                <Nav.Link href="/admin/dashboard" className="text-white">📈 대시보드 홈</Nav.Link>
              </div>
            )}

            {/* 사용자 관리 (하위 메뉴) */}
            <Nav.Link
              className="text-white"
              onClick={() => setUsersOpen(!usersOpen)}
              style={{ cursor: "pointer" }}
            >
              👥 사용자 관리 {usersOpen ? "▲" : "▼"}
            </Nav.Link>
            {usersOpen && (
              <div className="ms-3">
                <Nav.Link href="/admin/users" className="text-white">👤 사용자 목록</Nav.Link>
                <Nav.Link href="/admin/Institutions" className="text-white">🏫 기관 목록</Nav.Link>
                {/* <Nav.Link href="/admin/users/add" className="text-white">➕ 새 사용자 추가</Nav.Link> */}
              </div>
            )}

            {/* 프로그램 관리 (하위 메뉴) */}
            <Nav.Link
              className="text-white"
              onClick={() => setSettingsOpen(!settingsOpen)}
              style={{ cursor: "pointer" }}
            >
              ⚙️ 프로그램 관리 {settingsOpen ? "▲" : "▼"}
            </Nav.Link>
            {settingsOpen && (
              <div className="ms-3">
                {/* <Nav.Link href="/admin/program" className="text-white">📂 프로그램 목록</Nav.Link> */}
                <Nav.Link href="/admin/program/active" className="text-white">🟢 현재 사용 중</Nav.Link>
                <Nav.Link href="/admin/program/trial" className="text-white">🧪 체험판 사용자</Nav.Link>
                <Nav.Link href="/admin/program/expiring" className="text-white">⌛ 만료 예정 목록</Nav.Link>
                <Nav.Link href="/admin/program/expired" className="text-white">❌ 만료된 목록</Nav.Link>
              </div>
            )}


            {/* 프로그램 관리 (하위 메뉴) */}
            <Nav.Link
              className="text-white"
              onClick={() => setPaysOpen(!setpaysOpen)}
              style={{ cursor: "pointer" }}
            >
              💳 결제내역 관리 {setpaysOpen ? "▲" : "▼"}
            </Nav.Link>
            {setpaysOpen && (
              <div className="ms-3">
                <Nav.Link href="/admin/payments" className="text-white">💰 결제내역</Nav.Link>
              </div>
            )}
          </Nav>
        </Col>

        {/* 메인 컨텐츠 영역 */}
        <Col md={10} className="p-4">
          {/* 상단 네비게이션 바 */}
          <div className="d-flex justify-content-between align-items-center p-3 mb-3 rounded" style={{ backgroundColor: "#f8f9fa", boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)" }}>
            {/* 라이선스 관리 */}
            <Nav.Link href="/admin/licenses" className="text-dark fw-bold fs-5">🔑 라이선스 관리</Nav.Link>

            {/* 회원가입 / 로그인 / 로그아웃 버튼 */}
            <div>
              {!isLoggedIn ? (
                <>
                  <Button variant="primary" className="me-2" onClick={handleSignup}>회원가입</Button>
                  <Button variant="success" onClick={handleLogin}>로그인</Button>
                </>
              ) : (
                <Button variant="danger" onClick={handleLogout}>로그아웃</Button>
              )}
            </div>
          </div>

          {/* 본문 컨텐츠 */}
          {children}
        </Col>
      </Row>
      
    </Container>
  );
  
}
