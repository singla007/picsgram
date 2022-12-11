import { gql } from '@apollo/client';

export const NEW_POSTS_SUBSCRIPTION = gql`
    subscription {
        newPost {
            id
            caption
            description
            createdAt
            createdBy {
                id
                name
            }
            likes {
                id
                user {
                    id
                    name
                }
            }
        }
    }
`;

// subscribe to new likes 
export const NEW_LIKES_SUBSCRIPTION = gql`
    subscription {
        newLike {
            id
            post {
                id
                caption
                description
                createdAt
                createdBy {
                    id
                    name
                }
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
            }
        }
    }
`;
// fetch all posts with given params such as take(how much itema you want), skip( how many items you want to skip ), order by etc.
export const FEED_QUERY = gql`
    query FeedQuery(
        $take: Int
        $skip: Int
        $orderBy: PostOrderByInput
    ) {
        feed(take: $take, skip: $skip, orderBy: $orderBy) {
            id
            posts {
                id
                createdAt
                caption
                description
                createdBy {
                    id
                    name
                }
                likes {
                    id
                    user {
                        id
                        name
                    }
                }
            }
            count
        }
    }
`;

