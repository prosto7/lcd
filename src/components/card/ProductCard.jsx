import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';

function ProductCard({ productName, price, weight, expiry, barcodeNumber, spacing}) {
  return (
    <div className="product-card" style={{ marginRight: `${spacing}px` }}>
      <div className="product-name">{productName}</div>
      <div className="product-price">{price} ₽</div>
      <div className="product-details-container">
        <div className="product-details">
          <div className="product-weight">Вес/объем: {weight}</div>
          <div className="product-expiry">Срок годности: {expiry}</div>
        </div>
        <div className="product-qr">
          <QRCodeCanvas value={barcodeNumber} size={64} level={"H"} />
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
