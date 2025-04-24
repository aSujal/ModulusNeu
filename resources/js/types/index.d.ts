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
};

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
