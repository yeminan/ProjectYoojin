export default function handler(req, res) {
    const users = [
      { id: 1, name: "홍길동", email: "hong@example.com", status: "활성" },
      { id: 2, name: "이순신", email: "lee@example.com", status: "정지" },
      { id: 3, name: "김영희", email: "kim@example.com", status: "활성" },
      { id: 4, name: "박철수", email: "park@example.com", status: "정지" },
      { id: 5, name: "최민수", email: "choi@example.com", status: "활성" },
      { id: 6, name: "김철호", email: "kimch@example.com", status: "활성" },
      { id: 7, name: "유재석", email: "yu@example.com", status: "정지" },
      { id: 8, name: "강호동", email: "kang@example.com", status: "활성" },
      { id: 9, name: "이영애", email: "leea@example.com", status: "활성" },
      { id: 10, name: "정준하", email: "jung@example.com", status: "정지" },
    ];
  
    res.status(200).json(users);
  }
  