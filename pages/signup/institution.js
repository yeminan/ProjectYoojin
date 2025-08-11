import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Form, Button, Modal, Container, Card } from "react-bootstrap";

export default function PersonalSignup() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [emailVerifyRequested, setEmailVerifyRequested] = useState(false);
  const [emailVerifyExpired, setEmailVerifyExpired] = useState(false);
  const [timer, setTimer] = useState(0);

  const [formData, setFormData] = useState({
    loginId: "",
    password: "",
    confirmPassword: "",
    name: "",
    emailPrefix: "",
    emailDomain: "",
    emailDomainType: "",
    hospital: "",
    phone : "",
  });

  const [showHospitalModal, setShowHospitalModal] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  // api 키
  const ApiUrlKey = process.env.NEXT_PUBLIC_API_BASE_URL;
  useEffect(() => {
    const verified = localStorage.getItem("emailVerified");
    if (verified === "true") {
      setIsEmailVerified(true);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetch(`${ApiUrlKey}/api/users/verify?token=${token}`)
        .then((res) => {
          if (res.ok) {
            alert("✅ 이메일 인증이 완료되었습니다.");
            setIsEmailVerified(true);
          } else {
            alert("❌ 인증에 실패했거나 토큰이 만료되었습니다.");
          }
        })
        .catch(() => {
          alert("❌ 인증 요청 중 오류가 발생했습니다.");
        });
    }
  }, [token]);

  const checkEmailVerified = async () => {
    const fullEmail = `${formData.emailPrefix}@${formData.emailDomain}`;
    const res = await fetch(`${ApiUrlKey}/api/users/verify-status?email=${fullEmail}`);
    const isVerified = await res.json();
    setIsEmailVerified(isVerified);

    alert(isVerified ? "이메일 인증이 완료되었습니다." : "아직 인증이 완료되지 않았습니다.");
  };

  const handleEmailVerificationRequest = async () => {
    const fullEmail = `${formData.emailPrefix}@${formData.emailDomain}`;

    try {
      // 인증 상태 확인
      const verifyRes = await fetch(`${ApiUrlKey}/api/users/verify-status?email=${fullEmail}`);
      const isAlreadyVerified = await verifyRes.json();

      if (isAlreadyVerified) {
        alert("이미 인증이 완료된 이메일입니다.");
        return;
      }

      // 인증 메일 전송
      const res = await fetch(`${ApiUrlKey}/api/users/send-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email: fullEmail }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ 응답 실패 내용:", errorText);
        throw new Error();
      }

      alert("인증 메일을 전송했습니다. 이메일을 확인해주세요.");
      setEmailVerifyRequested(true);
      setEmailVerifyExpired(false);
      setTimer(180);

      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setEmailVerifyRequested(false);
            setEmailVerifyExpired(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch {
      alert("인증 메일 전송 실패");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleHospitalSearch = () => {
    setShowHospitalModal(true);
  };

  const selectHospital = (hospitalName) => {
    setFormData({ ...formData, hospital: hospitalName });
    setShowHospitalModal(false);
  };

  const handleSignup = async () => {
    const {
      loginId,
      password,
      confirmPassword,
      name,
      emailPrefix,
      emailDomain,
      hospital,
      phone,
    } = formData;

    if (!loginId || !password || !confirmPassword || !name || !emailPrefix || !emailDomain || !hospital || !phone) {
      alert("입력값을 모두 채워주세요.");
      return;
    }

    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    const fullEmail = `${emailPrefix}@${emailDomain}`;
    try {
      setIsSubmitting(true);

      const res = await fetch(`${ApiUrlKey}/api/users/email?email=${fullEmail}`);
      const exists = await res.json();

      if (exists) {
        alert("이미 등록된 이메일입니다.");
        return;
      }

      const dataToSend = {
        loginId,
        name,
        email: fullEmail,
        org: hospital,
        pwd: password,
        phone: phone,
      };

      const saveRes = await fetch(`${ApiUrlKey}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (!saveRes.ok) throw new Error();
      window.location.href = "/";
    } catch (err) {
      alert("가입 실패 또는 서버 오류");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container fluid className="d-flex justify-content-center align-items-center vh-100" style={{ background: "linear-gradient(to right,rgb(125, 186, 255),rgb(84, 147, 255))" }}>
      <Card style={{ width: "40rem", padding: "2rem", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", backgroundColor: "#fff" }}>
        <h2 className="text-center mb-4">기관 회원가입</h2>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>아이디</Form.Label>
            <Form.Control type="text" name="loginId" value={formData.loginId} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>비밀번호</Form.Label>
            <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>비밀번호 확인</Form.Label>
            <Form.Control type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
            {formData.confirmPassword && (
              <div className={`mt-1 small fw-semibold ${formData.password === formData.confirmPassword ? "text-success" : "text-danger"}`}>
                {formData.password === formData.confirmPassword ? "✔ 비밀번호가 일치합니다" : "✖ 비밀번호가 일치하지 않습니다"}
              </div>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>이름</Form.Label>
            <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>전화번호</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="010-1234-5678"
          />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>이메일</Form.Label>
            <div className="d-flex flex-column flex-sm-row gap-2">
              <Form.Control type="text" placeholder="이메일 아이디" value={formData.emailPrefix || ""} disabled={emailVerifyRequested} onChange={(e) => setFormData({ ...formData, emailPrefix: e.target.value })} />
              <span className="d-none d-sm-inline">@</span>
              <Form.Select
                value={formData.emailDomainType || ""}
                disabled={emailVerifyRequested}
                onChange={(e) => {
                  const selected = e.target.value;
                  setFormData({
                    ...formData,
                    emailDomainType: selected,
                    emailDomain: selected === "custom" ? "" : selected,
                  });
                }}
                style={{ maxWidth: "160px" }}
              >
                <option value="">도메인 선택</option>
                <option value="gmail.com">gmail.com</option>
                <option value="naver.com">naver.com</option>
                <option value="daum.net">daum.net</option>
                <option value="custom">직접 입력</option>
              </Form.Select>
              {formData.emailDomainType === "custom" && (
                <Form.Control type="text" placeholder="직접 입력" value={formData.emailDomain} disabled={emailVerifyRequested} onChange={(e) => setFormData({ ...formData, emailDomain: e.target.value })} style={{ minWidth: "140px" }} />
              )}
            </div>

            <div className="mt-2 d-flex gap-2">
              <Button variant="outline-secondary" disabled={!formData.emailPrefix || !formData.emailDomain || emailVerifyRequested} onClick={handleEmailVerificationRequest}>
                {isEmailVerified ? "✔ 인증 완료" : emailVerifyExpired ? "🔁 인증 재요청" : emailVerifyRequested ? `⏳ 대기중 (${Math.floor(timer / 60)}:${(timer % 60).toString().padStart(2, "0")})` : "✉ 이메일 인증"}
              </Button>
              {!isEmailVerified && (
                <Button variant="outline-success" onClick={checkEmailVerified}>
                  인증 확인
                </Button>
              )}
            </div>
          </Form.Group>

          <Form.Group className="mb-1">
            <Form.Label>주소</Form.Label>
            <div className="d-flex">
              <Form.Control type="text" name="hospital" value={formData.hospital} readOnly />
              <Button variant="info" onClick={handleHospitalSearch} className="ms-2" style={{ minWidth: "100px" }}>
                검색
              </Button>
            </div>
          </Form.Group>

          <Button variant="primary" className="w-100 mt-3" onClick={handleSignup} disabled={isSubmitting}>
            {isSubmitting ? "가입 중..." : "가입하기"}
          </Button>
        </Form>
      </Card>

      <Modal scrollable show={showHospitalModal} onHide={() => setShowHospitalModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>병원 검색</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>병원 리스트</p>
          <ul className="list-group">
            <li className="list-group-item" onClick={() => selectHospital("서울병원")}>서울병원</li>
            <li className="list-group-item" onClick={() => selectHospital("부산병원")}>부산병원</li>
            <li className="list-group-item" onClick={() => selectHospital("대전병원")}>대전병원</li>
          </ul>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
