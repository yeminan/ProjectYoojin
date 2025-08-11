"use client";

import React, { useState, useEffect } from "react";
import { Table, Form, Badge, Pagination } from "react-bootstrap";
import AdminLayout from "../../components/AdminLayout";

export default function ExpiredLicensesPage() {
  const [licenses, setLicenses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const ApiUrlKey = process.env.NEXT_PUBLIC_API_BASE_URL;

  // 만료된 라이선스 불러오기 (expiresAt < 오늘)
  const fetchLicenses = async () => {
    try {
      const res = await fetch(`${ApiUrlKey}/api/licenses/expired?page=0&size=1000`);
      const data = await res.json();
      console.log("✅ 라이선스 불러오기 성공:", data);
      // Page 객체의 content 배열 추출 (만약 data.content이 undefined라면 빈 배열로 처리)
      setLicenses(Array.isArray(data.content) ? data.content : []);
    } catch (error) {
      console.error("❌ 만료된 라이선스 불러오기 오류:", error);
      setLicenses([]);
    }
  };

  useEffect(() => {
    fetchLicenses();
  }, []);

  // 검색 필터링
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
            <th>🏥 소속기관</th>
            <th>📅 만료일</th>
            <th>📌 상태</th>
          </tr>
        </thead>
        <tbody>
          {paginated.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">데이터가 없습니다.</td>
            </tr>
          ) : (
            paginated.map((l) => (
              <tr key={l.licenseId}>
                <td>{l.rawKey}</td>
                <td>{l.userName || "-"}</td>
                <td>{l.userEmail || "-"}</td>
                <td>{l.userOrg || "-"}</td>
                <td className="text-danger fw-bold">⚠️ {l.expiresAt}</td>
                <td>
                  <Badge bg="danger">만료</Badge>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      <Pagination className="justify-content-center">
        <Pagination.First
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
        />
        <Pagination.Prev
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        />
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
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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
