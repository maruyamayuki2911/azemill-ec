import { sanitize, emailValidation, sendFormData } from './utility.js';

document.addEventListener('DOMContentLoaded', () => {
  const emailForm = document.getElementById('mail-magazine-form');
  const emailInputElement = document.querySelector('input[type="email"]');
  const registerBtn = document.querySelector('.mail-magazine__submit');
  const inputData = {
    email: ''
  }
  let errorMessage = '';

  const displayErrorMessage = (errorMessage) => {
    let errorElement = document.querySelector('.error-message');

    if (errorMessage !== undefined) {
      // エラーメッセージ有かつエラー要素がない場合
      if (!errorElement) {
        errorElement = Object.assign(document.createElement('span'), {
          className: 'error-message',
          textContent: errorMessage
        });
        emailInputElement.insertAdjacentElement('afterend', errorElement);
      } else {  //エラーメッセージ有かつエラー要素がある場合
        errorElement.textContent = errorMessage;
      }
    } else if (errorMessage === undefined) {
      if (errorElement) {
        //エラーメッセージ無かつエラー要素がある場合
        errorElement.remove();
      } else {
        // エラーメッセージ無かつエラー要素が無い場合
        return;
      }
    }
  }

  // メールアドレスフォーム入力時の処理
  emailInputElement.addEventListener('focusout', (e) => {

    // XXS対策
    inputData.email = sanitize(e.target.value);

    // バリデーションチェック
    const errorMessage = emailValidation(inputData);

    // オートフィルによる強制スタイルを回避
    const originalValue = e.target.value;
    e.target.value = '';
    e.target.value = originalValue;

    // バリデーション結果による処理
    if (errorMessage !== undefined) {
      e.target.style.background = 'pink';
      displayErrorMessage(errorMessage);
    } else {
      e.target.style.background = 'none';
      registerBtn.classList.remove('inactive');
      registerBtn.classList.add('is-active');
      displayErrorMessage(errorMessage);
    }
  });

  // モックAPIに送信する処理
  emailForm.addEventListener('submit', (e) => {
    e.preventDefault();

    sendFormData(inputData);
    
    document.location.assign('../mail-magazine-completion/mail-magazine-completion.html');
  });
});