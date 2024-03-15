import React, { useEffect, useState } from "react";
import { Button, Row, Table, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { fetchPostByCategory } from "../../api/BoardAPI";
import { ERROR } from "../../assets/js/Constants";

const Board = ( {dropdownId, user} ) => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        getPostsByCategory();
    }, [dropdownId]);

    const getPostsByCategory = async() => {
        try {
            const result = await fetchPostByCategory(dropdownId);

            setPosts(result);
        } catch (error) {
            console.error(ERROR.FAIL_COMMUNICATION, error);
        }
    }

    const handleWriteClick = () => {
        navigate(`/write`, { state: { author: user , category : dropdownId} });
    }

    return (
        <>
            <Row>
                <Col>
                    <Button type='button' onClick={handleWriteClick}> 글쓰기 </Button>
                </Col>
            </Row>
            <Row>
                <div className="col-12">
                    <div className="table-responsive">
                        <Table className="table">
                            <thead className="table-light thead-custom">
                                <tr>
                                    <th scope="col">번호</th>
                                    <th scope="col">제목</th>
                                    <th scope="col">작성자</th>
                                </tr>
                            </thead>
                            <tbody className="customtable">
                            {Array.isArray(posts) && posts.map((post) => (
                                <tr key={post.postId}                         
                                    onClick={() => {
                                    navigate(`/Detail/${post.postId}`, { state: { data: post , id : dropdownId, userId: user} });
                                }}>
                                    <th>{post.postId}</th>
                                    <td>
                                        {post.title}
                                    </td>
                                    <td>{post.userId}</td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </div>
                </div>
            </Row>
        </>
    );
};

export default Board;