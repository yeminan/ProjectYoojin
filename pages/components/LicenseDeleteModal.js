import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import ConfirmModal from "./ConfirmModal"; // 경로 확인

export default function LicenseDeleteModal({ show, onConfirm, onCancel }) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleFirstConfirm = () => {
    setShowConfirm(true); // 두 번째 모달 보여줌
  };

  const handleFinalConfirm = () => {
    setShowConfirm(false);
    onConfirm(); // 실제 삭제 동작
  };

  return (
    <>
      {/* 첫 번째 삭제 모달 */}
      <Modal show={show} onHide={onCancel} centered>
        <Modal.Header closeButton>
          <Modal.Title>❌ 라이선스 키 삭제</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          선택한 라이선스 키를 정말 삭제하시겠습니까?
          <br />
          이 작업은 되돌릴 수 없습니다.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onCancel}>
            취소
          </Button>
          <Button variant="danger" onClick={handleFirstConfirm}>
            삭제
          </Button>
        </Modal.Footer>
      </Modal>

      {/* 두 번째 재확인 모달 */}
      <ConfirmModal
        show={showConfirm}
        onConfirm={handleFinalConfirm}
        onCancel={() => setShowConfirm(false)}
        title="정말 삭제하시겠습니까?"
        message="삭제된 라이선스 키는 복구할 수 없습니다."
      />
    </>
  );
}
