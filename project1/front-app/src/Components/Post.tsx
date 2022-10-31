export interface IPost {
    id?: number;
    title: string;
    content: string;
};

export const Post = (post: IPost) => {
    return (
        <>
            <h2> {post.title} </h2>
            <p>{post.content}</p>
        </>);

};