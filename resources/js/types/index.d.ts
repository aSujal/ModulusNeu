export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    full_name: string;
}

export interface Group {
    id: number;
    name: string;
    image?: string | null;
    groupMembers: GroupMember[];
    posts: Post[]
};

export interface GroupMember {
    id: number;
    role: string;
    user_name: string;
}

export interface Post {
    id: number;
    title: string,
    updated_at: Date,
    created_at: Date,
    type: string,
    group_id: number,
    description: string,
}
export interface Task {
    id: number,
    title: string,
    file: string | null,
    text: string,
    max_score: number,
    due_date: Date,
    updated_at: Date,
    created_at: Date,
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };

    notification: {
        type: "error" | "warning" | "success";
        message: string;
        data: any;
    }
};
