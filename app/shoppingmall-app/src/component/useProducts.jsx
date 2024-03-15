import { useEffect, useState } from "react";
import { decodeAllImages, getProductListByCateory, updateProduct } from "../api/ProductApi";
import { ERROR } from "../assets/js/Constants";
import { sortBestItemByProductId } from "../assets/js/sortBySelectOption";

const useProducts = (mainCategory) => {
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [bestItems, setBestItems] = useState([]);

    useEffect(() => {
        showProductList();
    }, [mainCategory])

    // 제품 정보 불러오기
    const showProductList = async () => {
        try {
            const filtered = await getProductListByCateory({category: mainCategory});

            const decodedImagesByProducts = await decodedImageByProduct(filtered);

            setFilteredProducts(decodedImagesByProducts);
            showBestItem(decodedImagesByProducts); 
        } catch(error) {
            console.error(ERROR.FAIL_COMMUNICATION, error);
        }
    }

    const decodedImageByProduct = async (filtered) => {
        try {
            const decodedImages = await decodeAllImages(filtered.map(product => product.image));
            const updateProduct = await filtered.map((product, index) => ({ ...product, image: decodedImages[index]}));

            return updateProduct;
        } catch (error) {
            console.error(ERROR.FAIL_COMMUNICATION, error);
        }
    }

    // best item 정보 불러오기
    const showBestItem = async (updateProduct) => {
        try {
            const sortedIds = await sortBestItemByProductId(updateProduct);

            const limitedFilteredProducts = sortedIds.slice(0, 10);
            setBestItems(limitedFilteredProducts);            
        } catch (error) {
            console.error(ERROR.FAIL_COMMUNICATION, error);
        }

    }

    return {filteredProducts, setFilteredProducts, bestItems};
}

export default useProducts;