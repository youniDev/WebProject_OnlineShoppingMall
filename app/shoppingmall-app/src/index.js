import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/css/index.css';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import MainPage from './USER/pages/Main';

const root = ReactDOM.createRoot(document.getElementById('root'));

/* 매 1000초 마다 갱신됨.
setInterval(() => {
  root.render(
    <React.StrictMode>
      <Clock />
    </React.StrictMode>
  );
}, 1000);
*/

root.render(
  //<React.StrictMode> // 리액트에서 제공하는 검사 도구이다. 개발 모드일때 디버그를 통하여, 이 태그로 감싸져있는 App 컴포넌트까지 다.. 자손을 검사하는 것, 그래서 2번 실행됨.
  // 소셜 로그인을 진행 중 2번 실행되는 것 때문에 오류가 발생해 주석 처리함.
    <MainPage />
 // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
