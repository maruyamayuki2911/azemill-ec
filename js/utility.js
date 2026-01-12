import { config } from './config.js';

// XXS対策
export const sanitize = (str) => {
  if (str) {
    return str.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/&/g, '&amp;').replace(/'/g, '&#39;').replace(/"/g, '&quot;');
  }
}

//メールアドレスのバリデーション
export const emailValidation = (data) => {
  if (!data.email || !data.email.trim()) {
    return 'メールアドレスを入力してください。';
  } else if (!/^[a-zA-Z0-9-._+/]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/.test(data.email)) {
    return 'メールアドレスを正しく入力してください。';
  }
}

// フォームデータを送信する処理
export const sendFormData = async (data) => {
  try {
    const response = await fetch(`${config.apiUrl}/form`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(data)
    }
    );

    if (!response.ok) {
      throw new Error(`HTTPステータス:${response.status}`);
    }

  } catch (error) {
    alert('しばらくたってからもう一度お試しください。');
  }
}

// localStorageに保存している特定のデータを取得する処理
export const getStorageData = (key) => {
  return localStorage.getItem(key);
}

// localStorageに保存している特定のデータを削除する処理
export const removeStorageData = (key) => {
  localStorage.removeItem(key);
}


// 注文番号を採番する処理
export const generateOrderId = () => {
  const randomNumber = Math.floor(Math.random() * 10000);
  const dateNumber = Date.now().toString().slice(-4);
  return 'ORD' + randomNumber + dateNumber;
}

// ISO形式の現在日時を取得する処理
export const getCurrentISODateTime = () => {
  return new Date().toISOString();
}

// ISO形式の日時を、日本向けの表示用フォーマットに変換する処理
export const formatToJaDateTime = (isoDateString) => {
  // Dateオブジェクトに変換
  const date = new Date(isoDateString);

  return date.toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}