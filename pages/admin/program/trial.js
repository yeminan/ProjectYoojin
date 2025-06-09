import React, { useState, useEffect } from "react";
import {
  Table,
  Form,
  Badge,
  Pagination,
  Button,
  Modal
} from "react-bootstrap";
import AdminLayout from "../../components/AdminLayout";
import { licenseDummyData } from "../data/licenseData";
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

  const itemsPerPage = 10;

  // 초기 로딩
  useEffect(() => {
    const demoUsers = licenseDummyData.filter((l) => l.demo === true);
    setData(demoUsers);
  }, []);

  // 검색
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
  const generateLicenseKey = (existingKeys) => {
    const randomPart = () =>
      Math.random().toString(36).substring(2, 6).toUpperCase(); // 4자리
  
    let newKey;
    do {
      newKey = `TRIA-${randomPart()}-${randomPart()}-${randomPart()}`;
    } while (existingKeys.includes(newKey)); // 중복되면 다시 생성
  
    return newKey;
  };
  
  
  const handleAddTrialUser = () => {
    const { user, name, email, phone, organization } = newUser;
    if (!user || !name || !email || !phone || !organization) {
      alert("모든 항목을 입력해주세요.");
      return;
    }
  
    const confirmed = window.confirm(
      `체험판 사용자를 추가하시겠습니까?\n\n※ 기간은 30일입니다`
    );
    if (!confirmed) return;
  
    const today = new Date();
    const expires = new Date();
    expires.setDate(today.getDate() + 30);
  
    const existingKeys = data.map((d) => d.key);
    const newKey = generateLicenseKey(existingKeys); // ✅ 중복 체크 포함
  
    const newEntry = {
      id: data.length + 100,
      key: newKey,
      user: newUser.user,
      email: newUser.email,
      product: "체험판",
      issuedAt: today.toISOString().split("T")[0],
      expiresAt: expires.toISOString().split("T")[0],
      deviceInfo: `${newUser.organization} | 전화번호: ${newUser.phone}`,
      status: "active",
      demo: true
    };
  
    setData((prev) => [...prev, newEntry]);
    setShowModal(false);
    setNewUser({
      user: "",
      name: "",
      email: "",
      phone: "",
      organization: ""
    });
    alert("체험판 사용자가 추가되었습니다.");
  };
  
  return (
    <AdminLayout>
      <h2>🧪 체험판 사용자 목록</h2>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <Button variant="info" onClick={() => setShowModal(true)}>
          ➕ 체험판 사용자 추가
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
            <th>🧪 체험판</th>
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
                <Badge bg="info">DEMO</Badge>
              </td>
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
      <TrialUserModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleAddTrialUser}
        newUser={newUser}
        setNewUser={setNewUser}
        />

    </AdminLayout>
  );
}
