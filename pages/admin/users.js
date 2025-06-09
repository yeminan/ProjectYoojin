import React, { useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { Table, Form, Button, Pagination, Modal } from "react-bootstrap";
import DatePicker from "react-datepicker"; // 날짜 선택기 라이브러리
import "react-datepicker/dist/react-datepicker.css";

// 윤년 계산 함수
const isLeapYear = (year) => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

export default function Users() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("전체"); // 필터 상태 관리
  const [selectedUser, setSelectedUser] = useState(null); // 선택된 사용자
  const [showDetailModal, setShowDetailModal] = useState(false); // 회원정보 상세보기 모달
  const [showDateModal, setShowDateModal] = useState(false); // 서비스 날짜 변경 모달
  const [selectedStartDate, setSelectedStartDate] = useState(new Date()); // 시작일
  const [selectedEndDate, setSelectedEndDate] = useState(new Date()); // 종료일
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const itemsPerPage = 5; // 한 페이지당 표시할 개수


  // 예제 사용자 데이터 (20개)
  const [users, setUsers] = useState([
    { id: 1, name: "홍길동", email: "hong@example.com", org: "서울병원", status: "활성", startDate: "2023-12-31", endDate: "2024-12-31" },
    { id: 2, name: "이순신", email: "lee@example.com", org: "서울병원", status: "정지", startDate: "2023-06-15", endDate: "2024-06-15" },
    { id: 3, name: "김영희", email: "kim@example.com", org: "서울병원", status: "활성", startDate: "2022-01-01", endDate: "2025-01-10" },
    { id: 4, name: "박철수", email: "park@example.com", org: "서울병원", status: "활성", startDate: "2020-02-28", endDate: "2024-02-29" }, // 윤년 적용
    { id: 5, name: "최민수", email: "choi@example.com", org: "서울병원", status: "정지", startDate: "2019-03-01", endDate: "2023-02-28" },
    { id: 6, name: "윤고수", email: "yoon@example.com", org: "서울병원", status: "활성", startDate: "2024-02-29", endDate: "2025-02-28" }, // 2024년 윤년
    { id: 7, name: "강호동", email: "kang@example.com", org: "서울병원", status: "정지", startDate: "2018-07-15", endDate: "2019-07-15" },
    { id: 8, name: "이영애", email: "leea@example.com", org: "서울병원", status: "활성", startDate: "2021-05-05", endDate: "2023-05-05" },
    { id: 9, name: "정준하", email: "jung@example.com", org: "서울병원", status: "정지", startDate: "2020-11-20", endDate: "2022-11-20" },
    { id: 10, name: "유재석", email: "yu@example.com", org: "서울병원", status: "활성", startDate: "2016-02-28", endDate: "2020-02-29" }, // 2020년 윤년
    { id: 11, name: "박명수", email: "parkm@example.com", org: "서울병원", status: "정지", startDate: "2022-09-01", endDate: "2024-09-01" },
    { id: 12, name: "신동엽", email: "shin@example.com", org: "서울병원", status: "활성", startDate: "2017-04-30", endDate: "2019-04-30" },
    { id: 13, name: "차태현", email: "cha@example.com", org: "서울병원", status: "활성", startDate: "2025-12-01", endDate: "2026-12-01" },
    { id: 14, name: "이동욱", email: "leed@example.com", org: "서울병원", status: "정지", startDate: "2015-08-10", endDate: "2018-08-10" },
    { id: 15, name: "손흥민", email: "son@example.com", org: "서울병원", status: "활성", startDate: "2019-01-01", endDate: "2023-01-01" },
    { id: 16, name: "김연아", email: "kimy@example.com", org: "서울병원", status: "활성", startDate: "2024-02-29", endDate: "2025-02-28" }, // 윤년
    { id: 17, name: "BTS 정국", email: "jungkook@example.com", org: "서울병원", status: "정지", startDate: "2022-06-20", endDate: "2024-06-20" },
    { id: 18, name: "BLACKPINK 리사", email: "lisa@example.com", org: "서울병원", status: "활성", startDate: "2021-10-10", endDate: "2023-10-10" },
    { id: 19, name: "아이유", email: "iu@example.com", org: "서울병원", status: "정지", startDate: "2020-12-24", endDate: "2022-12-24" },
    { id: 20, name: "싸이", email: "psy@example.com", org: "서울병원", status: "활성", startDate: "2016-07-07", endDate: "2018-07-07" }
  ]);
  

  // 검색 + 필터링 적용된 사용자 목록
  const filteredUsers = users.filter(
    (user) =>
      (statusFilter === "전체" || user.status === statusFilter) &&
      (user.name.includes(search) || user.email.includes(search))
  );

  // 페이징 처리된 데이터 가져오기
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 체크박스 선택 처리
  const handleSelectUser = (userId) => {
    setSelectedUser(userId === selectedUser ? null : userId);
  };
  // 선택된 사용자 정보 가져오기
  const selectedUserInfo = users.find((user) => user.id === selectedUser);

  // 상세보기 모달 열기
  const handleShowDetailModal = () => {
    if (selectedUser) {
      setShowDetailModal(true);
    }
  };

  // 상세보기 모달 닫기
  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
  };

  // 서비스 날짜 변경 모달 열기
  const handleShowDateModal = () => {
    if (selectedUserInfo) {
      setSelectedStartDate(selectedUserInfo.startDate ? new Date(selectedUserInfo.startDate) : new Date());
      setSelectedEndDate(selectedUserInfo.endDate ? new Date(selectedUserInfo.endDate) : new Date());
      setShowDateModal(true);
    }
  };

  // 서비스 날짜 변경 처리
  const handleChangeDate = () => {
    if (selectedUser) {
      const startYear = selectedStartDate.getFullYear();
      const endYear = selectedEndDate.getFullYear();

      // 2월의 마지막 날짜 확인
      const maxDaysInFebStart = isLeapYear(startYear) ? 29 : 28;
      const maxDaysInFebEnd = isLeapYear(endYear) ? 29 : 28;

      // 2월 30일, 31일 방지
      if (
        (selectedStartDate.getMonth() === 1 && selectedStartDate.getDate() > maxDaysInFebStart) ||
        (selectedEndDate.getMonth() === 1 && selectedEndDate.getDate() > maxDaysInFebEnd)
      ) {
        alert(`유효하지 않은 날짜입니다. 2월은 ${maxDaysInFebStart}일까지 가능합니다.`);
        return;
      }

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === selectedUser
            ? {
                ...user,
                startDate: selectedStartDate.toISOString().split("T")[0],
                endDate: selectedEndDate.toISOString().split("T")[0],
              }
            : user
        )
      );
      setShowDateModal(false);
      alert("서비스 날짜가 변경되었습니다.");
    }
  };
  return (
    <AdminLayout>
      <h2>👥 사용자 관리</h2>

      {/* 회원정보 상세보기 & 서비스 날짜 변경 버튼 */}
      <div className="d-flex gap-2 mb-3">
        <Button variant="primary" disabled={!selectedUser} onClick={handleShowDetailModal}>
          📄 회원정보 상세보기
        </Button>
        <Button variant="warning" disabled={!selectedUser} onClick={handleShowDateModal}>
          📅 서비스 날짜 변경
        </Button>
      </div>

      {/* 검색 및 필터 */}
      <div className="d-flex mb-3">
        <Form.Control
          type="text"
          placeholder="🔍 이름 또는 이메일 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="me-2"
        />
        <Form.Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="전체">전체</option>
          <option value="활성">✅ 활성</option>
          <option value="정지">❌ 정지</option>
        </Form.Select>
      </div>

      {/* 테이블 */}
      <Table striped bordered hover>
      <thead>
          <tr>
            <th>V</th>
            <th>ID</th>
            <th>이름</th>
            <th>이메일</th>
            <th>소속</th> {/* 추가 */}
            <th>상태</th>
            <th>서비스 시작일</th>
            <th>서비스 종료일</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.map((user) => (
            <tr key={user.id}>
              <td>
                <Form.Check type="checkbox" checked={user.id === selectedUser} onChange={() => handleSelectUser(user.id)} />
              </td>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.org}</td> {/* 추가 */}
              <td>{user.status === "활성" ? "✅ 활성" : "❌ 정지"}</td>
              <td>{user.startDate}</td>
              <td>{user.endDate}</td>
              <td>
                <Button variant="warning" size="sm" disabled={!selectedUser}>✏️ 수정</Button>
                <Button variant="danger" size="sm" disabled={!selectedUser}>❌ 삭제</Button>
              </td>
            </tr>
          ))}
        </tbody>

      </Table>

      {/* 페이지네이션 */}
      <Pagination className="justify-content-center">
        <Pagination.First
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
        />
        <Pagination.Prev
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        />
        {[...Array(totalPages)].map((_, index) => (
          <Pagination.Item
            key={index + 1}
            active={index + 1 === currentPage}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
        <Pagination.Last
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
        />
      </Pagination>

      {/* 회원정보 상세보기 모달 */}
      <Modal show={showDetailModal} onHide={handleCloseDetailModal}>
        <Modal.Header closeButton>
          <Modal.Title>회원정보 상세보기</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUserInfo && (
            <>
              <p><strong>이름:</strong> {selectedUserInfo.name}</p>
              <p><strong>이메일:</strong> {selectedUserInfo.email}</p>
              <p><strong>소속:</strong> {selectedUserInfo.org}</p>
              <p><strong>가입일:</strong> {selectedUserInfo.joinDate}</p>
              <Form.Group>
                <Form.Label><strong>특이사항:</strong></Form.Label>
                <Form.Control as="textarea" defaultValue={selectedUserInfo.note} />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDetailModal}>
            닫기
          </Button>
          <Button variant="primary">저장</Button>
        </Modal.Footer>
      </Modal>

      {/* 서비스 날짜 변경 모달 */}
      <Modal show={showDateModal} onHide={() => setShowDateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>📅 서비스 날짜 변경</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>변경할 시작일과 종료일을 선택하세요:</p>
          <Form.Group>
            <Form.Label>서비스 시작일</Form.Label>
            <DatePicker
              selected={selectedStartDate}
              onChange={(date) => setSelectedStartDate(date)}
              dateFormat="yyyy-MM-dd"
              className="form-control"
            />
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label>서비스 종료일</Form.Label>
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
