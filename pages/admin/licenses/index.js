"use client";

import React, { useState, useEffect } from "react";
import { Table, Button, Form, Badge, Pagination, Modal } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AdminLayout from "../../components/AdminLayout";

export default function Licenses() {
  const [licenses, setLicenses] = useState([]);
  const [page, setPage] = useState(0); // 0-based
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10); // 기존 고정값 제거

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("전체");
  const [unusedCount, setUnusedCount] = useState(0);


  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
  const maxVisiblePages = 5;
  const totalBlocks = Math.ceil(totalPages / maxVisiblePages);
  const currentBlock = Math.floor(page / maxVisiblePages);
  const startPage = currentBlock * maxVisiblePages;
  const endPage = Math.min(startPage + maxVisiblePages, totalPages);

useEffect(() => {
  const fetchLicenses = async () => {
    try {
      let url = `${API_BASE}/api/licenses?page=${page}&size=${pageSize}`;
      const cleanedSearch = search.trim().replace(/-/g, "");

      if (cleanedSearch.length > 0) {
        url += `&keyword=${encodeURIComponent(cleanedSearch)}`;
      }

      if (statusFilter === "active") {
        url += `&status=used`;
      } else if (statusFilter === "unused") {
        url += `&status=unused`;
      }

      const res = await fetch(url);
      const data = await res.json();
      setLicenses(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("라이선스 데이터 불러오기 실패", err);
    }
  };

  const fetchUnusedCount = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/licenses/count_unused`);
      const count = await res.json();
      setUnusedCount(count);
    } catch (err) {
      console.error("미사용 라이선스 수 불러오기 실패", err);
    }
  };
  fetchUnusedCount(); // ✅ 추가
  fetchLicenses();
}, [page, search, pageSize,statusFilter]);


const filteredLicenses = licenses.filter((license) => {
  const matchesSearch =
    license.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    license.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
    license.rawKey.toLowerCase().includes(search.toLowerCase()) ||
    license.product?.toLowerCase().includes(search.toLowerCase());

  const matchesStatus =
    statusFilter === "전체" ||
    (statusFilter === "active" && license.status === "used") ||
    (statusFilter === "unused" && license.status === "unused");

  return matchesSearch && matchesStatus;
});


  return (
    <AdminLayout>
      <h2>🔑 라이선스 잔여 갯수 ({unusedCount}개)</h2>

      <div className="d-flex mb-3 gap-2">
        <Form.Select
          style={{ width: "300px" }}
          value={pageSize}
          onChange={(e) => {
            setPageSize(parseInt(e.target.value)); // 페이지 사이즈 변경
            setPage(0); // 첫 페이지로 이동
          }}
        >
          <option value="10">10</option>
          <option value="30">30</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </Form.Select>
        <Form.Control
          type="text"
          placeholder="🔍 사용자, 이메일, 제품명, 라이선스 키 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
<Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
  <option value="전체">전체</option>
  <option value="active">사용중</option>
  <option value="unused">미사용중</option>
</Form.Select>
      </div>

      <Table striped bordered hover responsive="lg" className="align-middle text-center">
        <thead>
          <tr>
            <th>No</th> {/* 👈 라이선스 번호 */}
            <th>라이선스 키</th>
            <th>발급일</th>
            <th>만료일</th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody>
          {filteredLicenses.map((license, index) => (
            <tr key={license.licenseId}>
              {/* ✅ 사용자가 보는 번호 */}
              <td>{page * pageSize + index + 1}</td> 
              <td hidden>{license.licenseId}</td>
              <td>{license.rawKey.replace(/(.{4})/g, "$1-").slice(0, -1)}</td>
              <td>{license.issuedAt || "-"}</td>
              <td>{license.expiresAt || "-"}</td>
              <td>
              <Badge bg={
                license.status === "used" ? "success" :
                license.status === "unused" ? "secondary" :
                "warning"
              }>
                {license.status === "used" ? "사용중" :
                license.status === "unused" ? "미사용중" :
                license.status}
              </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination className="justify-content-center">
        <Pagination.Prev onClick={() => setPage(Math.max(0, startPage - 1))} disabled={page === 0} />
        {Array.from({ length: endPage - startPage }, (_, i) => startPage + i).map((p) => (
          <Pagination.Item key={p} active={p === page} onClick={() => setPage(p)}>{p + 1}</Pagination.Item>
        ))}
        <Pagination.Next onClick={() => setPage(Math.min(totalPages - 1, endPage))} disabled={page >= totalPages - 1} />
      </Pagination>

    </AdminLayout>
  );
}
