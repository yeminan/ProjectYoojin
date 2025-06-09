import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

export default function PaymentDetails({ show, handleClose, paymentData }) {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // 연도별 메모 더미 데이터 (테스트용)
  const memoData = {
    2023: "2023년 결제 관련 메모입니다.",
    2024: "2024년 결제 관련 메모입니다.",
    2025: "2025년 결제 관련 메모입니다.",
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>🔍 결제 내역 상세 보기</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* 연도 선택 드롭다운 */}
          <Form.Group className="mb-2">
            <Form.Label>📅 연도 선택</Form.Label>
            <Form.Select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
              {Object.keys(memoData).map((year) => (
                <option key={year} value={year}>{year}년</option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* 이메일 */}
          <Form.Group className="mb-2">
            <Form.Label>📧 이메일</Form.Label>
            <Form.Control type="email" value={paymentData?.email || ""} disabled />
          </Form.Group>

          {/* 소속 */}
          <Form.Group className="mb-2">
            <Form.Label>🏢 소속</Form.Label>
            <Form.Control type="text" value={paymentData?.org || ""} disabled />
          </Form.Group>

          {/* 연도별 메모 */}
          <Form.Group className="mb-2">
            <Form.Label>📝 연도별 메모</Form.Label>
            <Form.Control as="textarea" value={memoData[selectedYear] || "메모 없음"} disabled />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>닫기</Button>
        <Button variant="primary">저장</Button>
      </Modal.Footer>
    </Modal>
  );
}
