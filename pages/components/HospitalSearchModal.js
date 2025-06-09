import React, { useState } from "react";
import { Modal, Button, Form, Table, Spinner, Pagination } from "react-bootstrap";

export default function HospitalSearchModal({
  show,
  onHide,
  onClose,
  onSelect,
}) {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSearch = async () => {
    if (!keyword.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/hospitalSearch?keyword=${encodeURIComponent(keyword)}`);
      const data = await res.json();
      setResults(data);
      setCurrentPage(1); // 검색 시 첫 페이지로 초기화
    } catch (err) {
      console.error("병원 검색 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (hospital) => {
    onSelect(hospital); // 병원 전달
    if (onHide) onHide(); // 모달 닫기 처리
  };
  

  const totalPages = Math.ceil(results.length / itemsPerPage);
  const paginatedResults = results.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Modal
      show={show}
      onHide={onHide}
      dialogClassName="hospital-search-modal" // 👈 고유 클래스명 사용
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>🏥 병원 검색</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="d-flex gap-2 mb-3">
          <Form.Control
            type="text"
            placeholder="병원명을 입력하세요"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button variant="primary" onClick={handleSearch}>검색</Button>
        </div>

        {loading ? (
          <div className="text-center py-3">
            <Spinner animation="border" />
          </div>
        ) : (
          <>
            <Table striped bordered hover className="modal-table">
              <thead className="table-light">
                <tr>
                  <th>병원명</th>
                  <th>주소</th>
                  <th style={{ width: "80px" }}>선택</th>
                </tr>
              </thead>
              <tbody>
                {paginatedResults.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center">검색 결과가 없습니다.</td>
                  </tr>
                ) : (
                  paginatedResults.map((hospital, idx) => (
                    <tr key={idx}>
                      <td>{hospital.yadmNm}</td>
                      <td>{hospital.addr}</td>
                      <td>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleSelect(hospital)}
                        >
                          선택
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>

            {totalPages > 1 && (
              <div className="d-flex justify-content-center">
                <Pagination>
                  <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
                  <Pagination.Prev onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} />

                  {[...Array(totalPages)].map((_, idx) => (
                    <Pagination.Item
                      key={idx + 1}
                      active={idx + 1 === currentPage}
                      onClick={() => setCurrentPage(idx + 1)}
                    >
                      {idx + 1}
                    </Pagination.Item>
                  ))}

                  <Pagination.Next onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} />
                  <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
                </Pagination>
              </div>
            )}
          </>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>닫기</Button>
      </Modal.Footer>
    </Modal>
  );
}
