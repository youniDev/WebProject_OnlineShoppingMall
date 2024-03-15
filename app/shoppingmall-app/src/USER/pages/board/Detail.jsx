import React, { useEffect, useState } from "react";
import { Container, Row, Table, Form, Button, Col } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

import Header from "../../../component/layout/Header";
import Footer from "../../../component/layout/Footer";
import Comment from "../../../component/layout/Comment";


import { deleteComment, deletePost, fetchCommentsByPostId } from "../../../api/BoardAPI";
import { ERROR } from "../../../assets/js/Constants";

function Detail() {
    const location = useLocation();
    const navigate = useNavigate();
    const post = location.state.data;
    const id = location.state.id;
    const userId = location.state.userId;

    const [comments, setComments] = useState([]);
    const [replyCommentId, setReplyCommentId] = useState(null);

    useEffect(() => {
        getCommentsByPostId();
    }, [comments]);


    const getCommentsByPostId = async() => {
        const result = await fetchCommentsByPostId(post.postId);

        result.forEach((comment, index) => {
            // 만약 comment 객체의 parentCommentId가 존재한다면
            if (comment.parentCommentId !== null) {
                // 해당 댓글의 자식 댓글을 찾아서 reply 필드에 추가함
                result.filter((c) => {
                    const isChildComment = (c.commentId === comment.parentCommentId);
        
                    // 현재 댓글이 자식 댓글이면 해당 부모 댓글의 reply 필드에 추가
                    if (isChildComment) {
                        // 부모 댓글의 reply 필드가 없다면 빈 배열로 초기화
                        if (!c.reply) {
                            c.reply = [];
                        }
                        // 자식 댓글을 부모 댓글의 reply 필드에 추가
                        c.reply.push(comment);
                    }
                    return isChildComment;
                });
                // 추가된 comment 필드를 삭제함
                delete result[index];
            }
        });

        setComments(result);
    }

    const handleReplyComment = (commentId) => {
        if (replyCommentId === commentId) {
            setReplyCommentId(null);

            return ;
        }
        setReplyCommentId(commentId);
    };

    const handleCloseComment = () => {
        setReplyCommentId(null);
    }
    
    const handleDeleteComments = async (commentId) => {
        try {
            await deleteComment(commentId);
        } catch(error) {
            alert("다시 시도해주세요.");
            console.log(ERROR.FAIL_COMMUNICATION, error);
        }
    }

    const handleDeletePost = async (postId) => {
        try {
            alert("삭제 되었습니다");
            await deletePost(postId);
            navigate(`/community/${id}`, { state: { data: id, user: userId } });
        } catch(error) {
            alert("다시 시도해주세요.");
            console.log(ERROR.FAIL_COMMUNICATION, error);
        }
    }

    return (
        <>
            <Header/>
            <Container className="rm-10">
                <h5 className="text-center notice-title-custom">{id}</h5>
                {/* 작성글 */}
                <Row>
                    <div className="col-12">
                    {post.userId === userId && (
                        <Button onClick={() => handleDeletePost(post.postId)}> 삭제 </Button>
                    )}
                        <div className="table-responsive">
                            <Table className="table">
                                <tr>
                                    <th>제목</th>
                                    <td>{post.title}</td>
                                </tr>
                                <tr>
                                    <th>작성시간</th>
                                    <td>{post.createDate}</td>
                                </tr>
                                <tr>
                                    <th>작성자</th>
                                    <td>{post.userId}</td>
                                </tr>
                                <tr>
                                    <th>내용</th>
                                    <td>{post.content}</td>
                                </tr>
                            </Table>
                        </div>
                    </div>
                </Row>
                {/* 댓글 */}
                {Array.isArray(comments) && comments.map((c) => (
                    <Row key={c.commentId}>
                        <Col sm={2}>
                            <p>{c.commentUserId}</p>
                        </Col>
                        {!c.reply && 
                            <Col sm={4}>
                                <Button onClick={() => handleReplyComment(c.commentId)}> 댓글 </Button>
                            </Col>
                        }
                        {c.commentUserId === userId && (
                            <Col sm={4}>
                                <Button onClick={() => handleDeleteComments(c.commentId)}> 삭제 </Button>
                            </Col>
                        )}
                        <p>{c.content}</p>
                        {/* 대댓글의 댓글 작성 */}          
                        {!Array.isArray(c.reply) && (replyCommentId === c.commentId) && <Comment postId={post.postId} userId={userId} parentCommentId={c.commentId} onCloseComment={handleCloseComment}/>}
                        <h5> REPLY </h5>
                        {Array.isArray(c.reply) && c.reply.map((reply, i) => (
                            <React.Fragment>
                                <Row key={reply.commentId}>
                                    <Col sm={2}>
                                    <p>{reply.commentUserId}</p>
                                    </Col>
                                    {/* 마지막 인덱스인 경우에만 버튼 표시 */}
                                    {i === c.reply.length - 1 &&
                                        <Col sm={4}>
                                            <Button onClick={() => handleReplyComment(reply.commentId)}> 댓글 </Button>
                                        </Col>
                                    }
                                    {reply.commentUserId === userId && (
                                        <Col sm={4}>
                                            <Button onClick={() => handleDeleteComments(reply.commentId)}> 삭제 </Button>
                                        </Col>
                                    )}
                                    <p>{reply.content}</p>
                                </Row>
                                {/* 대댓글의 댓글 작성 */}          
                                {i === c.reply.length - 1 && (replyCommentId === reply.commentId) && <Comment postId={post.postId} userId={userId} parentCommentId={c.commentId} onCloseComment={handleCloseComment}/>}
                            </React.Fragment>
                        ))}
                        <hr />
                    </Row>
                ))}
                {/* 댓글 등록 */}
                <Comment postId={post.postId} userId={userId} />
            </Container>
            <Footer/ >
        </>
    );
};

export default Detail;