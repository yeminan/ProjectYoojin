import { parseString } from "xml2js";

export default async function handler(req, res) {
  const { keyword } = req.query;
  const serviceKey = process.env.NEXT_PUBLIC_HOSPITAL_API_KEY;

  const apiUrl = `https://apis.data.go.kr/B551182/hospInfoServicev2/getHospBasisList?ServiceKey=${encodeURIComponent(
    serviceKey
  )}&yadmNm=${encodeURIComponent(keyword)}&pageNo=1&numOfRows=100`;

  try {
    const response = await fetch(apiUrl);
    const xml = await response.text();

    parseString(xml, (err, result) => {
      if (err) {
        console.error("XML 파싱 오류:", err);
        return res.status(500).json({ error: "XML 파싱 실패" });
      }

      const items = result.response?.body?.[0]?.items?.[0]?.item || [];
      res.status(200).json(items);
    });
  } catch (error) {
    console.error("API 호출 실패:", error);
    res.status(500).json({ error: "병원 검색 API 오류" });
  }
}
