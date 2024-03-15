import { useEffect, useState } from "react";

import { PAGE } from "../assets/js/Constants";

export const usePagenation = ({totalProductsLength, products}) => {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(totalProductsLength / PAGE.CATEGORY);

    const indexOfLastProduct = currentPage * PAGE.CATEGORY;
    const indexOfFirstProduct = indexOfLastProduct - PAGE.CATEGORY;

    useEffect(() => {
        setCurrentPage(1);
    }, [products]); // 정렬 시, 렌더링

    return {setCurrentPage, currentPage, totalPages, indexOfFirstProduct, indexOfLastProduct};
};