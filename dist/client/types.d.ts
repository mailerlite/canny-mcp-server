export interface CannyApiResponse<T = any> {
    data?: T;
    error?: string;
    status: number;
}
export interface CannyPostTag {
    id: string;
    name: string;
    color?: string;
    created?: string;
    postCount?: number;
    url?: string;
}
export interface CannyPostCategory {
    id: string;
    name: string;
    url?: string;
    board?: {
        id: string;
        name: string;
        url?: string;
    };
}
export interface CannyPostAuthor {
    id: string;
    name: string;
    email?: string;
    isAdmin?: boolean;
    url?: string;
    userID?: string;
}
export interface CannyPostBoard {
    id: string;
    name: string;
    url?: string;
    postCount?: number;
    isPrivate?: boolean;
}
export interface CannyAssignedAdmin {
    id: string;
    name: string;
    email?: string;
    url?: string;
    isAdmin?: boolean;
}
export interface CannyPost {
    id: string;
    title: string;
    details?: string | null;
    status: string;
    author: CannyPostAuthor;
    board: CannyPostBoard;
    category?: CannyPostCategory | null;
    tags?: CannyPostTag[];
    voteCount?: number;
    votes?: number;
    score?: number;
    commentCount?: number;
    created?: string;
    createdAt?: string;
    updated?: string;
    updatedAt?: string;
    eta?: string | null;
    imageURLs?: string[];
    originURL?: string | null;
    assignedAdmins?: CannyAssignedAdmin[];
    customFields?: Record<string, unknown> | null;
    url: string;
    [key: string]: unknown;
}
export interface CannyBoard {
    id: string;
    name: string;
    url: string;
    postCount?: number;
    isPrivate?: boolean;
    privateComments?: boolean;
    token?: string;
    created?: string;
}
export interface CannyCategory {
    id: string;
    name: string;
    postCount?: number;
    boardId?: string;
    created?: string;
    board?: {
        id: string;
        name: string;
        url?: string;
    };
}
export interface CannyComment {
    id: string;
    author: {
        id: string;
        name: string;
        email?: string;
        isAdmin?: boolean;
    };
    value: string;
    created: string;
    internal?: boolean;
    postId?: string;
    url?: string;
}
export interface CannyUser {
    id: string;
    name: string;
    email?: string;
    isAdmin?: boolean;
    created: string;
    avatarURL?: string;
    userID?: string;
    url?: string;
    lastSeen?: string;
}
export interface CannyTag {
    id: string;
    name: string;
    postCount?: number;
    url?: string;
    color?: string;
    created?: string;
}
export interface CannyListPostsResponse {
    posts: CannyPost[];
    hasMore?: boolean;
    next?: string;
}
export interface CannyListCommentsResponse {
    comments: CannyComment[];
    hasMore?: boolean;
    next?: string;
}
export interface CannyListUsersResponse {
    users: CannyUser[];
    hasMore?: boolean;
    next?: string;
}
export interface CannyListTagsResponse {
    tags: CannyTag[];
    hasMore?: boolean;
    next?: string;
}
//# sourceMappingURL=types.d.ts.map