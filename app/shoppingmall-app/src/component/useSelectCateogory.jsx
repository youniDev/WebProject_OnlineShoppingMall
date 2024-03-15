import { categoryDropdowns } from "../api/ProductApi";


const useSelectCategory = (mainCategory) => {
    // 사용자가 선택한 카테고리 불러오기
    const getCategory = () => {
        const foundCategory = categoryDropdowns.find(category => {
            return category.title === mainCategory || category.items.map(item => item.replace(/\//g, ''))?.includes(mainCategory);
        });

        return foundCategory ? foundCategory : { title: mainCategory, items: [] };
    };

    return {getCategory};
};

export default useSelectCategory;