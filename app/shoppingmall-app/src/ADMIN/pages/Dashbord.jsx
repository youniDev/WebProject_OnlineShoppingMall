import React from "react";
import Header from "../comonent/layout/DashboardHeader";

import "../../assets/css/dashboard.css";
import ProductManagement from "../comonent/layout/ProductManagement";

/**
 * 
 * 관리자 사이트 관리 기능
 * 1. 제품 등록 및 수정 기능
 * 2. 회원 미정
 * 3. 게시판 수정 기능
 */
function Dashboard() {
    return (
        <>
            <Header/>
            <ProductManagement/>
        </>
    );
};

export default Dashboard;