import React, { useState, useEffect } from "react";
import {
  Table,
  Form,
  Badge,
  Pagination,
  Button
} from "react-bootstrap";
import AdminLayout from "../../components/AdminLayout";
import TrialUserModal from "../../components/TrialUserModal";

export default function TrialUsersPage() {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({
    user: "",
    name: "",
    email: "",
    phone: "",
    organization: ""
  });

  const ApiUrlKey = process.env.NEXT_PUBLIC_API_BASE_URL;
  const itemsPerPage = 10;

  // ✅ trial 사용자 데이터 불러오기
  useEffect(() => {
    const fetchTrialUsers = async () => {
      try {
        const res = await fetch(`${ApiUrlKey}/api/licenses?demo=true&page=0&size=100`);
        const json = await res.json();
        if (!json.content || !Array.isArray(json.content)) {
          console.error("❌ 응답 형식이 잘못되었습니다.", json);
          return;
        }

        const formatted = json.content.map((l) => ({
          id: l.licenseId,
          key: l.rawKey?.replace(/(.{4})/g, "$1-").slice(0, -1) || "-",
          user: l.userName || "-",
          email: l.userEmail || "-",
          org: l.userOrg || "-",
          product: l.product || "체험판",
          issuedAt: l.issuedAt || "-",
          expiresAt: l.expiresAt || "-",
          status: l.status || "trial"
        }));

        setData(formatted);
      } catch (err) {
        console.error("🔴 trial 사용자 불러오기 실패", err);
      }
    };

    fetchTrialUsers();
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

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const allIds = paginated.map((l) => l.id);
    const isAllSelected = allIds.every((id) => selectedIds.includes(id));
    if (isAllSelected) {
      setSelectedIds((prev) => prev.filter((id) => !allIds.includes(id)));
    } else {
      setSelectedIds((prev) => [...new Set([...prev, ...allIds])]);
    }
  };

  return (
    <AdminLayout>
      <h2>🧪 체험판 사용자 목록</h2>

      <div className="d-flex justify-content-between align-items-center mb-3">
        {/* <Button variant="info" onClick={() => setShowModal(true)}>
          ➕ 체험판 사용자 추가
        </Button> */}

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
            <th>🏥 소속</th>
            <th>📧 이메일</th>
            <th>📅 발급일</th>
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
              <td>{l.org}</td>
              <td>{l.email}</td>
              <td>{l.issuedAt}</td>
              <td>{l.expiresAt}</td>
              <td>
              <Badge bg={l.status === "trial" || l.demo ? "warning" : "success"}>
                {l.status.toUpperCase()}
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

      <TrialUserModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={() => {}} // 구현 예정
        newUser={newUser}
        setNewUser={setNewUser}
      />
    </AdminLayout>
  );
}
