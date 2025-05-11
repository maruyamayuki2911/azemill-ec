// import { config } from './config.js';
import { sanitize, emailValidation, sendFormData} from './utility.js';

document.addEventListener('DOMContentLoaded', () => {

  // フォーム要素
  const contactForm = document.querySelector('.contact-form');


  // お問い合わせ種別を取得する処理
  const getContactType = (name) => {
    const checkRadio = document.querySelector(`input[name="${name}"]:checked`);
    if (checkRadio) {
      // 選択時の処理
      return checkRadio.nextElementSibling.textContent;
    } else {
      // 未選択時の処理
      return null;
    }
  }

  // 同意事項を取得する処理
  const getAgreementValue = (name) => {
    const checkedAgreement = document.querySelector(`input[name="${name}"]:checked`);
    if (checkedAgreement) {
      // 選択時の処理
      return checkedAgreement.nextElementSibling.querySelector('a').textContent;
    } else {
      // 未選択時の処理
      return null;
    }
  }

  // 電話番号をフォーマットする処理
  const normalizePhoneNumber = (data) => {
    if (data) {
      // ハイフン削除、半角に変換
      return data.trim().replace(/[-ー－―]/g, '').normalize('NFKC');
    }
  }

  // エラーメッセージを表示する処理
  const displayErrorMessages = (errorMessages) => {
    let errorElement = document.querySelector('.error-messages');

    // エラーがある場合の処理
    if (errorMessages.length > 0) {
      if (!errorElement) {
        // エラー要素がない場合の処理
        errorElement = Object.assign(document.createElement('div'), {
          className: 'error-messages',
          textContent: errorMessages.join('\n'),
        });
        document.body.appendChild(errorElement);
      } else {
        // エラー要素がある場合の処理
        errorElement.textContent = errorMessages.join('\n');
      }
    } else if (errorElement) {
      errorElement.remove();
    }
  }

  // バリデーション
  const validation = (data) => {
    let errorMessages = [];
    console.log("エラー開始前:", JSON.stringify(errorMessages));
    // 名前のバリデーション
    if (!data.name || !data.name.trim()) {
      errorMessages.push('お名前を入力してください。');
    }
    //メールアドレスのバリデーション
    const result = emailValidation(data);
    if(result !== undefined){
      errorMessages.push(result);
    }

    //電話番号のバリデーション
    if (data.phone) {
      const normalizedPhoneNumber = normalizePhoneNumber(data.phone);
      console.log(normalizedPhoneNumber);
      if (!/^0[789]0\d{8}$/.test(normalizedPhoneNumber) && !/^0\d{9,10}$/.test(normalizedPhoneNumber)) {
        errorMessages.push('電話番号を正しく入力してください。');
      }
    }
    //お問い合わせ種のバリデーション
    if (!data.contactType || !data.contactType.trim()) {
      errorMessages.push('お問い合わせ種別を選択してください。');
    }
    // 注文番号のバリデーション
    if (data.contactType === 'ご注文について') {
      if (!data.orderNumber || !data.orderNumber.trim()) {
        errorMessages.push('注文番号を入力してください。');
      }
    }
    // お問い合わせ内容のバリデーション
    if (!data.message || !data.message.trim()) {
      errorMessages.push('お問い合わせ内容を入力してください。');
    }
    // 同意事項のバリデーション
    if (!data.agreement || !data.agreement.trim()) {
      errorMessages.push('個人情報保護方針に同意してください。');
    }

    console.log("バリデーション終了後:", errorMessages);
    return errorMessages;
  }

  // 「商品について」が押下された時に、注文番号フォームを表示
  const orderNumberLabel = document.getElementById('order-number-label');
  const inputOrderNumber = document.getElementById('input-order-number');
  const targetRadio = document.querySelectorAll('[type="radio"]');

  targetRadio.forEach((item) => {
    item.addEventListener('change', (e) => {
      if (e.target.id === 'about-orders') {
        orderNumberLabel.classList.add('active');
        inputOrderNumber.classList.add('active');
      } else {
        orderNumberLabel.classList.remove('active');
        inputOrderNumber.classList.remove('active');
      }
    });
  });

  // フォームをサーバーに送信する処理
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // 入力値を取得
    const formData = {
      name: sanitize(document.querySelector('input[placeholder="お名前"]').value),
      email: sanitize(document.querySelector('input[placeholder="info@azumill.com"]').value),
      phone: sanitize(document.querySelector('input[placeholder="電話番号"]').value),
      contactType: getContactType('contact-type'),
      orderNumber: sanitize(document.querySelector('input[name="order-number"]').value),
      message: sanitize(document.querySelector('textarea[name="message"]').value),
      agreement: getAgreementValue('agreement'),
    }

    if(!formData.orderNumber){
      formData.orderNumber = null;
    }

    // バリデーションチェック
    const errorMessages = validation(formData);

    if (errorMessages.length === 0) {
      // エラーメッセージが残っていれば削除
      displayErrorMessages(errorMessages);

      // フォームデータを送信
      sendFormData(formData);

      // フォームをリセット
      document.querySelector('form').reset();

      // 送信完了画面に遷移
      document.location.assign('../contact/contact-completion.html');
      
    } else if (errorMessages.length > 0) {
      // エラーメッセージを表示
      displayErrorMessages(errorMessages);
    }
  });

});