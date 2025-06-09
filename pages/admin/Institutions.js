import React, { useState } from "react";
import AdminLayout from "../components/AdminLayout";
import LicenseAddModal from "../components/LicenseAddModal";
import { Table, Form, Button, Pagination, Modal, Nav, Accordion, InputGroup } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Institutions() {
    const [search, setSearch] = useState("");
    const [selectedInstitution, setSelectedInstitution] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showDateModal, setShowDateModal] = useState(false);
    const [selectedStartDate, setSelectedStartDate] = useState(new Date());
    const [selectedEndDate, setSelectedEndDate] = useState(new Date());
    const itemsPerPage = 5;
    const [institutionsOpen, setInstitutionsOpen] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [issuedLicenses, setIssuedLicenses] = useState([]);
    // LicenseAddModal로부터 받은 데이터 저장
    const handleAddLicense = (data) => {
      if (data.targetType === "institution") {
        setIssuedLicenses((prev) => [...prev, data]);
      }
    };
    <LicenseAddModal 
    show={showAddModal} 
    handleClose={() => setShowAddModal(false)} 
    onAdd={handleAddLicense} />
  const [institutions, setInstitutions] = useState([
    { id: 1, name: "서울대학교", type: "대학교", manager: "김철수", email: "admin@snu.ac.kr", status: "정상", startDate: "2022-01-01", endDate: "2024-12-31" },
    { id: 2, name: "강남병원", type: "병원", manager: "이영희", email: "admin@kangnamhosp.kr", status: "중지", startDate: "2021-06-15", endDate: "2023-06-15" },
    { id: 3, name: "한국전력공사", type: "공공기관", manager: "박영수", email: "admin@kepco.co.kr", status: "정상", startDate: "2023-02-01", endDate: "2024-02-01" },
    { id: 4, name: "한양대학교", type: "대학교", manager: "최민수", email: "admin@hanyang.ac.kr", status: "정상", startDate: "2020-01-01", endDate: "2024-01-01" },
    { id: 5, name: "서울시청", type: "공공기관", manager: "이순신", email: "admin@seoul.go.kr", status: "중지", startDate: "2019-03-01", endDate: "2023-03-01" },
    { id: 6, name: "고려대학교", type: "대학교", manager: "홍길동", email: "admin@korea.ac.kr", status: "정상", startDate: "2020-09-01", endDate: "2024-09-01" },
    { id: 7, name: "연세대학교", type: "대학교", manager: "이순신", email: "admin@yonsei.ac.kr", status: "정상", startDate: "2019-02-15", endDate: "2023-02-15" },
    { id: 8, name: "성균관대학교", type: "대학교", manager: "박보검", email: "admin@skku.edu", status: "중지", startDate: "2021-05-01", endDate: "2023-05-01" },
    { id: 9, name: "한양대학교", type: "대학교", manager: "최민수", email: "admin@hanyang.ac.kr", status: "정상", startDate: "2020-01-01", endDate: "2024-01-01" },
    { id: 10, name: "서울시청", type: "공공기관", manager: "이순신", email: "admin@seoul.go.kr", status: "중지", startDate: "2019-03-01", endDate: "2023-03-01" },
    { id: 11, name: "고려대학교", type: "대학교", manager: "홍길동", email: "admin@korea.ac.kr", status: "정상", startDate: "2020-09-01", endDate: "2024-09-01" },
    { id: 12, name: "연세대학교", type: "대학교", manager: "이순신", email: "admin@yonsei.ac.kr", status: "정상", startDate: "2019-02-15", endDate: "2023-02-15" },
    { id: 13, name: "성균관대학교", type: "대학교", manager: "박보검", email: "admin@skku.edu", status: "중지", startDate: "2021-05-01", endDate: "2023-05-01" }
  ]);

  const groupedByType = institutions.reduce((acc, inst) => {
    if (!acc[inst.type]) acc[inst.type] = [];
    acc[inst.type].push(inst);
    return acc;
  }, {});

  const [groupPages, setGroupPages] = useState({});

  const handlePageChange = (type, pageNumber) => {
    setGroupPages((prev) => ({ ...prev, [type]: pageNumber }));
  };

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

  const handleShowDateModal = () => {
    if (selectedInstitutionInfo) {
      setSelectedStartDate(
        selectedInstitutionInfo.startDate
          ? new Date(selectedInstitutionInfo.startDate)
          : new Date()
      );
      setSelectedEndDate(
        selectedInstitutionInfo.endDate
          ? new Date(selectedInstitutionInfo.endDate)
          : new Date()
      );
      setShowDateModal(true);
    }
  };

  const handleChangeDate = () => {
    if (selectedInstitution) {
      setInstitutions((prev) =>
        prev.map((inst) =>
          inst.id === selectedInstitution
            ? {
                ...inst,
                startDate: selectedStartDate.toISOString().split("T")[0],
                endDate: selectedEndDate.toISOString().split("T")[0],
              }
            : inst
        )
      );
      setShowDateModal(false);
      alert("기관의 서비스 날짜가 변경되었습니다.");
    }
  };

  return (
    <AdminLayout>
      <h2>🏢 기관 관리 (기관 유형별 보기)</h2>

      <div className="d-flex gap-2 mb-3">
        <Form.Control
          type="text"
          placeholder="🔍 기관명, 담당자 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: "300px" }}
        />
        <Button variant="primary" disabled={!selectedInstitution} onClick={handleShowDetailModal}>
          📄 상세 정보 보기
        </Button>
        <Button variant="warning" disabled={!selectedInstitution} onClick={handleShowDateModal}>
          📅 서비스 날짜 변경
        </Button>
      </div>

      <Accordion defaultActiveKey="0">
        {Object.entries(groupedByType).map(([type, list], idx) => {
          const filteredList = list.filter(
            (inst) =>
              inst.name.includes(search) ||
              inst.manager.includes(search) ||
              inst.email.includes(search)
          );

          const currentPage = groupPages[type] || 1;
          const totalPages = Math.ceil(filteredList.length / itemsPerPage);
          const paginatedList = filteredList.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
          );

          return (
            <Accordion.Item eventKey={String(idx)} key={type}>
              <Accordion.Header>{type} ({filteredList.length}개)</Accordion.Header>
              <Accordion.Body>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>V</th>
                      <th>ID</th>
                      <th>기관명</th>
                      <th>담당자</th>
                      <th>이메일</th>
                      <th>상태</th>
                      <th>시작일</th>
                      <th>종료일</th>
                      <th>관리</th>
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
                        <td>{inst.email}</td>
                        <td>{inst.status}</td>
                        <td>{inst.startDate}</td>
                        <td>{inst.endDate}</td>
                        <td>
                          <Button variant="warning" size="sm" disabled={!selectedInstitution}>✏️ 수정</Button>{" "}
                          <Button variant="danger" size="sm" disabled={!selectedInstitution}>❌ 삭제</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                {totalPages > 1 && (
                  <Pagination className="justify-content-center">
                    <Pagination.First onClick={() => handlePageChange(type, 1)} disabled={currentPage === 1} />
                    <Pagination.Prev onClick={() => handlePageChange(type, currentPage - 1)} disabled={currentPage === 1} />
                    {[...Array(totalPages)].map((_, i) => (
                      <Pagination.Item
                        key={i + 1}
                        active={i + 1 === currentPage}
                        onClick={() => handlePageChange(type, i + 1)}
                      >
                        {i + 1}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next onClick={() => handlePageChange(type, currentPage + 1)} disabled={currentPage === totalPages} />
                    <Pagination.Last onClick={() => handlePageChange(type, totalPages)} disabled={currentPage === totalPages} />
                  </Pagination>
                )}
              </Accordion.Body>
            </Accordion.Item>
          );
        })}
      </Accordion>

      {/* 상세 모달 */}
      <Modal show={showDetailModal} onHide={handleCloseDetailModal}>
        <Modal.Header closeButton>
          <Modal.Title>기관 상세 정보</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedInstitutionInfo && (
            <>
              <p><strong>기관명:</strong> {selectedInstitutionInfo.name}</p>
              <p><strong>유형:</strong> {selectedInstitutionInfo.type}</p>
              <p><strong>담당자:</strong> {selectedInstitutionInfo.manager}</p>
              <p><strong>이메일:</strong> {selectedInstitutionInfo.email}</p>
              <Form.Group>
                <Form.Label><strong>특이사항:</strong></Form.Label>
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

      {/* 날짜 변경 모달 */}
      <Modal show={showDateModal} onHide={() => setShowDateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>📅 서비스 날짜 변경</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>변경할 시작일과 종료일을 선택하세요:</p>
          <Form.Group>
            <Form.Label>시작일</Form.Label>
            <DatePicker
              selected={selectedStartDate}
              onChange={(date) => setSelectedStartDate(date)}
              dateFormat="yyyy-MM-dd"
              className="form-control"
            />
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label>종료일</Form.Label>
            <DatePicker
              selected={selectedEndDate}
              onChange={(date) => setSelectedEndDate(date)}
              dateFormat="yyyy-MM-dd"
              className="form-control"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDateModal(false)}>취소</Button>
          <Button variant="primary" onClick={handleChangeDate}>변경</Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
}