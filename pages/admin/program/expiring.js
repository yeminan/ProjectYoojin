"use client";

import React, { useState, useEffect } from "react";
import { Table, Form, Badge, Pagination, Button } from "react-bootstrap";
import AdminLayout from "../../components/AdminLayout";

export default function ExpiringLicensesPage() {
  const [licenses, setLicenses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const itemsPerPage = 10;
  const ApiUrlKey = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchLicenses = async () => {
    try {
const res = await fetch(`${ApiUrlKey}/api/licenses/expiring?page=0&size=100`);
const data = await res.json();
      console.log(" 라이선스 불러오기 성공:", data.content);
setLicenses(data.content); // Page object의 content만 추출
    } catch (error) {
      console.error("❌ 라이선스 불러오기 오류:", error);
    }
  };

  useEffect(() => {
    fetchLicenses();
  }, []);

  useEffect(() => {
    const searched = licenses.filter((l) =>
      [l.userName, l.userEmail, l.product, l.rawKey].some((field) =>
        field?.toLowerCase().includes(search.toLowerCase())
      )
    );
    setFiltered(searched);
    setCurrentPage(1);
  }, [search, licenses]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const allIds = paginated.map((l) => l.licenseId);
    const allSelected = allIds.every((id) => selectedIds.includes(id));
    setSelectedIds(
      allSelected
        ? selectedIds.filter((id) => !allIds.includes(id))
        : [...selectedIds, ...allIds.filter((id) => !selectedIds.includes(id))]
    );
  };

const handleSendReminder = async () => {
  const selectedItems = paginated.filter((l) => selectedIds.includes(l.licenseId));
  const selectedEmails = selectedItems.map((l) => l.userEmail);

  if (selectedEmails.length === 0) {
    alert("📭 선택된 항목이 없습니다.");
    return;
  }

  const confirmed = window.confirm(
    `📧 다음 이메일로 만료 알림 메일을 전송하시겠습니까?\n\n${selectedEmails.join(", ")}`
  );

  if (!confirmed) return;

  const payload = selectedItems.map((l) => ({
    email: l.userEmail,
    name: l.userName,
    expiresAt: l.expiresAt,
  }));

  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sendEmail`;

    const res = await fetch(
      selectedItems.length === 1
        ? `${apiUrl}/reminder/one`
        : `${apiUrl}/reminder`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedItems.length === 1 ? payload[0] : payload),
      }
    );

    if (res.ok) {
      alert("✅ 만료 알림 메일이 전송되었습니다.");
    } else {
      alert("❌ 메일 전송 실패");
    }
  } catch (err) {
    console.error("전송 실패:", err);
    alert("❌ 서버 오류로 메일 전송 실패");
  }
};

const formatLicenseKey = (key) => {
  if (!key) return "-";
  return key.match(/.{1,4}/g)?.join("-"); // 4자리씩 끊어서 '-' 삽입
};

  return (
    <AdminLayout>
      <h2>⏳ 만료 임박 라이선스</h2>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <Button variant="danger" onClick={handleSendReminder}>
          📤 만료 알림 전송
        </Button>
        <Form.Control
          style={{ width: "300px" }}
          placeholder="🔍 사용자명, 이메일, 제품명, 키 검색"
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
                  paginated.every((l) => selectedIds.includes(l.licenseId))
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
            <tr key={l.licenseId}>
              <td>
                <Form.Check
                  type="checkbox"
                  checked={selectedIds.includes(l.licenseId)}
                  onChange={() => toggleSelect(l.licenseId)}
                />
              </td>
              <td>{formatLicenseKey(l.rawKey)}</td>
              <td>{l.userName}</td>
              <td>{l.userEmail}</td>
              <td className="text-danger fw-bold">🔔 {l.expiresAt}</td>
              <td>
                <Badge
                  bg={
                    l.status === "ACTIVE"
                      ? "success"
                      : l.status === "EXPIRED"
                      ? "secondary"
                      : l.status === "TRIAL"
                      ? "info"
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
        <Pagination.Last
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    </AdminLayout>
  );
}
