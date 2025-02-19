export interface SearchResult {
    title: string;
    price: string;
    shipping: string;
    type: string;
    timeRemaining?: string;
    link: string;
    thumbnail: string;
}

export interface ApiResponse {
    results: SearchResult[];
}

export type PageData = {
    results: Array<{
        title: string;
        price: string;
        shipping: string;
        type: string;
        timeRemaining?: string;
        link: string;
        thumbnail: string;
    }>;
};