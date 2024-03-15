import React from "react";
import { Carousel, Image } from 'react-bootstrap';
import "../../assets/css/banner.css";

/** 이미지 */
import firstBanner from '../../assets/images/3.png';
import secondBanner from '../../assets/images/2.png';
import thirdBanner from '../../assets/images/1.png';

/**
 * Main Page에 사용될 배너 표시
 * @returns {JSX.Element} 배너 컴포넌트를 렌더링
 */
const Banner = () => {
    /** 이미지 디비 등록 후 받아오는방식 생각해보기 */
    const bannerImages = [firstBanner, secondBanner, thirdBanner];  // 배열에 배너 이미지들 저장

    return (
        <div className="banner">
            <Carousel>
                {bannerImages.map((banner) => (
                    <Carousel.Item>
                        <Image
                            className="d-block w-100"
                            src={banner}
                        >
                        </Image>
                    </Carousel.Item>
                ))}
            </Carousel>
        </div>
    );
};

export default Banner;