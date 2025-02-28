import { config } from './config.js';

document.addEventListener('DOMContentLoaded', () => {

  // 注文番号を採番する処理
  const generateOrderNumber = () => {
    const randomNumber = Math.floor(Math.random() * 10000);
    const dateNumber = Date.now().toString().slice(-4);
    const uniqueNumber = randomNumber + dateNumber;
    return uniqueNumber;
  }

  // 注文日時を取得する処理
  const getOrderDate = ()=>{
    // YYYY/MM/DD/HH/MM形式に変換
    const orderDate = new Date().toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
    return orderDate;
  }

  // モックAPIから注文内容を取得
  const getOrderInfo = async () => {
    try {
      const response = await fetch(`${config.apiUrl}/orders`);
      
      if (!response) {
        throw new Error(`HTTPエラー：${response.status}`);
      }
      
      const orderData = await response.json();
      return orderData;
    } catch (error) {
      console.error('エラー', error.message);
      return null;
    }
  }

  // 合計金額を計算する処理
  const totalAmount = (orderData) => {
    const postage = 800;
    const tax = 1.1;

    if (orderData && orderData.length > 0) {
      const subTotal = orderData.reduce((acc, item) => acc + tax * (item.quantity * item.price), postage);
      const totalPrice = subTotal * tax;
      return totalPrice;
    } else {
      return new Error('注文データが取得に失敗');
    }
  }

  // 注文内容を表示する処理
  const orderNumberElement = document.getElementById('order-number');
  const orderDateElement = document.getElementById('order-date');
  const orderItemsElement = document.getElementById('order-items');
  const totalAmountElement = document.getElementById('total-amount');

  const displayOrderInfo = async () => {
    try{
      // 注文番号を表示
      const orderNumber = generateOrderNumber();
      orderNumberElement.textContent = orderNumber;
  
      // 注文日時を表示
      const orderDate = getOrderDate();
      orderDateElement.textContent = orderDate;
  
      //注文データを取得
      const orderData = await getOrderInfo();
      if(!orderData){
        throw new Error('注文データの取得に失敗');
      }

      // ご注文内容／合計金額を表示
      if (orderData && orderData.length > 0) {
        
        orderData.forEach((item) => {
          const orderItem = document.createElement('div')
          orderItem.classList.add('order-item');
          orderItem.innerHTML = `
          <span class="product-name">${item.name}</span>
          <span class="order-quantity">${item.quantity}</span>
          `;
          orderItemsElement.appendChild(orderItem);
        });
        
        const totalPrice = totalAmount(orderData);
        totalAmountElement.textContent = `${totalPrice.toLocaleString('ja-jp')}円`;
      }

    }catch(error){
      console.error('エラー：',error.message);
      alert('しばらくしてから再度お試しください');
    }
  }

  displayOrderInfo();
});