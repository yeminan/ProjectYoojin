import React, { useState, useEffect } from "react";
import { Table, Form, Badge, Pagination, Button } from "react-bootstrap";
import AdminLayout from "../../components/AdminLayout";
import { licenseDummyData } from "../data/licenseData";

export default function ActiveLicensesPage() {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const itemsPerPage = 10;

  // 초기 데이터 로딩
  useEffect(() => {
    const activeLicenses = licenseDummyData.filter((l) => l.status === "active");
    setData(activeLicenses);
  }, []);

  // 검색 필터링
  useEffect(() => {
    const searched = data.filter((l) =>
      [l.user, l.email, l.product, l.key].some((field) =>
        field.toLowerCase().includes(search.toLowerCase())
      )
    );
    setFiltered(searched);
    setCurrentPage(1);
  }, [search, data]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 체크박스 선택/해제
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // 전체 선택/해제
  const toggleSelectAll = () => {
    const allIds = paginated.map((l) => l.id);
    const isAllSelected = allIds.every((id) => selectedIds.includes(id));
    if (isAllSelected) {
      setSelectedIds((prev) => prev.filter((id) => !allIds.includes(id)));
    } else {
      setSelectedIds((prev) => [...new Set([...prev, ...allIds])]);
    }
  };

  // 선택 항목 비활성화 처리
  const handleDeactivate = () => {
    if (selectedIds.length === 0) {
      alert("선택된 항목이 없습니다.");
      return;
    }

    const confirmed = window.confirm("선택한 라이선스를 비활성화(만료) 상태로 변경하시겠습니까?");
    if (!confirmed) return;

    const updated = data.map((item) =>
      selectedIds.includes(item.id) ? { ...item, status: "expired" } : item
    );

    setData(updated);
    setSelectedIds([]);
    alert("선택된 라이선스가 만료 처리되었습니다.");
  };

  return (
    <AdminLayout>
      <h2>🟢 현재 사용 중인 라이선스 목록</h2>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <Button variant="danger" onClick={handleDeactivate}>
          ❌ 선택 항목 비활성화
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
              <td>{l.expiresAt}</td>
              <td>
                <Badge
                    bg={
                        l.status === "active"
                        ? "success"
                        : l.status === "expired"
                        ? "danger"
                        : "secondary"
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
