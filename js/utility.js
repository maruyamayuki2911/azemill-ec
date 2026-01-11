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
    console.log(error);
    alert('しばらくたってからもう一度お試しください。');
  }
}

// localStorageに保存している特定のデータを取得する処理
export const getStorageData = (key) => {
  const data = localStorage.getItem(key);
  return data
}

// localStorageに保存している特定のデータを削除する処理
export const removeStorageData = (key) => {
  localStorage.removeItem(key);
}