import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

import { ERROR, ROUTE, SIGNUP } from '../../assets/js/Constants';
import { addUser, updateUser } from '../../api/UserAPI';
import VerificationModal from './VerificationModal';

import { isDuplicationEmail, setErrorMsg, validate, isFormRight, findAddressByPostCode, isNullForm, updateUserForm } from '../../assets/js/RegistrationUserFunction';

// 주소 찾기 API
import { useDaumPostcodePopup } from 'react-daum-postcode';

const RegistrationUser = ({userInfo}) => {
    const navigate = useNavigate();
    const open = useDaumPostcodePopup(SIGNUP.ADDRESS_DAUM_POST_URL);

    const [showButton, setShowButton] = useState({
        idDuplication: false,
        verification: '',
    })
    const [formData, setFormData] = useState(userInfo);
    const [errorState, setErrorState] = useState({
        id: { state: '', message: '' },
        password: { state: '', message: '' },
        passwordMatch: { state: '', message: '' },
        name: { state: '', message: '' },
        address: { state: '', message: '' },
        detail: { state: '', message: '' },
    });    
    
    const verificationDisabled = (btn) => {
        setShowButton(prevState => ({...prevState, verification: btn}));
    }
    const setError = (field, text) => {
        if (field === "id") {
            setShowButton(prevState => ({...prevState, idDuplication: false}));
        }
        setErrorState(prevState => ({ ...prevState, [field]: { state: 'block', message: text }}));
    }

    /* 
    * 회원가입 form data 서버에 전송
    */
    const sendUserInfo = (data) => {
        addUser(data)
        .then((res) => {
            console.log(res);
            navigate(ROUTE.MAIN);
        }).catch((error) => {
            alert(ERROR.FAIL_COMMUNICATION[ERROR.SIGNUP.FAIL]);
            console.error(ERROR.FAIL_COMMUNICATION[ERROR.TEXT_EN], error);
        });
    }
    const updateUserInfo = (data) => {
        updateUser(data)
        .then((res) => {
            console.log(res);
            navigate(ROUTE.MAIN);
        }).catch((error) => {
            alert(ERROR.FAIL_COMMUNICATION[ERROR.SIGNUP.FAIL]);
            console.error(ERROR.FAIL_COMMUNICATION[ERROR.TEXT_EN], error);
        });
    }
    /**
     * 제출
     * @param {*} e - 제출 동작 멈춤
     */
    const handleSubmit = (e) => {
        e.preventDefault();

        if (userInfo.id) {
            if (isNullForm) {
                const updateData = updateUserForm(formData);

                updateUserInfo(updateData);
            }
        }
        if (!userInfo.id) {
            if (isFormRight(formData, errorState, showButton)) {
                const updateData = updateUserForm(formData);

                sendUserInfo(updateData);
            }
        }
    }

    /**
     * 이메일 중복 검사
     */
    const handleCheckDuplicateEmail = async () => {
        if (validate("id", formData.id)) {
            const result = await isDuplicationEmail(formData.id, errorState.id.state);

            if (!result) setShowButton(prevState => ({...prevState, idDuplication: true}));   // 중복 검사 버튼 비활성화 
        }
    };

    // form data 저장
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setError(name, setErrorMsg(value));

        if (validate(name, value)) {
            setErrorState(prevState => ({ ...prevState, [name]: { state: ''}}));
        }

        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };
    // 비밀번호 일치한지 확인
    const validatePasswordMatch = (e) => {
        const { name, value } = e.target;

        setError(name, setErrorMsg(value));

        // 같을 경우
        if(value === formData.password) {
            setErrorState(prevState => ({ ...prevState, [name]: { state: ''}}));
        }
    };

    // 주소 API
    const handleComplete = (data) => {
        let fullAddress = findAddressByPostCode(data);

        setFormData((prevData) => ({ ...prevData, address: fullAddress }));
    };
    const handleClickByPostcode = () => {
        open({ onComplete: handleComplete });
    };

    function renderFormInput(label, placeholder, type, name, buttonText, onClick, buttonDisabled) {
        return (
            <Form.Group as={Row} key={name}>
                <Form.Label column sm={2} className={`${label ? 'label-basic-info-custom' : ''} ${type === 'password' ? 'col-form-label' : ''}`}>{label}</Form.Label>
                {type && 
                <Col sm={3}>
                    <Form.Control
                        type={type}
                        placeholder={placeholder}
                        onChange={handleInputChange}
                        value={formData[name]}
                        name={name}
                        readOnly={name === 'id' && userInfo.id} 
                    />
                </Col>}
                {buttonText && (
                    <Col sm={2}>
                        <Button variant="primary" onClick={onClick} disabled={buttonDisabled}>{buttonText}</Button>
                    </Col>
                )}
                {name && (
                    <Col sm={4} className="error-text-custom" id={`showError${name.charAt(0).toUpperCase() + name.slice(1)}`}>
                        <small className="text-danger" style={{ display: errorState[name].state ? 'block' : 'none' }}>{errorState[name].message}</small>
                    </Col>
                )}
            </Form.Group>
            );
    }

    return (
        <Container className="rm-10" style={{marginTop: '-5rem'}}>
            <Form onSubmit={handleSubmit}>
                <Row className="basic-info-container-custom">
                    <h5 className="col-sm-2 text-basic-info-custom"> 기본정보 </h5>
                    <Col sm={8}/>
                    <small className="col-sm-2 text-necessary"> 필수 입력 정보 </small>
                </Row>
                <hr style={{width: '45%'}}/>

                {userInfo.id && (
                    <>
                        {renderFormInput('아이디', 'email@example.com', 'text', 'id', '', null, true)}
                        {renderFormInput('이름', '이름', 'text', 'name', '', null, false)}
                        {renderFormInput('주소', '주소', 'text', 'address', '우편번호찾기', handleClickByPostcode, false)}
                        {renderFormInput(null, '상세주소', 'text', 'detail', '', null, false)}
                        {renderFormInput('비밀번호변경', '', '', 'password', '비밀번호변경', null, false)}
                        <h5 className="extraInfo">추가정보</h5>
                        <hr style={{width: '45%'}}/>
                        <Row>
                            <Form.Label column sm={2}>생년월일</Form.Label>
                            <Col sm={2}>
                                <div className="md-form md-outline input-with-post-icon datepicker">
                                    <Form.Control type="date" id="example inputErrorText" value={formData.birth}onChange={handleInputChange} name="birth" />
                                </div>
                            </Col>
                        </Row>
                        <Form.Group as={Row}>
                            <Form.Label column sm ={2}>포인트</Form.Label>
                            <Col sm={2}>
                                <Form.Control type='text' value={formData.point} name="point" readOnly/>
                            </Col>
                        </Form.Group>
                    </>
                )}

                {!userInfo.id && (
                    <>
                        {renderFormInput('아이디', 'email@example.com', 'text', 'id', '중복확인', handleCheckDuplicateEmail, showButton.idDuplication)}
                        {renderFormInput('비밀번호', '비밀번호', 'password', 'password', '', null, false)}
                        {renderFormInput('비밀번호 확인', '비밀번호 확인', 'password', 'passwordMatch', '', validatePasswordMatch, false)}
                        {renderFormInput('이름', '이름', 'text', 'name', '', null, false)}
                        {renderFormInput('주소', '주소', 'text', 'address', '우편번호찾기', handleClickByPostcode, false)}
                        {renderFormInput(null, '상세주소', 'text', 'detail', '', null, false)}          
                        {/* 본인인증 */}
                        <Form.Group as={Row}>
                            <Form.Label column sm={2} className="col-form-label label-basic-info-custom">본인 인증</Form.Label>
                            <Col sm={2}>
                                <VerificationModal verificationBtnDisabled={verificationDisabled}/>
                            </Col>
                        </Form.Group>
                        <h5 className="extraInfo">추가정보</h5>
                        <hr style={{width: '45%'}}/>
                        <Row>
                            <Form.Label column sm={2}>생년월일</Form.Label>
                            <Col sm={2}>
                                <div className="md-form md-outline input-with-post-icon datepicker">
                                    <Form.Control type="date" id="example inputErrorText" value={formData.birth}onChange={handleInputChange} name="birth" />
                                </div>
                            </Col>
                            <Col sm={4}>
                                <small className="text-event blinking-text">🧡 생일 쿠폰 지급 🧡</small>
                            </Col>
                        </Row>
                        <Form.Group as={Row}>
                            <Form.Label column sm={2}>가입 경로</Form.Label>
                            <Col sm={6}>
                                <Form.Control type="text" id="inputErrorText" onChange={handleInputChange} name="path" />
                            </Col>
                        </Form.Group>
                    </>
                )}
                <Form.Group as={Row}>
                    <Col sm={2}></Col>
                    <Col sm={8}></Col>
                    <Col sm={2}>
                        <Button type="submit" variant="primary" className="btn-block">제출</Button>
                    </Col>
                </Form.Group>
            </Form>
        </Container>
    );
}

export default RegistrationUser;