import React, { useState, useEffect } from "react"; // ✅ useEffect 추가됨
import AdminLayout from "../components/AdminLayout";
import { Table, Form, Button, Pagination, Modal } from "react-bootstrap";
import { ko } from "date-fns/locale";
import DatePicker from "react-datepicker"; // 날짜 선택기 라이브러리
import "react-datepicker/dist/react-datepicker.css";

export default function Users() {
  const [users, setUsers] = useState([]); // ✅ 추가
  const [search, setSearch] = useState("");

// DB발급하기
  const [assignCount, setAssignCount] = useState(1);
  const [showLicenseModal, setShowLicenseModal] = useState(false);

  // 정보상세보기에서 수정 state
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPwd, setEditPwd] = useState("");
  const [editOrg, setEditOrg] = useState("");
  const [statusFilter, setStatusFilter] = useState("전체"); // 필터 상태 관리
  const [selectedUser, setSelectedUser] = useState(null); // 선택된 사용자
  const [showReadModal, setShowReadModal] = useState(false); // 상세보기용
  const [showEditModal, setShowEditModal] = useState(false); // 수정용
  const [showPassword, setShowPassword] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false); // 서비스 날짜 변경 모달
  const [selectedStartDate, setSelectedStartDate] = useState(new Date()); // 시작일
  const [selectedEndDate, setSelectedEndDate] = useState(new Date()); // 종료일
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const itemsPerPage = 10; // 한 페이지당 표시할 개수
  // 활성된사람들을 체크했을땐 버튼 비활성
  const [canAssignLicense, setCanAssignLicense] = useState(false); // 라이선스 부여 가능 여부

  // api 키
  const ApiUrlKey = process.env.NEXT_PUBLIC_API_BASE_URL;

  // 키 부여 State
    const [assignForm, setAssignForm] = useState({
    name: "",
    email: "",
    licenseKey: "",
    type: "regular",
    issuedAt: new Date(),
    expiresAt: new Date(),
  });
  // 키부여 스크립트 
    // 선택한 사용자 기준으로 모달 초기화 및 열기
    const handleOpenAssignModal = async () => {
    const userInfo = users.find((u) => u.id === selectedUser);
    if (!userInfo) return;

  // ✅ 서버에서 다음 사용 가능한 라이선스 키를 가져오기
    const res = await fetch(`${ApiUrlKey}/api/licenses/next_license_key`);
    const nextKey = await res.text();

    setAssignForm({
      name: userInfo.name,
      email: userInfo.email,
      org : userInfo.org,
      licenseKey: nextKey,
      type: "regular",
      issuedAt: new Date(),
      expiresAt: new Date(),
    });
    setShowLicenseModal(true);
  };

