// components/ConfirmModal.js
import React from "react";
import { Modal, Button } from "react-bootstrap";

export default function ConfirmModal({ show, onConfirm, onCancel, title, message }) {
  return (
    <Modal show={show} onHide={onCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title || "확인"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message || "정말 진행하시겠습니까?"}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>
          취소
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          확인
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
