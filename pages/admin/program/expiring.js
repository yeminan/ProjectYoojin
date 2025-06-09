import React, { useState, useEffect } from "react";
import { Table, Form, Badge, Pagination, Button } from "react-bootstrap";
import AdminLayout from "../../components/AdminLayout";
import { licenseDummyData } from "../data/licenseData";

export default function ExpiredLicensesPage() {
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const itemsPerPage = 10;

  useEffect(() => {
    const today = new Date(); // 또는 new Date()
    const rangeStart = new Date(today);
    rangeStart.setDate(today.getDate() - 60); // 15일 전

    const nearingExpiration = licenseDummyData.filter((l) => {
      const exp = new Date(l.expiresAt);
      return exp >= rangeStart && exp <= today;
    });

    const searched = nearingExpiration.filter((l) =>
      [l.user, l.email, l.product, l.key].some((field) =>
        field.toLowerCase().includes(search.toLowerCase())
      )
    );

    setFiltered(searched);
    setCurrentPage(1); // 검색어 변경 시 1페이지로 리셋
  }, [search]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // 체크박스 선택 토글
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // 전체 선택
  const toggleSelectAll = () => {
    const allIds = paginated.map((l) => l.id);
    const allSelected = allIds.every((id) => selectedIds.includes(id));
    setSelectedIds(allSelected ? selectedIds.filter((id) => !allIds.includes(id)) : [...selectedIds, ...allIds.filter((id) => !selectedIds.includes(id))]);
  };

  // 만료 알림 전송 버튼 클릭
  const handleSendReminder = () => {
    const selectedEmails = paginated
      .filter((l) => selectedIds.includes(l.id))
      .map((l) => l.email);

    if (selectedEmails.length === 0) {
      alert("📭 선택된 항목이 없습니다.");
      return;
    }

    const confirmed = window.confirm(
      `📧 다음 이메일로 만료 알림 메일을 전송하시겠습니까?\n\n${selectedEmails.join(
        ", "
      )}`
    );

    if (confirmed) {
      // 나중에 이메일 전송 API로 대체 예정
      console.log("전송 대상 이메일 목록:", selectedEmails);
      alert("✅ 만료 알림 메일이 전송되었습니다 (가정).");
    }
  };

  return (
    <AdminLayout>
      <h2>📋 만료 임박 라이선스 목록</h2>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <Button variant="danger" onClick={handleSendReminder}>
          📤 만료 알림 전송
        </Button>

        <Form.Control
          style={{ width: "300px" }}
          placeholder="🔍 사용자, 이메일, 제품명, 키 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>
              <Form.Check
                type="checkbox"
                checked={
                  paginated.length > 0 &&
                  paginated.every((l) => selectedIds.includes(l.id))
                }
                onChange={toggleSelectAll}
              />
            </th>
            <th>🔑 라이선스 키</th>
            <th>👤 사용자</th>
            <th>📧 이메일</th>
            <th>📅 만료일</th>
            <th>📌 상태</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((l) => (
            <tr key={l.id}>
              <td>
                <Form.Check
                  type="checkbox"
                  checked={selectedIds.includes(l.id)}
                  onChange={() => toggleSelect(l.id)}
                />
              </td>
              <td>{l.key}</td>
              <td>{l.user}</td>
              <td>{l.email}</td>
              <td className="text-danger fw-bold">🔔 {l.expiresAt}</td>
              <td>
                <Badge
                  bg={
                    l.status === "active"
                      ? "success"
                      : l.status === "expired"
                      ? "warning"
                      : "danger"
                  }
                >
                  {l.status}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination className="justify-content-center">
        <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
        <Pagination.Prev onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} />
        {Array.from({ length: totalPages }, (_, i) => (
          <Pagination.Item
            key={i + 1}
            active={i + 1 === currentPage}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
        />
        <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
      </Pagination>
    </AdminLayout>
  );
}