const handleLicenseFormChange = (e) => {
  const { name, value } = e.target;
  let newExpiresAt = new Date(assignForm.issuedAt);

  if (name === "type") {
    if (value === "1year") {
      newExpiresAt.setFullYear(newExpiresAt.getFullYear() + 1);
    } else if (value === "6months") {
      newExpiresAt.setMonth(newExpiresAt.getMonth() + 6);
    } else if (value === "30days") {
      newExpiresAt.setDate(newExpiresAt.getDate() + 30);
    }
  }

  setAssignForm((prev) => ({
    ...prev,
    [name]: value,
    ...(name === "type" && { expiresAt: newExpiresAt }),
  }));
};


  // 실제 라이선스 발급 API 호출
  const handleLicenseSubmit = async () => {
    if (!selectedUser) return;

    let licenseType = assignForm.type;

    // 변환 로직 추가
    if (licenseType === "30days") {
      licenseType = "trial"; // 백엔드에서 처리할 값
    } else {
      licenseType = "regular";
    }

    const payload = {
      userId: selectedUser,
      type: assignForm.type,
      issuedAt: assignForm.issuedAt.toISOString().split("T")[0],
      expiresAt: assignForm.expiresAt.toISOString().split("T")[0],
    };

    try {
      const res = await fetch(`${ApiUrlKey}/api/licenses/License_to_user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("✅ 라이선스가 부여되었습니다.");
        setShowLicenseModal(false);
      } else {
        alert("❌ 라이선스 부여 실패");
      }
    } catch (err) {
      console.error("❌ 에러 발생:", err);
      alert("서버 오류 발생");
    }
  };


  // ✅ 사용자 데이터 API에서 불러오기 (최초 1회 실행)
  useEffect(() => {
    fetch(`${ApiUrlKey}/api/users`) // 서버 IP에 맞게 변경
      .then((res) => res.json())
      .then((data) => {
        const formattedUsers = data.map((user) => ({
          id: user.userId,
          loginId: user.loginId,
          name: user.name,
          phone : user.phone,
          email: user.email,
          org: user.org,
          status: convertStatusLabel(user.status),
          originalStatus: user.status, // 꼭 있어야 합니다
          startDate: user.svcStart ? user.svcStart.split("T")[0] : "",
          endDate: user.svcEnd ? user.svcEnd.split("T")[0] : "",
          deviceId: user.deviceId,
          machineId: user.machineId,
          createdAt: user.createdAt ? user.createdAt.split("T")[0] : "",
        }));
        setUsers(formattedUsers);
      })
      .catch((err) => console.error("유저 목록 불러오기 실패:", err));
  }, []);


  // ✅ 상태 변환 함수 추가
const convertStatusLabel = (status) => {
  switch (status) {
    case "ACTIVE":
      return "활성";
    case "TRIAL":
      return "체험판";
    case "EXPIRED":
      return "만료";
    case "INACTIVE":
    case "SUSPENDED":
      return "미사용";
    default:
      return "알 수 없음";
  }
};

  // 검색 + 필터링 적용된 사용자 목록
const filteredUsers = users.filter((user) => {
  const matchesStatus =
    statusFilter === "전체" ||
    (statusFilter === "활성" && user.originalStatus === "ACTIVE") ||
    (statusFilter === "체험판" && user.originalStatus === "TRIAL") ||
    (statusFilter === "만료" && user.originalStatus === "EXPIRED") ||
    (statusFilter === "미사용" &&
      ["INACTIVE", "SUSPENDED"].includes(user.originalStatus));

  const matchesSearch =
    user.name.includes(search) || user.email.includes(search);

  return matchesStatus && matchesSearch;
});

  // 페이징 처리된 데이터 가져오기
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 체크박스 선택 처리
  const handleSelectUser = (userId) => {
    const isSame = userId === selectedUser;
    const newSelectedUser = isSame ? null : userId;
    setSelectedUser(newSelectedUser);

    if (!isSame) {
      const selected = users.find((u) => u.id === userId);
      const disallowedStatuses = ["ACTIVE", "TRIAL", "EXPIRED"];
      const assignable = selected && !disallowedStatuses.includes(selected.originalStatus);
      setCanAssignLicense(assignable);
    } else {
      setCanAssignLicense(false); // 선택 해제 시
    }
  };
  // 선택된 사용자 정보 가져오기
  const selectedUserInfo = users.find((user) => user.id === selectedUser);


  const handleShowDetailModal = () => {
    if (selectedUserInfo) {
      setEditName(selectedUserInfo.name);
      setEditEmail(selectedUserInfo.email);
      setEditOrg(selectedUserInfo.org);
      setEditPhone(selectedUserInfo.phone);
      setEditPwd(""); // 비밀번호는 초기값 비움 (보안상 기존 비번은 보여주지 않음)
      setShowEditModal(true); // ✅ 수정 모달 열기
    }
  };


  // 상세보기 모달 닫기
  const handleCloseDetailModal = () => {
    setShowReadModal(false); // ✅ 함수 이름 제대로 호출
    setShowEditModal(false); // ✅ 수정 모달 닫기
  };


  // 서비스 날짜 변경 모달 열기
  const handleShowDateModal = () => {
    if (selectedUserInfo) {
      setSelectedStartDate(selectedUserInfo.startDate ? new Date(selectedUserInfo.startDate) : new Date());
      setSelectedEndDate(selectedUserInfo.endDate ? new Date(selectedUserInfo.endDate) : new Date());
      setShowDateModal(true);
    }
  };

  // 서비스 날짜 변경 처리
const handleChangeDate = () => {
  if (!selectedUser) return;

  // 종료일이 시작일보다 빠른 경우 방지
  if (selectedEndDate <= selectedStartDate ) {
    alert("❗ 종료일은 시작일 이후여야 합니다.");
    return;
  }
const changedBy = selectedUserInfo?.name || "관리자"; // ✅ 이름을 기록

  const payload = {
    userId: selectedUser,
    svcStart: selectedStartDate.toISOString().split("T")[0],
    svcEnd: selectedEndDate.toISOString().split("T")[0],
    changedBy : changedBy,
  };

  fetch(`${ApiUrlKey}/api/users/updateDateLog`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((res) => {
      if (!res.ok) throw new Error("업데이트 실패");
      return res.json();
    })
    .then(() => {
      alert("✅ 서비스 날짜가 변경되었습니다.");

      // 로컬 상태 업데이트
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === selectedUser
            ? {
                ...user,
                startDate: payload.svcStart,
                endDate: payload.svcEnd,
              }
            : user
        )
      );

      setShowDateModal(false);
    })
    .catch((err) => {
      console.error(err);
      alert("❌ 서비스 날짜 변경 실패");
    });
};

  const handleSaveUserChanges = () => {
    if (!editPwd || editPwd.trim() === "") {
      alert("비밀번호를 입력해야 저장할 수 있습니다.");
      return; // 저장 요청 진행하지 않음
    }
    // ✅ 재확인 추가
    const isConfirmed = window.confirm("정말로 회원정보를 변경하시겠습니까?");
    if (!isConfirmed) {
      // 사용자가 취소했으면 저장 진행 안함
      return;
    }
    const updatedUser = {
      userId: selectedUserInfo.id,
      name: editName,
      phone : editPhone,
      email: editEmail,
      pwd: editPwd, // 비밀번호 입력 값 (비어있으면 변경 X)
      org: editOrg,
    };

    fetch(`${ApiUrlKey}/api/users/updateYoojin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUser),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("업데이트 실패");
        }
        return res.json();
      })
      .then((data) => {
        alert("✅ 회원정보가 수정되었습니다.");

        // 화면 데이터 업데이트 반영
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === data.userId
              ? {
                  ...user,
                  name: data.name,
                  phone: data.phone,
                  email: data.email,
                  org: data.org,
                  // 비밀번호는 표시 X
                }
              : user
          )
        );

        setShowEditModal(false);
      })
      .catch((err) => {
        console.error(err);
        alert("서버와의 통신에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
      });
  };


  return (
    <AdminLayout>
      <h2>사용자 관리</h2>

      {/* 회원정보 상세보기 & 서비스 날짜 변경 버튼 */}
      <div className="d-flex gap-2 mb-3">
        <Button variant="primary" disabled={!selectedUser} onClick={() => setShowReadModal(true)}>
          회원정보 상세보기
        </Button>
        <Button variant="warning" disabled={!selectedUser} onClick={handleShowDateModal}>
          서비스 날짜 변경
        </Button>
        <Button variant="primary" disabled={!selectedUser || !canAssignLicense} onClick={handleOpenAssignModal}>
          라이선스 키 부여
        </Button>
      </div>

      {/* 검색 및 필터 */}
      <div className="d-flex mb-3">
        <Form.Control
          type="text"
          placeholder="🔍 이름 또는 이메일 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="me-2"
        />
<Form.Select
  value={statusFilter}
  onChange={(e) => setStatusFilter(e.target.value)}
>
  <option value="전체">전체</option>
  <option value="활성">활성</option>
  <option value="체험판">체험판</option>
  <option value="만료">만료</option>
  <option value="미사용">미사용</option>
</Form.Select>
      </div>

      {/* 테이블 */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>V</th>
            <th>ID</th>
            <th>이름</th>
            <th>전화번호</th>
            <th>이메일</th>
            <th>소속</th>
            <th>상태</th>
            <th>디바이스ID</th>
            <th>시스템ID</th>
            <th>가입일</th>
            <th>관리</th>
          </tr>
        </thead>

        <tbody>
          {paginatedUsers.map((user) => (
            <tr key={user.id}>
              <td>
                <Form.Check
                  type="checkbox"
                  checked={user.id === selectedUser}
                  onChange={() => handleSelectUser(user.id)}
                />
              </td>
              <td>{user.loginId}</td>
              <td>{user.name}</td>
              <td>{user.phone}</td>
              <td>{user.email}</td>
              <td>{user.org}</td>
              <td>{user.status}</td>
              <td>{user.deviceId}</td>
              <td>{user.machineId}</td>
              <td>{user.createdAt}</td>
              <td>
                <Button variant="warning" size="sm" disabled={!selectedUser} onClick={handleShowDetailModal} >
                  수정
                </Button>
              </td>
            </tr>
          ))}
        </tbody>

      </Table>

      {/* 페이지네이션 */}
      <Pagination className="justify-content-center">
        <Pagination.First
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
        />
        <Pagination.Prev
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        />
        {[...Array(totalPages)].map((_, index) => (
          <Pagination.Item
            key={index + 1}
            active={index + 1 === currentPage}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
        <Pagination.Last
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
        />
      </Pagination>

      {/* 회원정보 상세보기 모달 */}
<Modal 
  show={showReadModal} 
  onHide={() => setShowReadModal(false)}
  backdrop="static" 
  keyboard={false}
>
  <Modal.Header closeButton>
    <Modal.Title>회원정보 상세보기</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {selectedUserInfo && (
      <div className="px-2">
        {[
          { label: "이름", value: selectedUserInfo.name },
          { label: "이메일", value: selectedUserInfo.email },
          { label: "비밀번호", value: "********" },
          { label: "전화번호", value: selectedUserInfo.phone },
          { label: "소속", value: selectedUserInfo.org },
          { label: "가입일", value: selectedUserInfo.createdAt },
          { label: "서비스 시작일 ", value: selectedUserInfo.startDate || "-" },
          { label: "서비스 종료일 ", value: selectedUserInfo.endDate || "-" },
          { label: "Device ID", value: selectedUserInfo.deviceId || "-" },
          { label: "Machine ID", value: selectedUserInfo.machineId || "-" },
        ].map((field, idx) => (
          <div className="d-flex mb-3" key={idx}>
            <div className="fw-bold me-3" style={{ width: "160px" }}>{field.label}</div>
            <div className="text-secondary flex-grow-1 border-bottom pb-1">{field.value}</div>
          </div>
        ))}
      </div>
    )}
  </Modal.Body>
  <Modal.Footer>
    {/* <Button variant="primary" onClick={handleSaveUserChanges}>
      저장
    </Button> */}
    <Button variant="secondary" onClick={handleCloseDetailModal}>닫기</Button>
  </Modal.Footer>
</Modal>


{/* 회원정보 수정 모달 폼 */}
<Modal 
  show={showEditModal} 
  onHide={handleCloseDetailModal} 
  backdrop="static" 
  keyboard={false}
>
  <Modal.Header closeButton>
    <Modal.Title>비밀번호 변경</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {selectedUserInfo && (
      <div className="px-2">
        {/* 사용자 정보 간략히 표시 (이름 + 이메일 정도만) */}
        <div className="d-flex mb-3">
          <div className="fw-bold me-3" style={{ width: "160px" }}>이름</div>
          <div className="text-secondary flex-grow-1 border-bottom pb-1">{selectedUserInfo.name}</div>
        </div>
        <div className="d-flex mb-4">
          <div className="fw-bold me-3" style={{ width: "160px" }}>이메일</div>
          <div className="text-secondary flex-grow-1 border-bottom pb-1">{selectedUserInfo.email}</div>
        </div>

        {/* 비밀번호 입력 필드 */}
        <Form.Group>
          <Form.Label>새 비밀번호</Form.Label>
          <div className="d-flex align-items-center">
            <Form.Control
              type={showPassword ? "text" : "password"}
              value={editPwd}
              onChange={(e) => setEditPwd(e.target.value)}
              placeholder="새 비밀번호를 입력하세요"
            />
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => setShowPassword((prev) => !prev)}
              className="ms-2 px-2" // ✅ 버튼 너비 확보
              style={{ whiteSpace: "nowrap" }} // ✅ 줄바꿈 방지
            >
              {showPassword ? "숨기기" : "보기"}
            </Button>
          </div>
          <Form.Group className="mb-3">
            <Form.Label>소속</Form.Label>
            <Form.Control
              type="text"
              placeholder="소속을 입력하세요"
              value={editOrg}
              onChange={(e) => setEditOrg(e.target.value)}
            />
          </Form.Group>
          <Form.Text className="text-muted">
            보안을 위해 비밀번호를 확인한 후 저장하세요.
          </Form.Text>
        </Form.Group>
      </div>
    )}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowEditModal(false)}>취소</Button>
    <Button
      variant="primary"
      onClick={() => {
        handleSaveUserChanges(); // 실제 저장 함수 호출      
      }}    
    >
      저장
    </Button>
  </Modal.Footer>
</Modal>

      {/* 서비스 날짜 변경 모달 */}
<Modal show={showDateModal} onHide={() => setShowDateModal(false)} backdrop="static" keyboard={false}>
  <Modal.Header closeButton>
    <Modal.Title>서비스 날짜 변경</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <p>시작일과 종료일을 선택하세요:</p>

    <Form.Group>
      <Form.Label>서비스 시작일</Form.Label>
      <DatePicker
        selected={selectedStartDate}
        onChange={(date) => setSelectedStartDate(date)}
        dateFormat="yyyy년-MM월-dd일"
        className="form-control"
        locale={ko} // ✅ 한국어 적용
        minDate={new Date()} // ✅ 오늘 이후만 선택 가능하게
      />
    </Form.Group>

    <Form.Group className="mt-3">
      <Form.Label>서비스 종료일</Form.Label>
      <DatePicker
        selected={selectedEndDate}
        onChange={(date) => setSelectedEndDate(date)}
        dateFormat="yyyy년-MM월-dd일"
        className="form-control"
        locale={ko} // ✅ 한국어 적용
        minDate={selectedStartDate} // ✅ 시작일 이후만 선택 가능
      />
    </Form.Group>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowDateModal(false)}>취소</Button>
    <Button variant="primary" onClick={handleChangeDate}>변경</Button>
  </Modal.Footer>
</Modal>

    {/* 라이선스 발급 모달 */}
   <Modal
        show={showLicenseModal}
        onHide={() => setShowLicenseModal(false)}
        centered
        size="lg"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>라이선스 발급</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>사용자 이름</Form.Label>
                  <Form.Control type="text" value={assignForm.name} readOnly disabled />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>이메일</Form.Label>
                  <Form.Control type="email" value={assignForm.email} readOnly disabled />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>소속 병원</Form.Label>
                  <Form.Control type="text" value={assignForm.org} readOnly disabled />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>라이선스 키</Form.Label>
                  <Form.Control type="text" name="licenseKey" value={assignForm.licenseKey} readOnly disabled />
                </Form.Group>
              </div>
            </div>
            <Form.Group className="mb-3">
              <Form.Label>라이선스 유형</Form.Label>
              <Form.Select name="type" value={assignForm.type} onChange={handleLicenseFormChange}>
                <option value="1year">정식 (1년)</option>
                <option value="6months">정식 (6개월)</option>
                <option value="trial">체험판 (30일)</option>
              </Form.Select>
              {assignForm.type === "trial" && (
                <div className="mt-1 text-danger">※ 체험판은 30일 자동 지정입니다.</div>
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>발급일</Form.Label>
              <DatePicker
                selected={assignForm.issuedAt}
                onChange={(date) => setAssignForm(prev => ({ ...prev, issuedAt: date }))}
                dateFormat="yyyy-MM-dd"
                className="form-control"
                disabled 
                readOnly
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>만료일</Form.Label>
              <DatePicker
                selected={assignForm.expiresAt}
                onChange={(date) =>
                  setAssignForm((prev) => ({ ...prev, expiresAt: date }))
                }
                dateFormat="yyyy-MM-dd"
                className="form-control"
                disabled={assignForm.type === "30days"}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLicenseModal(false)}>취소</Button>
          <Button variant="primary" onClick={handleLicenseSubmit}>발급 완료</Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
}
