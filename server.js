import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";

const app = express();
const upload = multer({ dest: "uploads/" });

// uploads 폴더 없으면 자동 생성
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// 정적 파일 제공
app.use("/uploads", express.static("uploads"));

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
  // 기존 파일 삭제
  fs.readdirSync("uploads").forEach(f => fs.unlinkSync(path.join("uploads", f)));

  // 새 파일 저장
  fs.renameSync(req.file.path, path.join("uploads", "song.mp3"));

  res.redirect("/");
});

// Render 환경에서 포트 설정
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ 서버 실행: http://localhost:${PORT}`));
