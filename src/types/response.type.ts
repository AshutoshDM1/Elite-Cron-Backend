interface APIResponseType {
    success: boolean;
    message: string;
    data?: any;
    error?: string;
    statusCode: number;
}

export default APIResponseType;