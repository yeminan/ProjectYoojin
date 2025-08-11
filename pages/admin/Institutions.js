"use client";

import React, { useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { Table, Form, Button, Pagination, Modal } from "react-bootstrap";

export default function Institutions() {
  const [search, setSearch] = useState("");
  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const itemsPerPage = 5;

  const [institutions, setInstitutions] = useState([
    { id: 1, name: "서울대학교병원", manager: "김철수", phone: "010-1234-5678", email: "admin@snu.ac.kr", licenseCount: 50 },
    { id: 2, name: "강남병원", manager: "이영희", phone: "010-2345-6789", email: "admin@kangnamhosp.kr", licenseCount: 30 },
    { id: 3, name: "한국전력병원", manager: "박영수", phone: "010-3456-7890", email: "admin@kepco.co.kr", licenseCount: 10 },
    { id: 4, name: "한양대학교병원", manager: "최민수", phone: "010-4567-8901", email: "admin@hanyang.ac.kr", licenseCount: 25 },
    { id: 5, name: "서울시립병원", manager: "이순신", phone: "010-5678-9012", email: "admin@seoul.go.kr", licenseCount: 15 },
    { id: 6, name: "고려대학교병원", manager: "홍길동", phone: "010-6789-0123", email: "admin@korea.ac.kr", licenseCount: 20 },
    { id: 7, name: "연세대학교병원", manager: "이순신", phone: "010-7890-1234", email: "admin@yonsei.ac.kr", licenseCount: 18 },
    { id: 8, name: "성균관대학교병원", manager: "박보검", phone: "010-8901-2345", email: "admin@skku.edu", licenseCount: 22 }
  ]);

  const filteredList = institutions.filter(
    (inst) =>
      inst.name.includes(search) ||
      inst.manager.includes(search) ||
      inst.email.includes(search)
  );

  const currentPage = 1;
  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const paginatedList = filteredList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSelectInstitution = (id) => {
    setSelectedInstitution(id === selectedInstitution ? null : id);
  };

  const selectedInstitutionInfo = institutions.find(
    (inst) => inst.id === selectedInstitution
  );

  const handleShowDetailModal = () => {
    if (selectedInstitution) setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => setShowDetailModal(false);

  return (
    <AdminLayout>
      <h2>라이선스 발급 현황</h2>
      <div className="d-flex gap-2 mb-3">
        <Form.Control
          type="text"
          placeholder="🔍 빈원명, 단답자 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: "300px" }}
        />
        <Button variant="primary" disabled={!selectedInstitution} onClick={handleShowDetailModal}>
          상세 정보 보기
        </Button>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>V</th>
            <th>ID</th>
            <th>빈원명</th>
            <th>단답자</th>
            <th>전화번호</th>
            <th>이메일</th>
            <th>라이선스 수</th>
          </tr>
        </thead>
        <tbody>
          {paginatedList.map((inst) => (
            <tr key={inst.id}>
              <td>
                <Form.Check
                  type="checkbox"
                  checked={inst.id === selectedInstitution}
                  onChange={() => handleSelectInstitution(inst.id)}
                />
              </td>
              <td>{inst.id}</td>
              <td>{inst.name}</td>
              <td>{inst.manager}</td>
              <td>{inst.phone}</td>
              <td>{inst.email}</td>
              <td>{inst.licenseCount ?? 0}개</td>
            </tr>
          ))}
        </tbody>
      </Table>
      {totalPages > 1 && (
        <Pagination className="justify-content-center">
          {[...Array(totalPages)].map((_, i) => (
            <Pagination.Item
              key={i + 1}
              active={i + 1 === currentPage}
              onClick={() => {}}
            >
              {i + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      )}

      {/* 상세 목록 모니터 */}
      <Modal show={showDetailModal} onHide={handleCloseDetailModal}>
        <Modal.Header closeButton>
          <Modal.Title>빈원 상세 정보</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedInstitutionInfo && (
            <>
              <p><strong>빈원명:</strong> {selectedInstitutionInfo.name}</p>
              <p><strong>단답자:</strong> {selectedInstitutionInfo.manager}</p>
              <p><strong>전화번호:</strong> {selectedInstitutionInfo.phone}</p>
              <p><strong>이메일:</strong> {selectedInstitutionInfo.email}</p>
              <p><strong>라이선스 수:</strong> {selectedInstitutionInfo.licenseCount}개</p>
              <Form.Group>
                <Form.Label><strong>비고:</strong></Form.Label>
                <Form.Control as="textarea" defaultValue={selectedInstitutionInfo.note || ""} />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDetailModal}>닫기</Button>
          <Button variant="primary">저장</Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
}
