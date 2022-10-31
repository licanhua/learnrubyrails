import { useState, useEffect } from "react";
import { IPost, Post } from "./Post";
import axios from 'axios'
import { PostForm } from "./PostForm";

export const PostList = () => {
    const [posts, setPosts] = useState<IPost[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getPosts();
    }, []);

    const getPosts = async () => {
        setIsLoading(true);
        const response = await axios.get('http://localhost:3000/api/v1/posts');
        setPosts(response.data);
        setIsLoading(false)
    }

    const updatePostList = (post: IPost) => {
        setPosts([post, ...posts]);   
      }

    return (
        <>
            <h1>post list</h1>
            {isLoading && (<>Loading</>)}
            {!isLoading && (<PostForm updatePostList={updatePostList} />)}
            {!isLoading &&
                (<>{
                    posts.map((post: IPost) => (
                        <Post
                            key={post.id}
                            title={post.title}
                            content={post.content}
                        />
                    ))
                }</>
                )}
        </>
    )

}