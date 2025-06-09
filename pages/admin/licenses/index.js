import React, { useState } from "react";
import { Table, Button, Form, Badge, Modal } from "react-bootstrap";
import { Pagination } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AdminLayout from "../../components/AdminLayout";
import LicenseStatusModal from "../../components/LicenseStatusModal";
import LicenseAddModal from "../../components/LicenseAddModal";
import LicenseDeleteModal from "../../components/LicenseDeleteModal";
import { licenseDummyData } from "../data/licenseData";

export default function Licenses() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState(null); // 선택된 라이선스
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedLicenses, setSelectedLicenses] = useState([]); // 체크된 항목
  const [search, setSearch] = useState(""); // 검색어 상태
  const [statusFilter, setStatusFilter] = useState("전체"); // 필터링 상태
  const [showDeleteModal, setShowDeleteModal] = useState(false); //라이선스 삭제
  // ✅ 라이선스 키 더미 데이터
  const [licenses, setLicenses] = useState(licenseDummyData);

  // ✅ 라이선스 갱신 (만료일 1년 연장)
  const handleRenewLicense = (id) => {
    setLicenses(licenses.map((license) =>
      license.id === id
        ? { ...license, expiresAt: new Date(new Date(license.expiresAt).setFullYear(new Date(license.expiresAt).getFullYear() + 1)).toISOString().split("T")[0] }
        : license
    ));
  };

  // ✅ 라이선스 비활성화
  const handleRevokeLicense = (id) => {
    setLicenses(licenses.map((license) =>
      license.id === id ? { ...license, status: "revoked" } : license
    ));
  };

  // ✅ 체크박스 선택 핸들러 (하나만 선택 가능)
  const handleSelectLicense = (id) => {
    setSelectedLicenses(prev => prev.includes(id) ? [] : [id]); // 하나만 선택되도록 제한
  };

  // ✅ 상태 수정 버튼 클릭 → 팝업에 데이터 표시
  const handleEditLicense = () => {
    const selected = licenses.find((l) => l.id === selectedLicenses[0]);
    setSelectedLicense(selected);
    setShowStatusModal(true);
  };

  // ✅ 팝업에서 저장 후 테이블 데이터 업데이트
  const handleLicenseSave = (updatedLicense) => {
    setLicenses((prev) =>
      prev.map((l) => (l.id === updatedLicense.id ? updatedLicense : l))
    );
    setSelectedLicenses([]); // 저장 후 선택 초기화
  };
  const handleAddLicense = (newLicense) => {
    setLicenses((prev) => [...prev, newLicense]);
  };

  // 페이징처리 로직
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // 페이지당 10개 표시
  const filteredLicenses = licenses.filter((license) => {
    const matchesSearch =
      license.user.toLowerCase().includes(search.toLowerCase()) ||
      license.email.toLowerCase().includes(search.toLowerCase()) ||
      license.key.toLowerCase().includes(search.toLowerCase()) ||
      license.product.toLowerCase().includes(search.toLowerCase());
  
    const matchesStatus = statusFilter === "전체" || license.status === statusFilter;
  
    return matchesSearch && matchesStatus;
  });
  
  const totalPages = Math.ceil(filteredLicenses.length / itemsPerPage);
  const paginatedLicenses = filteredLicenses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // 삭제 버튼 클릭 시
  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  // 삭제 확인
  const handleConfirmDelete = () => {
    const updated = licenses.filter((l) => !selectedLicenses.includes(l.id));
    setLicenses(updated);
    setSelectedLicenses([]);
    setShowDeleteModal(false);
  };

  // 삭제 취소
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  return (
    <AdminLayout>
      <h2>🔑 라이선스 키 관리</h2>
        {/* 라이선스 추가, 수정, 삭제 버튼 */}
        <div className="mb-3">
        <Button variant="primary" className="me-2" onClick={() => setShowAddModal(true)}>
            ➕ 라이선스 키 추가
        </Button>
        {/* 상태 수정 버튼 (체크한 항목 있을 때만 활성화) */}
        <Button
          variant="warning"
          className="me-2"
          onClick={handleEditLicense}
          disabled={selectedLicenses.length !== 1}
        >
          🛠️ 라이선스 키 수정
        </Button>

        <Button
          variant="danger"
          disabled={selectedLicenses.length === 0}
          onClick={handleDeleteClick}
        >
          ❌ 라이선스 키 삭제
        </Button>

        </div>
        <div className="d-flex mb-3 gap-2">
          {/* 검색 입력창 */}
          <Form.Control
            type="text"
            placeholder="🔍 사용자, 이메일, 제품명, 라이선스 키 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* 상태 필터 */}
          <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="전체">전체</option>
            <option value="active">✅ 활성</option>
            <option value="expired">⚠️ 만료</option>
            <option value="revoked">🚫 취소됨</option>
          </Form.Select>
        </div>
      {/* ✅ 라이선스 테이블 */}
      {/* <div style={{ overflowX: "auto" }}> */}
      <Table striped bordered hover responsive="lg" className="align-middle text-center">
        <thead>
          <tr>
            <th>✅</th>
            <th>🔑 라이선스 키</th>
            <th>👤 사용자</th>
            <th>📧 이메일</th>
            <th>🖥️ 장치 정보</th>
            <th>🖥️ 제품</th>
            <th>📅 발급일</th>
            <th>📅 만료일</th>
            <th>📌 상태</th>
            <th>⚙️ 관리</th>
          </tr>
        </thead>
        <tbody>
          {paginatedLicenses.map((license) => (
            <tr key={license.id}>
              <td>
                <Form.Check 
                  type="checkbox" 
                  checked={selectedLicenses.includes(license.id)}
                  onChange={() => handleSelectLicense(license.id)} 
                />
              </td>
              <td>{license.key}</td>
              <td>{license.user}</td>
              <td>{license.email}</td>
              <td>{license.deviceInfo}</td>
              <td>{license.product}</td>
              <td>{license.issuedAt}</td>
              <td>{license.expiresAt}</td>
              <td>
                <Badge bg={license.status === "active" ? "success" : license.status === "expired" ? "warning" : "danger"}>
                  {license.status}
                </Badge>
              </td>
              <td>
                <Button variant="info" size="sm" onClick={() => handleRenewLicense(license.id)}>🔄 갱신</Button>{' '}
                <Button variant="danger" size="sm" onClick={() => handleRevokeLicense(license.id)}>🚫 비활성화</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {/* </div> */}

      <Pagination className="justify-content-center">
        <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
        <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} />

        {[...Array(totalPages)].map((_, index) => (
          <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => setCurrentPage(index + 1)}>
            {index + 1}
          </Pagination.Item>
        ))}

        <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} />
        <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
      </Pagination>
      {/* 상태 추가 모달 */}
      <LicenseAddModal
        show={showAddModal}
        handleClose={() => setShowAddModal(false)}
        onAdd={handleAddLicense}
      />
      {/* 상태 수정 모달 */}
      <LicenseStatusModal
        show={showStatusModal}
        handleClose={() => setShowStatusModal(false)}
        licenseData={selectedLicense}
        onSave={handleLicenseSave}
      />
      {/* 상태 삭제 모달 */}
      <LicenseDeleteModal
        show={showDeleteModal}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

    </AdminLayout>
  );
}
