require("dotenv").config();
const express = require("express");
const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

// Expressアプリと設定
const app = express();
const PORT = 3000;
app.use(express.json());
app.use(express.static('public'));
const JWT_SECRET = process.env.JWT_SECRET;
const User = require("./models/User");

// .env に MONGODB_URI を追加しておく
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("MongoDBと接続成功");
}).catch((err) => {
  console.error("MongoDB接続失敗:", err);
});

// 認証用ミドルウェア(JWT検証)
// JWTトークンが正しいか確認するための関所
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "トークンがありません" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "無効なトークン" });
    req.user = user;
    next();
  });
};

// ユーザー登録API(POST /register)
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  // 全ての項目が入力されているかチェック(空チェック)
  if (!name || !email || !password) {
    return res.status(400).json({ message: "全ての項目を入力してください" });
  }

  // メール形式チェック
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "正しいメールアドレスを入力してください" });
  }

  // パスワードの長さチェック
  if (password.length < 6) {
    return res.status(400).json({ message: "パスワードは6文字以上で入力してください" });
  }

  // すでに同じメールアドレスのユーザーがいないか、重複登録チェック(すでにそのemailが使われていないか)
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: "すでに登録されているメールアドレスです" });
  }

  try {
    // パスワードをハッシュ化（セキュリティのため）
    const hashedPassword = await bcrypt.hash(password, 10);

    // 新しいユーザー情報(ユーザーオブジェクト)を作成
    const newUser = new User({ name, email, password: hashedPassword });

    // MongoDBのusersコレクションに保存し、登録完了のレスポンスを返す
    await newUser.save();
    res.status(201).json({ message: "ユーザー登録に成功しました" });
  } catch (err) {
    console.error("ユーザー登録エラー:", err);
    res.status(500).json({ message: "サーバーエラーが発生しました" });
  }
});

// ログインAPI(POST /login)
// メールアドレスとパスワードでログイン要求を受ける
// パスワードをチェックして、OKならJWTトークンを発行して返す
// このトークンをクライアントは以降のリクエストに付けて使う
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(401).json({ message: "ユーザーが見つかりません" });

  try {
    const result = await bcrypt.compare(password, user.password);
    if (!result) return res.status(401).json({ message: "パスワードが間違っています" });

    const token = jwt.sign({ email: user.email, name: user.name }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ message: "ログイン成功", token, name:user.name });
  } catch (err) {
    console.error("ログイン処理エラー:", err);
    res.status(500).json({ message: "サーバーエラーが発生しました" });
  }
});

// プロフィール取得API(GET /profile)
// JWTトークンが有効なユーザーだけがアクセスできるAPI→認証ミドルウェア authenticateTokenを通ってきた人だけが見られる
app.get("/profile", authenticateToken, (req, res) => {
  res.json({ message: "認証済みプロフィール情報", user: req.user });
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});