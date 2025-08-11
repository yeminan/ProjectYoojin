"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { Card, Row, Col, Spinner } from "react-bootstrap";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const ApiUrlKey = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    fetch(`${ApiUrlKey}/api/licenses/dashboard-summary`)
      .then((res) => res.json())
      .then((data) => {
        setSummary(data);
        setLoading(false);
        console.log("대시보드 데이터:", data);
      })
      .catch((err) => {
        console.error("대시보드 불러오기 실패:", err);
        setLoading(false);
      });
  }, [ApiUrlKey]); // ApiUrlKey를 의존성에 추가

  const active = summary.active || 0;
  const expired = summary.expired || 0;
  const expiring = summary.expiring || 0;
  const trial = summary.trial || 0;
  const total = active + expired + expiring + trial;

  const pieData = [
    { name: "사용중", value: active },
    { name: "만료예정", value: expiring },
    { name: "만료됨", value: expired },
    { name: "체험판", value: trial },
  ];

  const COLORS = ["#28a745", "#ffc107", "#dc3545", "#17a2b8"];

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center mt-5">
          <Spinner animation="border" />
          <p>라이선스 정보를 불러오는 중입니다...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h2 className="mb-4">라이선스 대시보드</h2>

   <Row className="mb-4">
  <Col md={2}>
    <Card className="p-3 text-center border-0 shadow-sm">
      <h6>사용중</h6>
      <h2 style={{ color: "#28a745" }}>{summary.active || 0}개</h2>
    </Card>
  </Col>
  <Col md={2}>
    <Card className="p-3 text-center border-0 shadow-sm">
      <h6>만료예정</h6>
      <h2 style={{ color: "#ffc107" }}>{summary.expiring || 0}개</h2>
    </Card>
  </Col>
  <Col md={2}>
    <Card className="p-3 text-center border-0 shadow-sm">
      <h6>만료</h6>
      <h2 style={{ color: "#dc3545" }}>{summary.expired || 0}개</h2>
    </Card>
  </Col>
  <Col md={2}>
    <Card className="p-3 text-center border-0 shadow-sm">
      <h6>체험판</h6>
      <h2 style={{ color: "#17a2b8" }}>{summary.trial || 0}개</h2>
    </Card>
  </Col>
</Row>

      <Row>
        <Col md={6} className="mx-auto">
          <Card className="p-4 shadow-sm border-0">
            <h5 className="text-center">라이선스 비율</h5>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </AdminLayout>
  );
}
