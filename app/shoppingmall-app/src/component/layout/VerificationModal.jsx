import React, { useState } from 'react';
import { Button, Modal, Form, Row, Col} from 'react-bootstrap';
import axios from 'axios';

// icon
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';

function VerificationModal(props) {
  const baseUrl = "http://localhost:8080";

  const [disable, setDisable] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [emailValue, setEmailValue] = useState('');
  const [phoneValue, setPhoneValue] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationInputCode, setVerificationInputCode] = useState('');

  const ErrorMessage = {
    BAD : "유효성 검사에 실패했습니다.",
    BAD_AUTHENTICATE : "본인 인증에 실패하셨습니다.",
    IS_NULL_FIELD : "이 필드는 필수 입력 항목입니다.",
    IS_NULL : "입력하지 않은 항목이 있습니다.",
    NOT_SAME : "비밀번호가 일치하지 않습니다.",
    IS_DUPLICATE : "이미 가입된 이메일입니다. 다른 이메일을 입력해주세요.",
    NOT_AUTHENTICATE_USER : "본인 인증을 해야합니다.",
    NOT_CHECK_BTN : "아이디 중복 검사를 해야합니다",
    GOOD_EMAIL : "사용 가능한 아이디입니다",
    GOOD_AUTHENTICATE : "본인 인증에 성공하셨습니다."
};

  const handleBackEmail = () => {
    setShowEmailModal(false);
    setShowModal(true);
  }

  const handleBackPhone = () => {
    setShowPhoneModal(false);
    setShowModal(true);
  }

  /* email or phone 모달 선택해서 open */
  const handleVerificationClick = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOption(null);
    setEmailValue('');
    setPhoneValue('');
  };
  const handleOptionClick = (option) => {
    setSelectedOption(option);
    handleCloseModal();
    if (option === 'email') {
      handleEmailClick();
    } else if (option === 'phone') {
      handlePhoneClick();
    }
  };
  const handleEmailClick = () => {
    setShowEmailModal(true);
  };
  const handlePhoneClick = () => {
    setShowPhoneModal(true);
  };

  // 이메일 유효성 검사
  const isEmailValid = (email) => {
    // eslint-disable-next-line
    const rex = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
    return rex.test(email);
  };

  // 본인 인증을 위해 서버에 이메일 전송
  async function sendEmail(email) {
    await axios
    .post(baseUrl + "/api/send/verification-email", {email})
    .then((res)=>{
        console.log("code >> " + res.data);
        setVerificationCode(res.data);
    })
    .catch((error)=>{
        console.log(error);
    })
  }

  // 이메일 모달 확인 버튼 클릭 시,
  const handleEmailConfirm = () => {
    if (!isEmailValid(emailValue)) {
      alert(ErrorMessage.BAD);
      return;
    }
    // send email to server
    sendEmail(emailValue);
  };

  // 본인 인증을 위해 서버에 핸드폰 번호 전송
  async function sendPhone(phone) {
    await axios
    .post(baseUrl + "/api/send/verification-phone", {phone})
    .then((res)=>{
        console.log("code >> " + res.data);
        setVerificationCode(res.data);
    })
    .catch((error)=>{
        console.log(error);
    })
  }
  
  // 핸드폰 모달 확인 버튼 클릭 시,
  const handlePhoneConfirm = () => {
    sendPhone(phoneValue);
  };

  // 휴대폰 번호 입력 시 숫자만 입력 가능하도록
  const handlePhoneInputChange = (e) => {
    const inputValue = e.target.value.replace(/[^0-9]/g, ''); // 숫자 이외의 문자 제거
    setPhoneValue(inputValue);
  };

  // 자동 하이픈 추가
  const formatPhoneNumber = (input) => {
    const match = input.match(/^(\d{3})(\d{4})(\d{4})$/);

    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }

    return input;
  };

  // 인증번호 비교 
  const handleVerificationCodeConfirm = () => {
    // 본인 인증 성공 시,
    if (verificationCode === parseInt(verificationInputCode, 10)) {
      alert(ErrorMessage.GOOD_AUTHENTICATE);

      setDisable(true);
      props.verificationBtnDisabled(true);
      handleCloseEmailModal();
      handleClosePhoneModal();
      return ;
    }
    
    alert(ErrorMessage.BAD_AUTHENTICATE);  // 본인 인증 실패 시,
  }

  // 이메일 모달 관련 상태
  const [showEmailModal, setShowEmailModal] = useState(false);

  const handleCloseEmailModal = () => {
    setShowEmailModal(false);
    setEmailValue('');
    setVerificationInputCode('');
  };

  // 휴대폰 모달 관련 상태
  const [showPhoneModal, setShowPhoneModal] = useState(false);

  const handleClosePhoneModal = () => {
    setShowPhoneModal(false);
    setPhoneValue('');
    setVerificationInputCode('');
  };

  return (
    <>
      <Button
        type="button"
        variant="primary"
        className="btn"
        onClick={handleVerificationClick}
        disabled={disable}
      >
        본인인증
      </Button>

      <Modal show={showModal} onHide={handleCloseModal} backdrop="static" centered>
        <Modal.Header closeButton>
          <Modal.Title>본인 인증</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3 text-center" controlId="formBasicEmail">
            <Button
              variant="primary"
              className="modal-btn-custom btn-space"
              onClick={() => handleOptionClick('email')}
            >
              <FontAwesomeIcon icon={faEnvelope} className='icon-space'/>이메일 본인 인증
            </Button>
            <Button
              variant="primary"
              className="modal-btn-custom"
              onClick={() => handleOptionClick('phone')}
            >
              <FontAwesomeIcon icon={faPhone} className='icon-space'/>휴대폰 본인 인증
            </Button>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            닫기
          </Button>
        </Modal.Footer>
      </Modal>

      {/* 이메일 모달 */}
      <Modal show={showEmailModal} onHide={handleCloseEmailModal} backdrop="static" centered>
        <Modal.Header closeButton>
          <Modal.Title>이메일 본인 인증</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" as={Row}>
            <Col sm={2}>
              <Form.Label>
                이메일
              </Form.Label>
            </Col>
            <Col sm={6}>
              <Form.Control 
                type="email"
                placeholder="email@example.com"
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
              />
            </Col>
            <Col sm={2}>
              <Button type="submit" variant="primary" className="btn-block" onClick={handleEmailConfirm}>인증</Button>
            </Col> 
          </Form.Group>
          <Form.Group className="mb-3" as={Row}>
            <Col sm={2}>
              <Form.Label>
                인증번호
              </Form.Label>
            </Col>
            <Col sm={6}>
              <Form.Control 
              type="text"
              value={verificationInputCode}
              onChange={(e) => setVerificationInputCode(e.target.value)}
              />
            </Col>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleBackEmail}>
            뒤로
          </Button>
          <Button variant="secondary" onClick={handleVerificationCodeConfirm}>
            확인
          </Button>
        </Modal.Footer>
      </Modal>

      {/* 휴대폰 모달 */}
      <Modal show={showPhoneModal} onHide={handleClosePhoneModal} backdrop="static" centered>
        <Modal.Header closeButton>
          <Modal.Title>휴대폰 본인 인증</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" as={Row}>
            <Col sm={2}>
              <Form.Label>
                휴대폰
              </Form.Label>
            </Col>
            <Col sm={4}>
              <Form.Control
                type="tel"
                placeholder="000-1234-1234"
                maxLength="12"
                value={formatPhoneNumber(phoneValue)}
                onChange={handlePhoneInputChange}
              />
            </Col>
            <Col sm={2}>
              <Button type="submit" variant="primary" className="btn-block" onClick={handlePhoneConfirm}>인증</Button>
            </Col> 
          </Form.Group>

          {/* 인증번호 입력 */}
          <Form.Group className="mb-3" as={Row}>
            <Col sm={2}>
              <Form.Label>
                인증번호
              </Form.Label>
            </Col>
            <Col sm={6}>
              <Form.Control 
              type="text"
              value={verificationInputCode}
              onChange={(e) => setVerificationInputCode(e.target.value)}
              />
            </Col>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleBackPhone}>
            뒤로
          </Button>
          <Button variant="secondary" onClick={handleVerificationCodeConfirm}>
            확인
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default VerificationModal;