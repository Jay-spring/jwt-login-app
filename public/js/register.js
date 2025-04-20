document.getElementById("register-form").addEventListener("submit", async (e) => {
  // フォームの送信イベントをキャッチ
  e.preventDefault();
  // フォームの「デフォルトの動き（ページ再読み込みなど）」を止める命令
  // これを書かないと、フォームを送信した瞬間にページがリロードされてしまい、JSの処理が完了する前に画面が切り替わってしまう

  // フォームの各入力欄から値を取得
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // fetchでAPIにリクエスト送信
  try {
    const res = await fetch("/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    // サーバーのレスポンスを処理
    const data = await res.json();
    // メッセージ表示
    const msg = document.getElementById("message");

    if (res.ok) {
      msg.textContent = "登録成功！ログインしてください。";
    } else {
      msg.textContent = `エラー: ${data.message}`;
    }
  } catch (error) {
    console.error("登録エラー:", error);
  }
});