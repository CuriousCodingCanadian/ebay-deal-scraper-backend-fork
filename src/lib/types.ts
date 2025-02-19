// export type SearchResult = {
//     title: string;
//     price: string;
//     shipping: string;
//     type: string;
//     timeRemaining?: string;
//     link: string;
// }

// export interface PageData {
//     results: SearchResult[];
// }

export interface SearchResult {
    title: string;
    price: string;
    shipping: string;
    type: string;
    timeRemaining?: string;
    link: string;
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
    }>;
};