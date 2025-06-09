import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import DatePicker from "react-datepicker";

export default function LicenseAddModal({ show, handleClose, onAdd }) {
  const [form, setForm] = useState({
    user: "",
    email: "",
    product: "",
    key: "", // 랜덤 생성
    issuedAt: new Date(),
    expiresAt: new Date(),
    deviceInfo: "", // 자동 인식됨
    memo: "",
    targetType: "", // user or institution
    targetId: "" // 사용자ID 또는 기관ID
  });

  const [showConfirmModal, setShowConfirmModal] = useState(false); // 재확인 모달
  const [showAlert, setShowAlert] = useState(false); // 전송 알림

  // ✅ 라이선스 키 자동 생성
  const generateLicenseKey = () => {
    return Array(4)
      .fill(null)
      .map(() => Math.random().toString(36).substr(2, 4).toUpperCase())
      .join("-");
  };

  // ✅ 장치 정보 자동 설정
  useEffect(() => {
    const os = navigator.platform || "Unknown OS";
    const agent = navigator.userAgent || "Unknown Device";
    setForm((prev) => ({
      ...prev,
      key: generateLicenseKey(),
      deviceInfo: `${os} | ${agent}`
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ "추가" 버튼 클릭 시 → 재확인 팝업 표시
  const handleAdd = () => {
    setShowConfirmModal(true);
  };

  // ✅ "발송" 버튼 클릭 시 → 모든 팝업 닫히고 전송 알림 표시
  const handleSendEmail = () => {
    setShowConfirmModal(false);
    handleClose();
    setTimeout(() => setShowAlert(true), 500);
  
    // 상위에 전달
    onAdd && onAdd(form);
  };

  return (
    <>
      {/* ✅ 라이선스 추가 모달 */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>➕ 라이선스 키 추가</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>👤 사용자</Form.Label>
              <Form.Control name="user" value={form.user} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>📧 이메일</Form.Label>
              <Form.Control type="email" name="email" value={form.email} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>🔑 라이선스 키 (자동 생성)</Form.Label>
              <Form.Control name="key" value={form.key} readOnly />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>🖥️ 제품명</Form.Label>
              <Form.Select name="product" value={form.product} onChange={handleChange}>
                <option value="">-- 선택하세요 --</option>
                <option value="프로그램 A">프로그램 A</option>
                <option value="프로그램 B">프로그램 B</option>
                <option value="프로그램 C">프로그램 C</option>
                <option value="프로그램 D">프로그램 D</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>🎯 발급 대상</Form.Label>
              <Form.Select name="targetType" value={form.targetType} onChange={handleChange}>
                <option value="">-- 선택하세요 --</option>
                <option value="user">개인 사용자</option>
                <option value="institution">기관</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>{form.targetType === "user" ? "👤 사용자 ID" : "🏢 기관 ID"}</Form.Label>
              <Form.Control
                name="targetId"
                value={form.targetId}
                onChange={handleChange}
                placeholder={form.targetType === "user" ? "예: user001" : "예: inst001"}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>📅 발급일</Form.Label>
              <DatePicker
                selected={form.issuedAt}
                onChange={(date) => setForm((prev) => ({ ...prev, issuedAt: date }))}
                className="form-control"
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>📅 만료일</Form.Label>
              <DatePicker
                selected={form.expiresAt}
                onChange={(date) => setForm((prev) => ({ ...prev, expiresAt: date }))}
                className="form-control"
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>🖥️ 장치 정보</Form.Label>
              <Form.Control name="deviceInfo" value={form.deviceInfo} readOnly />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>📝 메모</Form.Label>
              <Form.Control as="textarea" name="memo" value={form.memo} onChange={handleChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>취소</Button>
          <Button variant="primary" onClick={handleAdd}>추가</Button>
        </Modal.Footer>
      </Modal>

      {/* ✅ 재확인 모달 */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>📩 라이선스 발급 확인</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>👤 사용자:</strong> {form.user}</p>
          <p><strong>📧 이메일:</strong> {form.email}</p>
          <p><strong>🔑 발급된 라이선스 키:</strong> {form.key}</p>
          <p><strong>📅 만료일:</strong> {form.expiresAt.toISOString().split("T")[0]}</p>
          <p>이메일로 전송하시겠습니까?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>닫기</Button>
          <Button variant="success" onClick={handleSendEmail}>📩 발송</Button>
        </Modal.Footer>
      </Modal>

      {/* ✅ 이메일 전송 알림 (마지막에 표시) */}
      <Modal show={showAlert} onHide={() => setShowAlert(false)}>
        <Modal.Header closeButton>
          <Modal.Title>📩 이메일 전송 완료</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>메일이 전송되었습니다.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowAlert(false)}>확인</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
