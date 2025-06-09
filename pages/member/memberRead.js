import React, { useState } from "react";
import { useRouter } from "next/router";
import {
    Container, Row, Col, Card, Nav, Navbar, NavDropdown, ListGroup, Badge, Form, Button
  } from "react-bootstrap";
  
import {
    PersonFill, EnvelopeFill, TelephoneFill,
    CalendarCheckFill, CpuFill, HospitalFill,
    CalendarEventFill, CalendarXFill, KeyFill
  } from "react-bootstrap-icons";

import HospitalSearchModal from "../components/HospitalSearchModal"; // 모달 import

export default function MemberRead() {

    const router = useRouter();

    const ApiUrlKey = process.env.NEXT_PUBLIC_API_BASE_URL;

    // ✅ 먼저 userInfo 정의
    const userInfo = {
        name: "홍길동",
        email: "hong@test.com",
        phone: "010-1234-5678",
        joinDate: "2024-05-01",
        program: "TnF 통합 분석 툴",
        hospital: "서울바이오병원",
        licenseStatus: "정상",
        licenseStart: "2024-05-01",
        licenseExpire: "2025-05-01",
    };
    const domainOptions = [
        "gmail.com",
        "naver.com",
        "daum.net",
        "nate.com",
        "직접입력"
    ];
    // 회원정보입력란 변수정의 state 정의
    const [email, setEmail] = useState(userInfo.email);
    const [currentPwd, setCurrentPwd] = useState("");
    const [newPwd, setNewPwd] = useState("");
    const [phone, setPhone] = useState(userInfo.phone);
    const [hospital, setHospital] = useState(userInfo.hospital);
    const [showHospitalModal, setShowHospitalModal] = useState(false);
// 이메일인증코드
    const [verificationRequested, setVerificationRequested] = useState(false); // 인증요청 상태
    const [verificationCode, setVerificationCode] = useState(""); // 입력한 인증코드
    const [correctCode] = useState("123456"); // 실제 발송된 코드 (테스트용 고정)
    const [emailVerified, setEmailVerified] = useState(false); // 인증 성공 여부
// 이메일입력란
    const [emailId, setEmailId] = useState(email.split('@')[0]);
    const [emailDomain, setEmailDomain] = useState(email.split('@')[1]);
    const [customDomain, setCustomDomain] = useState('');
    // 모달에서 병원 선택 처리
    // memberRead.js 내에 있어야 함
    const handleHospitalSelect = (selectedHospital) => {
        console.log("선택된 병원:", selectedHospital); // 확인 로그
        setHospital(selectedHospital.yadmNm); // 병원명 필드에 반영
        setShowHospitalModal(false); // 모달 닫기
    };
    const handleLogout = async () => {
    try {
      await fetch(`${ApiUrlKey}/api/users/logout`, {
        method: "POST",
        credentials: "include",
      });
      alert("로그아웃 되었습니다.");
      router.push("/"); // 로그인 페이지로 이동
    } catch (error) {
      console.error("로그아웃 실패:", error);
      alert("로그아웃 중 문제가 발생했습니다.");
    }
  };
    const [activeTab, setActiveTab] = useState("info");
    const paymentHistory = [
        {
        program: "TnF 통합 분석 툴",
        price: "990,000원",
        date: "2024-05-01",
        },
        {
        program: "TnF Pro",
        price: "1,320,000원",
        date: "2025-03-01",
        }
    ];
    const isValidEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };
      
    const handleEmailVerification = () => {
        const finalEmail = `${emailId}@${emailDomain === "직접입력" ? customDomain : emailDomain}`;
        console.log("인증코드 전송:", finalEmail);
      
        setVerificationRequested(true); // 인증 코드 입력창 표시
        setEmailVerified(false);        // 인증 초기화
        alert(`테스트용 인증코드 '123456'을 ${finalEmail} 으로 보냈다고 가정합니다.`);
      };
      
      const handleCodeConfirm = () => {
        if (verificationCode === correctCode) {
          setEmailVerified(true);
          alert("이메일 인증에 성공했습니다!");
        } else {
          setEmailVerified(false);
          alert("인증코드가 올바르지 않습니다.");
        }
    };
      
            
  return (
        <div
        className="d-flex flex-column min-vh-100"
        style={{
            background: "linear-gradient(to right, #c6d4f2, #e2edff)",
            backgroundAttachment: "fixed",
        }}
        >
      {/* 상단 네비게이션 */}
      <Navbar bg="white" expand="lg" className="shadow-sm">
        <Container>
          <Navbar.Brand href="/">MyPage</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Nav>
              <NavDropdown title="홍길동님" id="user-dropdown">
                <NavDropdown.Item href="/member/memberRead">내 정보</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>로그아웃</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* 본문 */}
      <Container className="my-5 flex-grow-1">
        <Row>
          {/* 왼쪽 메뉴 */}
          <Col md={3}>
            <Card className="shadow-sm">
              <Card.Body>
                <h5 className="mb-3">📁 메뉴</h5>
                <Nav className="flex-column">
                  <Nav.Link active={activeTab === "info"} onClick={() => setActiveTab("info")}>👤 내 정보</Nav.Link>
                  <Nav.Link active={activeTab === "payments"} onClick={() => setActiveTab("payments")}>💳 결제 내역</Nav.Link>
                  <Nav.Link active={activeTab === "edit"} onClick={() => setActiveTab("edit")}>✏️ 정보 수정</Nav.Link>
                </Nav>
              </Card.Body>
            </Card>
          </Col>

          {/* 오른쪽 콘텐츠 */}
          <Col md={9}>
            <Card className="shadow-sm">
              <Card.Body>
                {activeTab === "info" && (
                  <>
                    <h4 className="mb-4">👤 내 정보</h4>
                    <ListGroup variant="flush">
                      <ListGroup.Item className="d-flex justify-content-between align-items-center">
                        <span><PersonFill className="me-2 text-primary" />이름</span>
                        <strong>{userInfo.name}</strong>
                      </ListGroup.Item>
                      <ListGroup.Item className="d-flex justify-content-between align-items-center">
                        <span><EnvelopeFill className="me-2 text-success" />이메일</span>
                        <span>{userInfo.email}</span>
                      </ListGroup.Item>
                      <ListGroup.Item className="d-flex justify-content-between align-items-center">
                        <span><TelephoneFill className="me-2 text-warning" />전화번호</span>
                        <span>{userInfo.phone}</span>
                      </ListGroup.Item>
                      <ListGroup.Item className="d-flex justify-content-between align-items-center">
                        <span><CalendarCheckFill className="me-2 text-info" />가입일</span>
                        <span>{userInfo.joinDate}</span>
                      </ListGroup.Item>
                      <ListGroup.Item className="d-flex justify-content-between align-items-center">
                        <span><CpuFill className="me-2 text-primary" />프로그램명</span>
                        <span>{userInfo.program}</span>
                      </ListGroup.Item>

                      <ListGroup.Item className="d-flex justify-content-between align-items-center">
                        <span><HospitalFill className="me-2 text-primary" />소속 병원</span>
                        <span>{userInfo.hospital}</span>
                      </ListGroup.Item>

                      <ListGroup.Item className="d-flex justify-content-between align-items-center">
                        <span><CalendarEventFill className="me-2 text-primary" />라이선스 시작일</span>
                        <span>{userInfo.licenseStart}</span>
                      </ListGroup.Item>

                      <ListGroup.Item className="d-flex justify-content-between align-items-center">
                        <span><CalendarXFill className="me-2 text-danger" />라이선스 만료일</span>
                        <span>{userInfo.licenseExpire}</span>
                      </ListGroup.Item>
                    </ListGroup>
                  </>
                )}

                {activeTab === "payments" && (
                <>
                    <h4 className="mb-4">💳 결제 내역</h4>
                    <Row>
                    {paymentHistory.map((pay, idx) => (
                        <Col md={6} key={idx}>
                        <Card className="mb-3 shadow-sm">
                            <Card.Body>
                            <Card.Title>📦 프로그램명: {pay.program}</Card.Title>
                            <Card.Text>
                                <strong>💰 결제 금액:</strong> {pay.price} <br />
                                <strong>🗓️ 결제일:</strong> {pay.date}
                            </Card.Text>
                            </Card.Body>
                        </Card>
                        </Col>
                    ))}
                    </Row>
                    {paymentHistory.length === 0 && (
                    <p className="text-muted">결제 내역이 없습니다.</p>
                    )}
                </>
                )}
{activeTab === "edit" && (
  <>
    <h4 className="mb-4">✏️ 회원정보 수정</h4>
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        alert("정보가 수정되었습니다! (추후 서버 연동 예정)");
      }}
    >
      {/* 기본 정보 */}
      <Row className="mb-4">
      <Form.Group controlId="formEmail">
  <Form.Label>📧 이메일</Form.Label>
  <Row className="align-items-center mb-2">
    <Col xs={4}>
      <Form.Control
        type="text"
        value={emailId}
        onChange={(e) => {
          setEmailId(e.target.value);
          setEmailVerified(false);
        }}
        placeholder="이메일 아이디"
      />
    </Col>
    <Col xs="auto">@</Col>
    {emailDomain === "직접입력" && (
      <Col xs={4}>
        <Form.Control
          type="text"
          value={customDomain}
          onChange={(e) => {
            setCustomDomain(e.target.value);
            setEmailVerified(false);
          }}
          placeholder="도메인 입력"
        />
      </Col>
    )}
    <Col xs={emailDomain === "직접입력" ? 3 : 5}>
      <Form.Select
        value={emailDomain}
        onChange={(e) => {
          setEmailDomain(e.target.value);
          setEmailVerified(false);
        }}
      >
        {domainOptions.map((domain, idx) => (
          <option key={idx} value={domain}>
            {domain}
          </option>
        ))}
      </Form.Select>
    </Col>
    <Col xs="auto">
      <Button
        variant="outline-secondary"
        size="sm"
        onClick={handleEmailVerification}
        disabled={!isValidEmail(`${emailId}@${emailDomain === "직접입력" ? customDomain : emailDomain}`)}
      >
        인증하기
      </Button>
    </Col>
  </Row>

  {/* 인증 코드 입력 및 확인 */}
  {verificationRequested && (
    <Row className="align-items-center mt-2">
      <Col xs={6}>
        <Form.Control
          type="text"
          placeholder="인증코드 입력"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
        />
      </Col>
      <Col xs="auto">
        <Button variant="success" size="sm" onClick={handleCodeConfirm}>
          인증 확인
        </Button>
      </Col>
    </Row>
  )}

  {/* 인증 완료 메시지 */}
  {emailVerified && (
    <div className="text-success mt-2 fw-semibold">✅ 이메일 인증 완료</div>
  )}
