// components/TrialUserModal.js
import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

export default function TrialUserModal({ show, onClose, onSave, newUser, setNewUser }) {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>➕ 체험판 사용자 추가</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>아이디</Form.Label>
            <Form.Control
              type="text"
              placeholder="아이디 입력"
              value={newUser.user}
              onChange={(e) => setNewUser({ ...newUser, user: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>이름</Form.Label>
            <Form.Control
              type="text"
              placeholder="이름 입력"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>이메일</Form.Label>
            <Form.Control
              type="email"
              placeholder="example@email.com"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>전화번호</Form.Label>
            <Form.Control
              type="tel"
              placeholder="010-0000-0000"
              value={newUser.phone}
              onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>소속</Form.Label>
            <Form.Control
              type="text"
              placeholder="소속 입력"
              value={newUser.organization}
              onChange={(e) => setNewUser({ ...newUser, organization: e.target.value })}
            />
          </Form.Group>
          <small className="text-muted">※ 기간은 30일입니다.</small>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          닫기
        </Button>
        <Button variant="primary" onClick={onSave}>
          저장
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
