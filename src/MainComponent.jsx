import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import ProductCard from './components/card/ProductCard';
import './App.css';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import Ruler from './components/card/Ruler';

function MainComponent() {
  const [isShowingVideo, setIsShowingVideo] = useState(false);
  const [products, setProducts] = useState([]);
  const [config, setConfig] = useState([]);
  const [currentConfig, setCurrentConfig] = useState({
    videoPath: "",
    videoDuration: 8000,
    displayInterval: 20000,
    defaultShowVideo: true,
    showRuler: false,
    newPath: "",
    backgroundColor: "#ffffff"
  });

  const navigate = useNavigate();
  const location = useLocation();

  const loadConfigs = async () => {
    const configUrls = ['/config1.json', '/config2.json'];
    try {
      const configs = await Promise.all(configUrls.map(url => fetch(`${url}?timestamp=${new Date().getTime()}`).then(res => {
        if (!res.ok) {
          throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })));
      setConfig(configs);
    } catch (error) {
      console.error('Error loading configs:', error);
    }
  };

  const getConfigAndProductsUrls = (pathname) => {
    const baseName = pathname.split('/')[1];
    const matchedConfig = config.find(cfg => cfg.newPath === `/${baseName}`);
    if (matchedConfig) {
      const key = baseName.split('lcd')[1];
      return {
        config: matchedConfig,
        productsUrl: `/products_lcd${key}.json?timestamp=${new Date().getTime()}`
      };
    }
    return { config: null, productsUrl: null };
  };

  useEffect(() => {
    loadConfigs();
    serviceWorkerRegistration.register();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const { config, productsUrl } = getConfigAndProductsUrls(location.pathname);
      if (config && productsUrl) {
        try {
          const productsResponse = await fetch(productsUrl);
          if (!productsResponse.ok) {
            throw new Error(`Failed to fetch ${productsUrl}: ${productsResponse.status} ${productsResponse.statusText}`);
          }
          const newProducts = await productsResponse.json();

          setCurrentConfig(config);
          setIsShowingVideo(config.defaultShowVideo);
          setProducts(newProducts);

          // Устанавливаем цвет фона через JavaScript
          document.querySelector('.app-container').style.backgroundColor = config.backgroundColor;

          // Проверяем, нужно ли перенаправлять на новый путь
          if (config.newPath && config.newPath !== location.pathname) {
            navigate(config.newPath);
          }
        } catch (error) {
          console.error('Ошибка при загрузке данных:', error);
        }
      } else {
        console.error('No matching config or products URL found for', location.pathname);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 150000);
    return () => clearInterval(interval);
  }, [location.pathname, navigate, config]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsShowingVideo(prev => !prev);
    }, isShowingVideo ? currentConfig.videoDuration : currentConfig.displayInterval);

    return () => clearInterval(interval);
  }, [isShowingVideo, currentConfig.videoDuration, currentConfig.displayInterval]);

  return (
    <div className="app-container container-fluid">
      <Ruler show={currentConfig.showRuler} />
      <Routes>
        {config.map(cfg => (
          <Route key={cfg.newPath} path={cfg.newPath} element={
            <>
              <div className={`container_for_video ${isShowingVideo ? 'show' : 'hide'}`}>
                <video src={currentConfig.videoPath}
                       autoPlay
                       preload="auto"
                       muted
                       loop
                       playsInline
                       className="video-background" />
              </div>
              
              <div className={`cards-container ${!isShowingVideo ? 'show' : 'hide'}`}>
                {products.map(product => (
                  <ProductCard key={product.productId} 
                               spacing={product.spacing}
                               productName={product.productName}
                               price={product.price}
                               weight={product.weight}
                               expiry={product.expiry}
                               barcodeNumber={product.barcodeNumber} />
                ))}
              </div>
            </>
          } />
        ))}
      </Routes>
    </div>
  );
}

export default MainComponent;