</Form.Group>



        <Col md={6}>
          <Form.Group controlId="formPhone">
            <Form.Label>📞 전화번호</Form.Label>
            <Form.Control
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="예: 010-1234-5678"
            />
          </Form.Group>
        </Col>
      </Row>

      {/* 비밀번호 변경 */}
      <h5 className="mt-4 mb-3">🔐 비밀번호 변경</h5>
      <Row className="mb-4">
        <Col md={6}>
          <Form.Group controlId="formCurrentPwd">
            <Form.Label>현재 비밀번호</Form.Label>
            <Form.Control
              type="password"
              value={currentPwd}
              onChange={(e) => setCurrentPwd(e.target.value)}
              placeholder="현재 비밀번호 입력"
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="formNewPwd">
            <Form.Label>새 비밀번호</Form.Label>
            <Form.Control
              type="password"
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
              placeholder="새 비밀번호 입력"
            />
          </Form.Group>
        </Col>
      </Row>

      {/* 병원 검색 */}
      <h5 className="mt-4 mb-3">🏥 소속 병원</h5>
      <Row className="mb-4">
        <Col md={12}>
          <Form.Group controlId="formHospital">
            <div className="d-flex align-items-center">
                <Form.Control
                    type="text"
                    value={hospital}
                    readOnly
                    className="me-2"
                    placeholder="병원명을 검색하여 선택하세요"
                />
                <Button
                    variant="outline-primary"
                    onClick={() => setShowHospitalModal(true)}
                    style={{ whiteSpace: "nowrap" }}
                >
                    병원 검색
                </Button>
            </div>
          </Form.Group>
        </Col>
      </Row>

      <div className="text-end">
        <Button variant="primary" type="submit">
          💾 저장
        </Button>
      </div>
    </Form>

    {/* 병원 검색 모달 */}
    <HospitalSearchModal
      show={showHospitalModal}
      onHide={() => setShowHospitalModal(false)}
      onSelect={handleHospitalSelect}
    />
  </>
)}


              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* 푸터 */}
      <footer className="bg-white text-center py-4 border-top mt-auto">
        <div>ⓒ 2025 YOOJINBIOSOFT. All rights reserved.</div>
        <div>Contact: info@yoojinbio.com</div>
      </footer>
    </div>
  );
}
