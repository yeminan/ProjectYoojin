import React, { useState, useEffect } from "react";
import { Table, Form, Badge, Pagination } from "react-bootstrap";
import AdminLayout from "../../components/AdminLayout";
import { licenseDummyData } from "../data/licenseData";

export default function ExpiredLicensesPage() {
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const today = new Date();

    // ⬇️ 상태 자동 갱신: expiresAt < 오늘 → expired
    const updated = licenseDummyData.map((l) => {
      const exp = new Date(l.expiresAt);
      if (exp < today && l.status !== "expired") {
        return { ...l, status: "expired" };
      }
      return l;
    });

    // ⬇️ 만료된 데이터 필터링
    const expired = updated.filter((l) => new Date(l.expiresAt) < today);

    const searched = expired.filter((l) =>
      [l.user, l.email, l.product, l.key].some((field) =>
        field.toLowerCase().includes(search.toLowerCase())
      )
    );

    setFiltered(searched);
    setCurrentPage(1);
  }, [search]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <AdminLayout>
      <h2>❌ 만료된 라이선스 목록</h2>

      <Form.Control
        className="mb-3"
        placeholder="🔍 사용자, 이메일, 제품명, 키 검색"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Table striped bordered hover responsive>
        <thead>
          <tr>
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
              <td>{l.key}</td>
              <td>{l.user}</td>
              <td>{l.email}</td>
              <td className="text-danger fw-bold">⚠️ {l.expiresAt}</td>
              <td>
                <Badge
                  bg={
                    l.status === "expired"
                      ? "danger"
                      : l.status === "active"
                      ? "success"
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
