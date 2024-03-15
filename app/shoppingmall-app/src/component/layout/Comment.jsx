import React, { useState } from "react";
import { Row, Form, Button, Col } from "react-bootstrap";

import { ERROR } from "../../assets/js/Constants";
import { addComment } from "../../api/BoardAPI";

const Comment = ({postId, userId, parentCommentId, onCloseComment}) => {
    const [comment, setComment] = useState({
        content: '',
        image: '',
    });

    const handleCommentChange = (e) => {
        const { name, value } = e.target;
        setComment(prevPost => ({
          ...prevPost,
          [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        try {
            postComment();
            onCloseComment();
        } catch (error) {
            console.error(ERROR.FAIL_COMMUNICATION, error);
        }
    }

    const postComment = async() => {
        try {
            await addComment(postId, userId, parentCommentId, comment);
        } catch (error) {
            console.error(ERROR.FAIL_COMMUNICATION, error);
        }
    }

    return (
        <Row>
            <div className="col-12">
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="commentContent">
                        <Form.Control
                            as="textarea"
                            name="content"
                            rows={3}
                            placeholder="댓글을 입력하세요"
                            value={comment.content}
                            onChange={handleCommentChange}
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        등록
                    </Button>
                </Form>
            </div>
        </Row>
    );
};

export default Comment;
