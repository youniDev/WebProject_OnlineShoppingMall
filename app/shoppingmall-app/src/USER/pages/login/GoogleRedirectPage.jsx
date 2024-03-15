import React, {useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import { getAccessTokenByGoogle } from "../../../api/AuthAPI";

const GoogleRedirectPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleOAuthGoogle = async (e) => {
        getAccessTokenByGoogle(e)
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
            handleOAuthGoogle(code);
        }
    }, [location]);

    return (
        <div>
            <div>Processing...</div>
        </div>
    );
};

export default GoogleRedirectPage;