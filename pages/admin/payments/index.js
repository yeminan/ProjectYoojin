import React, { useState, useEffect } from "react";
import { Table, Button, Form, Pagination, Modal, Row, Col } from "react-bootstrap";
import Draggable from "react-draggable";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AdminLayout from "../../components/AdminLayout";
import HospitalSearchModal from "../../components/HospitalSearchModal";
import PaymentDetails from "./details"; // 결제 내역 보기 팝업 유지

export default function Payments() {
  const [search, setSearch] = useState(""); // 검색어 상태
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null); // 체크된 결제 내역 ID 저장
  const [showHospitalModal, setShowHospitalModal] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);
  // 🔹 기존 결제 내역 더미 데이터
  const [paymentsData, setPaymentsData] = useState([
    { id: 1, phone: "010-1234-5678", serial: "1234-4567-7890-1201", program: "프로그램 A", userId: "user001", payer: "홍길동", org: "회사1", email: "user001@email.com", date: "2024-03-20", amount: "₩100,000" },
    { id: 2, phone: "010-8765-4321", serial: "1234-4567-7890-1202", program: "프로그램 B", userId: "user002", payer: "김철수", org: "회사2", email: "user002@email.com", date: "2024-03-21", amount: "₩200,000" },
    { id: 3, phone: "010-5555-6666", serial: "1234-4567-7890-1203", program: "프로그램 C", userId: "user003", payer: "이영희", org: "회사3", email: "user003@email.com", date: "2024-03-22", amount: "₩300,000" },
  ]);

  // totalPages 자동 계산
  const totalPages = Math.ceil(paymentsData.length / itemsPerPage);

  // 현재 페이지에 해당하는 데이터 가져오기
  const paginatedPayments = paymentsData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // 데이터 추가 후 현재 페이지 업데이트
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1);
    }
  }, [paymentsData, totalPages, currentPage]);

  // 결제 내역 추가 모달 상태
  const [showModal, setShowModal] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState({
    userId: "",
    name: "",
    phoneFirst: "",
    phoneMiddle: "",
    phoneLast: "",
    paymentDate: new Date(),
    amount: "",
    email: "",
    memo: "",
    org: "",         // 🔹 소속
    program: "",     // 🔹 프로그램
  });
  

  // 체크박스 선택 핸들러 (한 번에 하나만 선택 가능)
  const handleSelectPayment = (id) => {
    setSelectedPaymentId((prevId) => (prevId === id ? null : id)); // 이미 선택된 경우 해제
  };

  // 🔍 돋보기 버튼 클릭 시 결제 내역 상세 보기
  const handleViewDetails = (id) => {
    if (selectedPaymentId !== id) return; // 체크되지 않은 행의 버튼은 무반응
    const selectedData = paymentsData.find((payment) => payment.id === id);
    setSelectedPayment(selectedData);
    setShowDetailModal(true);
  };

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;

    // 전화번호 필드 업데이트
    if (name === "phoneFirst" || name === "phoneMiddle" || name === "phoneLast") {
      setPaymentInfo({ ...paymentInfo, [name]: value });
    } else {
      setPaymentInfo({ ...paymentInfo, [name]: value });
    }
  };

  // 결제일자 선택 핸들러
  const handleDateChange = (date) => {
    setPaymentInfo({ ...paymentInfo, paymentDate: date });
  };

  // 🔹 시리얼 넘버 자동 증가 함수
  const generateSerialNumber = () => {
    if (paymentsData.length === 0) {
      return "1234-4567-7890-1201"; // 기본값
    }

    // 가장 마지막 데이터의 시리얼 넘버 찾기
    const lastSerial = paymentsData[paymentsData.length - 1].serial;
    const serialParts = lastSerial.split("-"); // "1234-4567-7890-1203" → ["1234", "4567", "7890", "1203"]

    // 마지막 4자리 숫자 증가
    const lastNumber = parseInt(serialParts[3], 10) + 1;
    serialParts[3] = lastNumber.toString().padStart(4, "0"); // 4자리 유지

    return serialParts.join("-"); // "1234-4567-7890-1204"
  };

  const handleAddPayment = () => {
    const formattedPhone = `${paymentInfo.phoneFirst}-${paymentInfo.phoneMiddle}-${paymentInfo.phoneLast}`;
  
    const newEntry = {
      id: paymentsData.length + 1,
      phone: formattedPhone,
      serial: generateSerialNumber(),
      program: paymentInfo.program || "프로그램 미선택", // 선택값 적용
      userId: paymentInfo.userId,
      payer: paymentInfo.name,
      org: paymentInfo.org || "미입력", // 입력값 적용
      email: paymentInfo.email,
      date: paymentInfo.paymentDate.toISOString().split("T")[0],
      amount: paymentInfo.amount ? paymentInfo.amount.replace(/[^\d]/g, "") : "0",
    };
    
  
    setPaymentsData((prevData) => [...prevData, newEntry]);
    setCurrentPage(Math.ceil((paymentsData.length + 1) / itemsPerPage));
  
    setPaymentInfo({
      userId: "",
      name: "",
      phoneFirst: "",
      phoneMiddle: "",
      phoneLast: "",
      paymentDate: new Date(),
      amount: "",
      email: "",
      memo: "",
    });
  
    setShowModal(false);
  };
  
  // 금액 입력 핸들러 (₩ 자동 추가)
  const handleAmountChange = (e) => {
    const rawValue = e.target.value.replace(/[^\d]/g, ""); // 숫자만 남기기
    setPaymentInfo({ ...paymentInfo, amount: rawValue });
  };

  return (
    <AdminLayout>
      <h2>💳 결제 내역</h2>

      {/* 결제 내역 추가 버튼 */}
      <Button variant="primary" className="mb-3" onClick={() => setShowModal(true)}>
        ➕ 결제 내역 추가
      </Button>

      {/* 결제 내역 테이블 */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>✅</th>
            <th>🔍</th>
            <th>📞 전화번호</th>
            <th>🔢 시리얼번호</th>
            <th>🖥️ 프로그램명</th>
            <th>👤 아이디</th>
            <th>🏦 결제자</th>
            <th>🏢 소속</th>
            <th>📧 이메일</th>
            <th>📅 결제일</th>
            <th>💰 금액</th>
          </tr>
        </thead>
        <tbody>
          {paginatedPayments.map((payment) => (
            <tr key={payment.id}>
              <td>
                <Form.Check
                  type="checkbox"
                  checked={selectedPaymentId === payment.id}
                  onChange={() => handleSelectPayment(payment.id)}
                />
              </td>
              <td>
                <Button variant="info" size="sm" disabled={selectedPaymentId !== payment.id} onClick={() => handleViewDetails(payment.id)}>
                  🔍
                </Button>
              </td>
              <td>{payment.phone}</td>
              <td>{payment.serial}</td>
              <td>{payment.program}</td>
              <td>{payment.userId}</td>
              <td>{payment.payer}</td>
              <td>{payment.org}</td>
              <td>{payment.email}</td>
              <td>{payment.date}</td>
              {/* 💰 금액 앞에 ₩ 추가 (기존 및 새 데이터 모두 적용) */}
                <td>
                {payment.amount 
                    ? `₩${Number(payment.amount.toString().replace(/[^\d]/g, "")).toLocaleString()}`
                    : "₩0"}
                </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* ✅ 결제 내역 상세 보기 팝업 (기존 기능 유지) */}
      <PaymentDetails show={showDetailModal} handleClose={() => setShowDetailModal(false)} paymentData={selectedPayment} />

      {/* 결제 내역 추가 모달 */}
      <Modal
  show={showModal}
  onHide={() => setShowModal(false)}
  backdrop="static"
  keyboard={false}
  size="lg"   // ✅ 여기
>

        <div className="modal-dialog">
          <Draggable handle=".modal-header">
            <div className="modal-content">
              <Modal.Header closeButton className="cursor-move">
                <Modal.Title>➕ 결제 내역 추가</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-2">
                        <Form.Label>🖥️ 프로그램 선택</Form.Label>
                        <Form.Select name="program" value={paymentInfo.program} onChange={handleChange}>
                          <option value="">-- 선택하세요 --</option>
                          <option value="프로그램 A">프로그램 A</option>
                          <option value="프로그램 B">프로그램 B</option>
                          <option value="프로그램 C">프로그램 C</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-2">
                        <Form.Label>👤 아이디</Form.Label>
                        <Form.Control type="text" name="userId" value={paymentInfo.userId} onChange={handleChange} />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-2">
                        <Form.Label>📝 이름</Form.Label>
                        <Form.Control type="text" name="name" value={paymentInfo.name} onChange={handleChange} />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-2">
                        <Form.Label>📞 전화번호</Form.Label>
                        <div className="d-flex gap-2">
                          <Form.Control type="text" maxLength="3" name="phoneFirst" value={paymentInfo.phoneFirst} onChange={handleChange} placeholder="010" />
                          <Form.Control type="text" maxLength="4" name="phoneMiddle" value={paymentInfo.phoneMiddle} onChange={handleChange} placeholder="1234" />
                          <Form.Control type="text" maxLength="4" name="phoneLast" value={paymentInfo.phoneLast} onChange={handleChange} placeholder="5678" />
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-2">
                        <Form.Label>🏢 소속 병원</Form.Label>
                        <div className="d-flex">
                          <Form.Control
                            type="text"
                            name="org"
                            value={paymentInfo.org}
                            onChange={handleChange}
                            placeholder="병원명 입력"
                          />
                          <Button variant="outline-secondary" onClick={() => setShowHospitalModal(true)}>
                            🔍
                          </Button>
                        </div>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-2">
                        <Form.Label>📅 결제일자</Form.Label>
                        <DatePicker selected={paymentInfo.paymentDate} onChange={handleDateChange} dateFormat="yyyy-MM-dd" className="form-control" />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Label>📅 사용 기간 선택</Form.Label>
                  <div className="d-flex gap-3 mb-2">
                    <Form.Check type="radio" name="duration" label="1년 (₩1,200,000)" onChange={() => setPaymentInfo({ ...paymentInfo, amount: "1200000" })} />
                    <Form.Check type="radio" name="duration" label="6개월 (₩800,000)" onChange={() => setPaymentInfo({ ...paymentInfo, amount: "800000" })} />
                    <Form.Check type="radio" name="duration" label="3개월 (₩600,000)" onChange={() => setPaymentInfo({ ...paymentInfo, amount: "600000" })} />
                    <Form.Check type="radio" name="duration" label="1개월 (데모)" onChange={() => setPaymentInfo({ ...paymentInfo, amount: "0" })} />
                  </div>

                  <Form.Group className="mb-2">
                    <Form.Label>💰 금액</Form.Label>
                    <Form.Control type="text" name="amount" value={paymentInfo.amount ? `₩${Number(paymentInfo.amount).toLocaleString()}` : ""} onChange={handleAmountChange} />
                  </Form.Group>

                  <Form.Group className="mb-2">
                    <Form.Label>📧 이메일</Form.Label>
                    <Form.Control type="email" name="email" value={paymentInfo.email} onChange={handleChange} />
                  </Form.Group>

                  <Form.Group className="mb-2">
                    <Form.Label>📝 메모</Form.Label>
                    <Form.Control as="textarea" name="memo" value={paymentInfo.memo} onChange={handleChange} />
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>닫기</Button>
                <Button variant="primary" onClick={handleAddPayment}>추가</Button>
              </Modal.Footer>
            </div>
          </Draggable>
        </div>
      </Modal>
      <HospitalSearchModal
  show={showHospitalModal}
  onHide={() => setShowHospitalModal(false)}
  onClose={() => setShowHospitalModal(false)}
  onSelect={(hospital) => {
    setPaymentInfo((prev) => ({ ...prev, org: hospital.yadmNm }));
    setShowHospitalModal(false);
  }}
  dialogClassName="hospital-search-modal" // <-- 그대로 유지
/>





    </AdminLayout>
  );
}
