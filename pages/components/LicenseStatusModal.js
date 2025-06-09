import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import AlertModal from "./AlertModal"; // 🔹 추가

export default function LicenseStatusModal({ show, handleClose, licenseData, onSave }) {
  const [expirationDate, setExpirationDate] = useState(new Date());
  const [memo, setMemo] = useState("");
  const [showConfirm, setShowConfirm] = useState(false); // 전송 전 확인
  const [showAlert, setShowAlert] = useState(false); // 전송 완료 알림

  useEffect(() => {
    if (licenseData) {
      setExpirationDate(new Date(licenseData.expiresAt));
      setMemo(licenseData.memo || "");
    }
  }, [licenseData]);

  const handleSubmit = () => {
    setShowConfirm(true); // 전송 확인 모달 띄우기
  };

  const handleConfirmSend = () => {
    onSave({
      ...licenseData,
      expiresAt: expirationDate.toISOString().split("T")[0],
      memo
    });

    setShowConfirm(false);      // 전송 확인 모달 닫기
    setShowAlert(true);         // 전송 완료 알림 모달 열기
  };

  const handleAlertClose = () => {
    setShowAlert(false);        // 알림 모달 닫기
    handleClose();              // 수정 모달 닫기
  };

  return (
    <>
      {/* ====== 라이선스 수정 모달 ====== */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>🛠️ 라이선스 정보 수정</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {licenseData && (
            <Form>
              <Form.Group className="mb-2">
                <Form.Label>👤 사용자</Form.Label>
                <Form.Control type="text" value={licenseData.user} readOnly />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>📧 이메일</Form.Label>
                <Form.Control type="email" value={licenseData.email} readOnly />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>🔑 라이선스 키</Form.Label>
                <Form.Control type="text" value={licenseData.key} readOnly />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>📅 발급일</Form.Label>
                <Form.Control type="text" value={licenseData.issuedAt} readOnly />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>📅 만료일</Form.Label>
                <DatePicker
                  selected={expirationDate}
                  onChange={(date) => setExpirationDate(date)}
                  dateFormat="yyyy-MM-dd"
                  className="form-control"
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>📝 메모</Form.Label>
                <Form.Control as="textarea" value={memo} onChange={(e) => setMemo(e.target.value)} />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>취소</Button>
          <Button variant="primary" onClick={handleSubmit}>저장</Button>
        </Modal.Footer>
      </Modal>

      {/* ====== 전송 확인 모달 ====== */}
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>📧 이메일 전송 확인</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>{licenseData?.email}</strong> 로 라이선스 정보를 전송하시겠습니까?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>취소</Button>
          <Button variant="success" onClick={handleConfirmSend}>전송</Button>
        </Modal.Footer>
      </Modal>

      {/* ====== 전송 완료 알림 모달 ====== */}
      <AlertModal
        show={showAlert}
        message={`${licenseData?.email} 로 전송되었습니다.`}
        onClose={handleAlertClose}
      />
    </>
  );
}
