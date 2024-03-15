import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "../../component/layout/Header";
import Footer from "../../component/layout/Footer";
import Banner from "../../component/layout/Banner";
import Network from "../../component/layout/Network";
import ShowProduct from "../../component/layout/ShowProduct";

import Community from "./board/Community";
import Detail from "./board/Detail";
import Category from "./board/Category";

import Signin from "./login/Signin";
import Signup from "./login/Signup";
import NaverRedirectPage from "./login/NaverRedirectPage";
import KakaoRedirectPage from "./login/KakaoRedirectPage";
import GoogleRedirectPage from "./login/GoogleRedirectPage"
import ProductDetail from "./product/ProductDetail";
import DashboardPage from "../../ADMIN/pages/Dashbord";
import MyPage from './mypage/MyPage';
import WritePost from "./board/WritePost";

import '../../assets/css/main.css';
import Purchase from "./product/Purchase";

function Main() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/signin" element={<Signin/>} />
                <Route path="/signup" element={<Signup/>} />
                <Route path="/community/*" element={<Community />} />
                <Route path="/Detail/*" element={<Detail />} />
                <Route path="/category/:mainCategory" element={<Category />} />
                <Route path="/category/:mainCategory/:subCategory" element={<ProductDetail />} />
                <Route path="/oauth/redirected/naver" element={<NaverRedirectPage />} />
                <Route path="/oauth/redirected/kakao" element={<KakaoRedirectPage />} />
                <Route path="/oauth/redirected/google" element={<GoogleRedirectPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/mypage" element={<MyPage />} />
                <Route path="/purchase" element={<Purchase />} />
                <Route path="/write" element={<WritePost />} />
            </Routes>
        </Router>
    );
}

// MainPage 컴포넌트
const MainPage = () => (
    <>
        <Header />
        <Banner />
        <ShowProduct />
        <Network/>
        <Footer />
    </>
);

export default Main;