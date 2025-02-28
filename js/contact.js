document.addEventListener('DOMContentLoaded', () => {

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

  
});