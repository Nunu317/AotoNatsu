import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";

const app = express();

// 수정된 multer 설정
const upload = multer({ storage: multer.memoryStorage() });

// 정적 파일 제공
app.use("/uploads", express.static("uploads"));

// uploads 폴더 자동 생성
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// 메인 페이지
app.get("/", (req, res) => {
  res.send(`
    <h2>MP3 하나만 업로드 가능</h2>
    <form action="/upload" method="post" enctype="multipart/form-data">
      <input type="file" name="mp3" accept="audio/mp3">
      <button type="submit">업로드</button>
    </form>
    <br>
    <audio controls src="/uploads/song.mp3"></audio>
  `);
});

// 업로드 처리
app.post("/upload", upload.single("mp3"), (req, res) => {
  if (!req.file) return res.status(400).send("파일 업로드 실패");

  // 파일 저장 (기존 덮어쓰기)
  fs.writeFileSync(path.join(uploadDir, "song.mp3"), req.file.buffer);

  res.redirect("/");
});

// Render 환경 포트
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ 서버 실행: http://localhost:${PORT}`));

