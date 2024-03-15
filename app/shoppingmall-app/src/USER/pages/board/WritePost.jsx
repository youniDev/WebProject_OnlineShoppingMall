import React, { useReducer, useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { addPost } from '../../../api/BoardAPI';
import { useNavigate, useLocation } from 'react-router-dom';
import { BOARD, ERROR } from '../../../assets/js/Constants';
import Header from '../../../component/layout/Header';
import Footer from '../../../component/layout/Footer';

const WritePost = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state.author;

    const [post, setPost] = useState({
        title: '',
        content: '',
        category: '',
        image: '',
    });
  
    const handleSubmit = (e) => {
        e.preventDefault();

        try {
            goToCategory();
        } catch (error) {
            console.error(ERROR.FAIL_COMMUNICATION, error);
        }

    };

    const goToCategory = async() => {
        const isComplte = await addPost(user, post);

        if (isComplte) {
            alert("등록 완료!");
            navigate(`/community`, { state: { data: post.category, user: user } });
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPost(prevPost => ({
          ...prevPost,
          [name]: value,
        }));
    };
  
    return (
        <>
        <Header />
        <Container fluid>
            <Form onSubmit={handleSubmit} style={{marginTop: '10rem'}}>
                    <Form.Control
                        as="select"
                        name="category"
                        value={post.category}
                        onChange={handleChange}>
                        <option value="" disabled>Select a category</option>
                        {BOARD.CATEGORY[0].items.slice(1).map((category) => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </Form.Control>
                    <Form.Group controlId="title">
                        <Form.Label>제목</Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            placeholder="제목을 입력하세요"
                            value={post.title}
                            onChange={handleChange}
                        />
                        </Form.Group>
                    <Form.Group controlId="content">
                        <Form.Label>내용</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="content"
                            rows={3}
                            placeholder="내용을 입력하세요"
                            value={post.content}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        작성
                    </Button>
            </Form>
        </Container>
        <Footer />
        </>
    );
};

export default WritePost;