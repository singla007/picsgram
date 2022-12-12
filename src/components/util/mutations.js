import { gql } from '@apollo/client';


export const LIKE_MUTATION = gql`
    mutation LikeMutation($postId: ID!) {
        like(postId: $postId) {
            id
            post {
                id
                likes {
                    id
                    user {
                        id
                        name
                    }
                }
            }
            user {
                id
                name
            }
        }
    }
`;
export const CREATE_POST_MUTATION = gql`
    mutation PostMutation(
        $description: String!
        $caption: String!
        $file: Upload!
    ) {
        createPost(description: $description, caption: $caption, file: $file ) {
            id
            createdAt
            caption
            description
            imageUrl
            
        }
    }
`;
