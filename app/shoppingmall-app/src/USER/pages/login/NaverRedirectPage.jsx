import React, {useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import { getAccessTokenByNaver } from "../../../api/AuthAPI";

const NaverRedirectPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleOAuthNaver = async (e) => {
        getAccessTokenByNaver(e)
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
            handleOAuthNaver(code);
        }
    }, [location]);

    return (
        <div>
            <div>Processing...</div>
        </div>
    );
};

export default NaverRedirectPage;