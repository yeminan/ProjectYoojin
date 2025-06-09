import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card, Alert } from "react-bootstrap";
import { useRouter } from "next/router";

export default function LoginPage() {
  const router = useRouter();
  const [id, setId] = useState('');
  const [pwd, setPwd] = useState('');
  const [error, setError] = useState('');
  const ApiUrlKey = process.env.NEXT_PUBLIC_API_BASE_URL;
  const handleLogin = async () => {
    if (!id || !pwd) {
      setError("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      const res = await fetch(`${ApiUrlKey}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ id, pwd }),
      });

      const result = await res.json();

      if (result.success === true) {
        router.push(id === "admin" ? "/admin/dashboard" : "/member/memberRead");
        console.log("🚀 서버 응답 결과:", result);
      } else {
        setError("로그인에 실패했습니다.");
      }
    } catch (err) {
      console.error("서버 연결 실패:", err);
      setError("서버 오류가 발생했습니다.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ background: "linear-gradient(to right, #6a11cb, #2575fc)" }}
    >
      <Row className="w-100 justify-content-center">
        <Col xs={10} sm={8} md={6} lg={4}>
          <Card className="shadow-lg">
            <Card.Body>
              {/* 회사 로고 자리 */}
              <div className="text-center mb-4">
                <div style={{ height: "100px", backgroundColor: "#f0f0f0", borderRadius: "8px" }}>
                  <p className="pt-4 text-muted">[ 회사 로고 자리 ]</p>
                </div>
              </div>

              <h3 className="text-center mb-3">로그인</h3>

              {error && (
                <Alert variant="danger" onClose={() => setError('')} dismissible>
                  {error}
                </Alert>
              )}

              <Form>
                <Form.Group className="mb-3" controlId="formBasicId">
                  <Form.Label>아이디</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="아이디를 입력하세요"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    onKeyDown={handleKeyPress}
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="formBasicPassword">
                  <Form.Label>비밀번호</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="비밀번호를 입력하세요"
                    value={pwd}
                    onChange={(e) => setPwd(e.target.value)}
                    onKeyDown={handleKeyPress}
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button variant="primary" onClick={handleLogin}>
                    로그인
                  </Button>
                </div>

                {/* ✅ 여기 추가 */}
                <div className="text-center mt-3">
                  <span className="text-muted">계정이 없으신가요?</span>{' '}
                  <Button variant="link" onClick={() => router.push("/signup/personal")}>
                    회원가입
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
