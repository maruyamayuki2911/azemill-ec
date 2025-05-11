// import { config } from './config.js';

document.addEventListener('DOMContentLoaded',()=>{
  // モックAPIからデータを取得する処理
  const getInquiry = async ()=>{
    try{
      const response = await fetch(`${config.apiUrl}/form`);

      if(!response){
        throw new Error(`HTTPステータス:${response.status}`);
      }

      return await response.json();
    }catch(error){
      console.error(error);
      alert('お問い合わせ情報の取得に失敗しました。');
      return false;
    }
  }

  // お問い合わせ内容を表示する処理
  const displayInquiry = async () =>{
    // お問い合わせ内容を取得
    const inquiryData = await getInquiry();

    if(!inquiryData){
      alert('お問い合わせ内容の取得に失敗しました。下記電話番号までお問い合わせください。0120-000001');
      return
    }
    console.log(await inquiryData);

    const nameElement = document.getElementById('name');
    const contactTypeElement = document.getElementById('contact-type');
    const orderNumberElement = document.getElementById('order-number');
    const messageElement = document.getElementById('message');

    nameElement.textContent = inquiryData[0].name;
    contactTypeElement.textContent = inquiryData[0].contactType;
    if(inquiryData[0].orderNumber){
      orderNumberElement.textContent = inquiryData[0].orderNumber;
    }else{
      // 注文番号がない時は非表示
      const parentElement = orderNumberElement.closest('p');
      parentElement.classList.add('inactive');
    }
    messageElement.textContent = inquiryData[0].message;
  }
  displayInquiry();
});