import React, { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { Card, Row, Col } from "react-bootstrap";

export default function Dashboard() {
  const [users, setUsers] = useState([]); // 사용자 데이터 저장

  // API에서 사용자 데이터 가져오기
  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  // 사용자 상태별 개수 계산
  const totalUsers = users.length;
  const activeUsers = users.filter((user) => user.status === "활성").length;
  const inactiveUsers = users.filter((user) => user.status === "정지").length;
  return (
    
    <AdminLayout>
      <h2>📊 대시보드</h2>
      <Row>
        {/* 총 사용자 수 */}
        <Col md={4}>
          <Card className="p-3 text-center">
            <h5>총 사용자 수</h5>
            <h2>{totalUsers}명</h2>
          </Card>
        </Col>

        {/* 활성 사용자 수 */}
        <Col md={4}>
          <Card className="p-3 text-center">
            <h5>✅ 활성 사용자</h5>
            <h2 style={{ color: "green" }}>{activeUsers}명</h2>
          </Card>
        </Col>

        {/* 정지된 사용자 수 */}
        <Col md={4}>
          <Card className="p-3 text-center">
            <h5>❌ 정지된 사용자</h5>
            <h2 style={{ color: "red" }}>{inactiveUsers}명</h2>
          </Card>
        </Col>
      </Row>
    </AdminLayout>
  );
}
