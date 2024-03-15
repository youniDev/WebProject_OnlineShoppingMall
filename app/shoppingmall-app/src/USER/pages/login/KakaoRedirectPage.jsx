import React, {useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import { getAccessTokenByKakao } from "../../../api/AuthAPI";

const KakaoRedirectPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleOAuthKakao = async (e) => {
        getAccessTokenByKakao(e)
        .then((response) => {
            localStorage.clear();
            localStorage.setItem('accessToken', response);
            window.location.href = `/`;
        }).catch((error) => {
            navigate("/fail");
        });
    };

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');
        if (code) {
            handleOAuthKakao(code);
        }
    }, [location]);

    return (
        <div>
            <div>Processing...</div>
        </div>
    );
};

export default KakaoRedirectPage;