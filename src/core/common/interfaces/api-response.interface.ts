export interface ApiResponse<T> {
    data: T;
    message: string;
    code: string;
}
