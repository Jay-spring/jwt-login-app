document.getElementById("loginForm").addEventListener("submit", async (e) => {
  // submitでフォーム送信時にページ全体をリロード
  e.preventDefault();
  // このリロード動作を止める→フォーム送信によるリロードを防ぐ
  // JavaScriptで自分で送信処理（例：fetchでAPIに送る）をしたいときに使う

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  const res = await fetch("/login", {
    // fetch()でAPI（＝サーバー）にリクエストを送る。
    // await fetch(...)	で非同期でレスポンスを待つ
    method: "POST", // POSTメソッドで送信
    headers: { "Content-Type": "application/json" }, // JSON形式で送ることを明示 
    body: JSON.stringify({ email, password }), // 実際のデータ（ユーザー名・パスワード）
  });

  const data = await res.json();
  // res.json() は 非同期関数（Promiseを返す関数）
  // サーバーからのレスポンスがJSON形式の場合、.json() で パース（＝中身を使える形に変換）できる
  // awaitをつけないと、dataにはPromiseが入ってしまうため、中身が使えない

  if (res.ok) {
    // fetch() のレスポンスオブジェクト res には ok というプロパティがある
    // res.ok は HTTPステータスコードが 200〜299 のときに true を返す
    localStorage.setItem("token", data.token);
    window.location.href = "/dashboard.html";
  } else {
    document.getElementById("error").textContent = data.message || "Login failed.";
    // data.message が空だったり未定義だったら "Login failed." にする
  }
});