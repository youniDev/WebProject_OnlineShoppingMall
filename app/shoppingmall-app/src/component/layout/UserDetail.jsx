import React, { useEffect, useState } from "react";

import { ERROR } from '../../assets/js/Constants';
import { fetchUserInfo } from '../../api/UserAPI';

import RegistrationUser from './RegistrationUser';
import { Container, Row, Col, Form, Button } from "react-bootstrap";

const UserDetail = ({userId}) => {
    const [user, setUser] = useState([]);
    const [password, setPassword] = useState('');
    const [showRegistrationUser, setShowRegistrationUser] = useState(false);

    useEffect(() => {
        if (userId) {
            fetchUserInfo(userId)
            .then((res) => {
                const addressParts = res.address.split('/');

                const updatedUser = {
                    ...res,
                    id: res.user_id,
                    address: addressParts[0],
                    detail: addressParts[1],
                };
                setUser(updatedUser);

            }).catch((error) => {
                console.error(ERROR.FAIL_COMMUNICATION[ERROR.TEXT_EN], error);
            })
        }
    }, []);

    const handleInputChange = (e) => {
        setPassword(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (user.password === password) {
            setShowRegistrationUser(true);
        }
    }

    return (
        <Container>
            {showRegistrationUser ? (
                <RegistrationUser userInfo={user} />
            ) : (
                <Form onSubmit={handleSubmit}>
                    <Form.Group as={Row}>
                        <Form.Label column sm={2} className="col-form-label">비밀번호</Form.Label>
                        <Col sm={3}>
                            <Form.Control type="password" placeholder="비밀번호" onChange={handleInputChange} name="password" value={password} />
                        </Col>
                        <Col sm={2}>
                            <Button type="submit" variant="primary" className="btn-block">확인</Button>
                        </Col>
                    </Form.Group>
                </Form>
            )}
        </Container>
    );
};

export default UserDetail;