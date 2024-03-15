import { useCallback, useState, useEffect } from "react";
import { sortBestItemByProductId, sortByNumberOrderByASC, sortByNumberOrderByDESC, sortByStringOrderByASC } from "../assets/js/sortBySelectOption";

const useSort = (filteredProducts, setFilteredProducts) => {
    const [sortProducts, setSortProducts] = useState(filteredProducts);

    useEffect(() => {
        setFilteredProducts(sortProducts);
    }, [sortProducts])

    const sortIntegerOrderByDESC = useCallback((e) => {
        const sortedProducts = sortByNumberOrderByDESC([...filteredProducts], e.target.name);
    
        setSortProducts(sortedProducts);
        
    }, [filteredProducts]);
    
    const sortInteger = useCallback((e) => {
        const sortedProducts = sortByNumberOrderByASC([...filteredProducts], e.target.name);
    
        setSortProducts(sortedProducts);
        
    }, [filteredProducts]);
    
    const sortString = useCallback((e) => {
        const sortedProducts = sortByStringOrderByASC([...filteredProducts], e.target.name);
    
        setSortProducts(sortedProducts);
        
    }, [filteredProducts]);
    
    const sortBestItemBySales = useCallback(async () => {
        const sortedIds = await sortBestItemByProductId(filteredProducts);
    
        setSortProducts(sortedIds);
    }, [filteredProducts]);

    return {sortProducts, sortIntegerOrderByDESC, sortInteger, sortString, sortBestItemBySales};
};

export default useSort;