// import { config } from './config.js';

// localStorage.clear();
document.addEventListener('DOMContentLoaded', () => {
  const cartBtn = document.getElementById('cart-btn');
  const plusBtns = document.querySelectorAll('.product__plus-btn');
  const minusBtns = document.querySelectorAll('.product__minus-btn');
  const addToCartBtns = document.querySelectorAll('.product__add-to-cart');

  // カートの情報を取得
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  console.log(cart);
  // カート内の合計商品数を表示する処理
  const updateCartCount = () => {
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0)
    cartBtn.textContent = `Cart(${totalCount})`;
    return totalCount;
  }

  // カート情報を復元
  updateCartCount();

  // カート内の商品をlocalStorageに保存する処理
  const saveCart = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
    // console.log(cart);

    // カート内の数量を表示
    updateCartCount();
  }

  // カートの商品を削除する処理
  const deleteCart = () => {
    localStorage.remove('cart');
  }


  // 数量を変更する処理
  plusBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      const indicator = btn.closest('.product__order-count').querySelector(".product__indicator");
      let count = parseInt(indicator.textContent, 10);
      if (count < 9) {
        indicator.textContent = count + 1;
      }
    });
  });

  minusBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      const indicator = btn.closest('.product__order-count').querySelector('.product__indicator');
      let count = parseInt(indicator.textContent, 10);
      if (count > 1) {
        indicator.textContent = count - 1;
      }
    });
  });

  // カート追加後にインジケーターを「1」に戻す処理
  const resetIndicator = () => {
    addToCartBtns.forEach((btn) => {
      const indicator = btn.closest('.product__order-count').querySelector('.product__indicator');
      indicator.textContent = '1';
    });
  }

  // カートに商品を追加
  addToCartBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      // 商品情報を格納する変数を定義
      let productName = "";
      let volume = "";
      let listItems = [];
      let price = 0;
      let quantity = 1;

      const productBox = btn.closest('.main-product__box') || btn.closest('.gift-product__box');

      // 商品名を取得
      if (productBox) {
        const productNameElement = productBox.querySelector('.main-product__name') || productBox.querySelector('.gift-product__name');
        if (productNameElement) {
          productName = productNameElement.textContent;
        }
      }
      // 内容量を取得
      if (productBox) {
        const productVolumeElement = productBox.querySelector('.product-volume');
        if (productVolumeElement) {
          volume = productVolumeElement.textContent;
        }
      }
      // セット内容を取得
      if (productBox) {
        const productListElement = productBox.querySelectorAll('ul li');
        if (productListElement) {
          listItems = [...productListElement].map(list => list.textContent);
        }
      }
      // 価格を取得
      if (productBox) {
        const productPriceElement = productBox.querySelector('.main-product__price') || productBox.querySelector('.gift-product__price');
        if (productPriceElement) {
          price = parseInt(productPriceElement.textContent.replace(/[¥,]/g, ""), 10);
        }
      }
      // 数量を取得
      const orderCountElement = btn.closest('.product__order-count');
      if (orderCountElement) {
        quantity = parseInt(orderCountElement.querySelector('.product__indicator').textContent, 10);
      }

      const product = {
        name: productName,
        volume: volume,
        items: listItems,
        price: price,
        quantity: quantity
      }

      // すでにカートにある場合は数量を更新
      const existingProduct = cart.find((item) => item.name === product.name);
      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        cart.push(product);
        console.log(product);
      }

      // localStorageに保存
      saveCart();

      // フェードインアウト：「カートに追加しました」モーダル
      const addToCartModal = document.querySelector('.add-to-cart-modal');
      // モーダルを表示
      addToCartModal.classList.add('cart-modal--active');
      // モーダルを非表示
      setTimeout(() => {
        addToCartModal.classList.remove('cart-modal--active');
      }, 3000);

      // インジケーターを「1」に戻す
      resetIndicator();
    });
  });


  // カート内商品の数量を変更した時の処理(数量変更、合計金額、localStorage更新)
  const updataCartItemQuantity = (e) => {
    const target = e.target;


    if (target.classList.contains('product__plus-btn') || target.classList.contains('product__minus-btn')) {
      const cartElement = target.closest('.cart-product');  //+-ボタンを押した商品の要素
      const indicator = cartElement.querySelector('.product__indicator');
      let count = parseInt(indicator.textContent, 10);
      const productName = cartElement.querySelector('.product-name').textContent.trim();
      console.log(`クリックした商品名：${productName}`)
      const priceElement = cartElement.querySelector('.product-price');
      const existingProduct = cart.find((item) => item.name.trim() === productName);  //localStorage内の商品を取得
      console.log(existingProduct);
      console.log(cart);

      // プラスボタンの処理
      if (target.classList.contains('product__plus-btn')) {
        if (count < 9) {
          // 表示している数量をインクリメント
          indicator.textContent = ++count;


          //LocalStorage内の数量をインクリメント
          if (existingProduct) {
            existingProduct.quantity++;
          }

          // 商品ごとの合計金額を表示
          priceElement.textContent = `${(existingProduct.price * existingProduct.quantity).toLocaleString('ja-jp')}円`;


          // 総額を表示
          cartTotalPrice();

          // localStorageに保存
          saveCart();


          // カート内の数量を表示
          updateCartCount();
        }

      }
      // マイナスボタンの処理
      else if (target.classList.contains('product__minus-btn')) {
        if (count > 0) {
          // 表示している数量をデグリメント
          indicator.textContent = --count;


          // localStorageの数量をデグリメント
          if (existingProduct) {
            existingProduct.quantity--;
          }


          // 商品ごとの合計金額を表示
          priceElement.textContent = `${(existingProduct.price * existingProduct.quantity).toLocaleString('ja-jp')}円`;

          // 総額を表示
          cartTotalPrice();

          // localStorageの数量を変更・保存
          saveCart();


          // カート内の数量を表示
          updateCartCount();
        }
      }
    }
  }

  // カート内商品の総額を計算する処理
  const cartTotalPrice = () => {
    const totalPriceElement = document.getElementById('cart-modal__total-price');
    const postage = 800;
    const tax = 1.1;
    const totalPrice = cart.reduce((acc, item) => acc + (item.quantity * item.price), postage);
    if (totalPrice > postage) {
      totalPriceElement.textContent = `${(totalPrice * tax).toLocaleString('ja-jp')}円`;
    } else {
      totalPriceElement.textContent = '0円';
    }
  }


  // カートモーダルを表示する処理
  const cartModal = document.querySelector('.cart-modal--blur');
  const continueBtn = document.getElementById('continue-btn');
  const purchaseBtn = document.getElementById('purchase-btn');
  cartBtn.addEventListener('click', (e) => {
    // カート表示中はカートボタンを無効化
    cartBtn.classList.add('cart-btn--disabled');
    // 購入手続き画面を表示する処理
    cartModal.classList.add('cart-modal--active');


    // カート内の商品を表示する処理
    const cartListElement = document.getElementById('cart-modal__item-list');
    if (cart.length !== 0) {
      cartListElement.innerHTML = '';
      cart.forEach((item, index) => {
        const product = document.createElement('div');
        product.classList.add('cart-product');
        product.innerHTML = `
        <span class="product-name">${item.name}</span>
        <span class="product-volume">${item.volume}</span>
        <div class="product-quantity">
          <div class="product__indicator">${item.quantity}</div>
          <div class="product-quantity__buttons">
            <span class="product__plus-btn"></span>
            <span class="product__minus-btn"></span>
          </div>
        </div>
        <span class="product-price">${(item.quantity * item.price).toLocaleString('ja-jp')}円</span>
        `;
        cartListElement.appendChild(product);


        continueBtn.classList.add('is-inactive');
        purchaseBtn.classList.add('is-active');
      });
    } else {
      cartListElement.textContent = '商品はありません';
      continueBtn.classList.add('is-active');
      purchaseBtn.classList.add('purchase-btn--disabled');
    }

    // 総額を表示
    cartTotalPrice();

    // カート内にイベントリスナーを追加
    const cartItemList = document.getElementById('cart-modal__item-list');
    cartItemList.addEventListener('click', updataCartItemQuantity);


    // カートモーダルを非表示にする処理
    continueBtn.addEventListener('click', () => {
      // カート内のイベントリスナーを削除
      cartItemList.removeEventListener('click', updataCartItemQuantity);


      // 不要なスタイルを削除
      continueBtn.classList.remove('is-active', 'is-inactive');
      purchaseBtn.classList.remove('purchase-btn--disabled', 'is-active');

      // カートモーダルを非表示 
      cartModal.classList.remove('cart-modal--active');
      cartBtn.classList.remove('cart-btn--disabled');


      // 数量「0」の商品をカートから削除
      if (cart.some((item) => item.quantity === 0)) {
        cart = cart.filter((item) => item.quantity > 0)
        localStorage.setItem('cart', JSON.stringify(cart));
      }
    });
  });


  // 購入ボタンの処理
  purchaseBtn.addEventListener('click', async () => {
    
    // cartをオブジェクトに加工
    // mockAPIの仕様上、配列を送信できないため、1件ずつ送信する。
    for (const item of cart) {
      const orderData = {
        name: item.name,
        volume: item.volume,
        items: item.items,
        price: item.price,
        quantity: item.quantity
      }
      
      
      try {
        const response = await fetch(`${config.apiUrl}/orders`, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify(orderData)
        });

        // ステータスコードのチェック
      if (!response.ok) {
        throw new Error(`HTTPエラー: ${response.status}`);
      }

  
        const result = await response.json();
        console.log('購入完了;', result);
  
        localStorage.removeItem('cart');
      } catch (error) {
        console.error('エラー：', error.message);
        alert('サーバーが混み合っています。しばらくしてから再度お試しください');
      }
    }
  });
});