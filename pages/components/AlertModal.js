// components/AlertModal.js
import React from "react";
import { Modal, Button } from "react-bootstrap";

export default function AlertModal({ show, message, onClose }) {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>📨 전송 완료</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {message}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onClose}>확인</Button>
      </Modal.Footer>
    </Modal>
  );
}
