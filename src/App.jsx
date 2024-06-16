import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductCard from './components/card/ProductCard';
import './App.css';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import Ruler from './components/card/Ruler';

function App() {
  const [isShowingVideo, setIsShowingVideo] = useState(false); // Для чередования видео и карточек
  const [products, setProducts] = useState([]);
  const [config, setConfig] = useState({
    videoPath: "",
    videoDuration: 8000, // Время показа видео в мс
    displayInterval: 20000, // Время показа карточек в мс
    defaultShowVideo: true,
    showRuler: false 
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const basePath = window.location.pathname;
        // Определяем URL для конфигурации на основе пути
        const configUrl = `/config${basePath === '/lcd3' ? '1' : '2'}.json`;
        const productsUrl = `/products${basePath === '/lcd3' ? '1' : '2'}.json`;
  
        const [configResponse, productsResponse] = await Promise.all([
          fetch(configUrl),
          fetch(productsUrl)
        ]);
        const newConfig = await configResponse.json();
        const newProducts = await productsResponse.json();
  
        setConfig(newConfig);
        setIsShowingVideo(newConfig.defaultShowVideo);
        setProducts(newProducts);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    };
    fetchData();
    serviceWorkerRegistration.register();
    // Установите интервал обновления данных
    const interval = setInterval(fetchData, 150000); // Каждые 2.5 минуты
    return () => clearInterval(interval);
  }, []);

 

  useEffect(() => {
    // Переключение между видео и карточками
    const interval = setInterval(() => {
      setIsShowingVideo(prev => !prev);
    }, isShowingVideo ? config.videoDuration : config.displayInterval);

    return () => clearInterval(interval);
  }, [isShowingVideo, config.videoDuration, config.displayInterval]);
  return (
    <Router>
      <div className="app-container container-fluid">
        <Ruler show={config.showRuler} /> {/* Добавлен компонент линейки */}
        <Routes>
          <Route path="/lcd3" element={
            <>
              {/* Контент для /lcd1 */}
              <div className={`container_for_video lcd1_container ${isShowingVideo ? 'show' : 'hide'}`}>
                <video   src={config.videoPath}
                                autoPlay
                                preload="auto"
                                muted
                                loop
                                playsInline
                                className="video-background" />
              </div>
              
              <div className={`cards-container ${!isShowingVideo ? 'show' : 'hide'}`}>
                {products.map(product => (
                  <ProductCard  key={product.productId} 
                  spacing={product.spacing}
                  productName={product.productName}
                  price={product.price}
                  weight={product.weight}
                  expiry={product.expiry}
                  barcodeNumber={product.barcodeNumber}
                 />
                ))}
              </div>
            </>
          } />
          <Route path="/lcd4" element={
            <>
              {/* Контент для /lcd2 */}
              <div className={`container_for_video lcd2_container ${isShowingVideo ? 'show' : 'hide'}`}>
                <video   src={config.videoPath}
                autoPlay
                preload="auto"
                muted
                loop
                playsInline
                className="video-background" />
              </div>
              <div className={`cards-container ${!isShowingVideo ? 'show' : 'hide'}`}>
                {products.map(product => (
                  <ProductCard    key={product.productId} 
                  spacing={product.spacing} 
                  productName={product.productName}
                  price={product.price}
                  weight={product.weight}
                  expiry={product.expiry}
                  barcodeNumber={product.barcodeNumber}
                  />
                ))}
              </div>
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

