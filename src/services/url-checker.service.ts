import axios, { AxiosError } from 'axios';
import { prisma } from '../lib/prisma';

export interface UrlCheckResult {
  status: 'UP' | 'DOWN' | 'ERROR';
  statusCode?: number;
  responseTime?: number;
  errorMessage?: string;
  errorType?: string;
  headers?: Record<string, string>;
}

/**
 * Execute HTTP request to check URL status
 */
export async function checkUrl(url: string): Promise<UrlCheckResult> {
  const startTime = Date.now();

  try {
    const response = await axios.get(url, {
      timeout: 30000, // 30 seconds timeout
      validateStatus: () => true, // Don't throw on any status code
      maxRedirects: 5,
    });

    const responseTime = Date.now() - startTime;

    // Consider 2xx and 3xx as UP
    const status = response.status >= 200 && response.status < 400 ? 'UP' : 'DOWN';

    return {
      status,
      statusCode: response.status,
      responseTime,
      headers: response.headers as Record<string, string>,
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      
      // Determine error type
      let errorType = 'UNKNOWN_ERROR';
      if (axiosError.code === 'ECONNABORTED' || axiosError.code === 'ETIMEDOUT') {
        errorType = 'TIMEOUT';
      } else if (axiosError.code === 'ENOTFOUND' || axiosError.code === 'EAI_AGAIN') {
        errorType = 'DNS_ERROR';
      } else if (axiosError.code === 'ECONNREFUSED') {
        errorType = 'CONNECTION_REFUSED';
      } else if (axiosError.code === 'ECONNRESET') {
        errorType = 'CONNECTION_RESET';
      } else if (axiosError.code === 'CERT_HAS_EXPIRED' || axiosError.code === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE') {
        errorType = 'SSL_ERROR';
      } else if (!axiosError.code) {
        errorType = 'NETWORK_ERROR';
      }

      return {
        status: 'ERROR',
        responseTime: responseTime > 0 ? responseTime : undefined,
        errorMessage: axiosError.message,
        errorType,
      };
    }

    // Generic error
    return {
      status: 'ERROR',
      responseTime: responseTime > 0 ? responseTime : undefined,
      errorMessage: error instanceof Error ? error.message : 'Unknown error occurred',
      errorType: 'UNKNOWN_ERROR',
    };
  }
}

/**
 * Log the check result to database
 */
export async function logCheckResult(
  urlId: string,
  result: UrlCheckResult
): Promise<void> {
  await prisma.log.create({
    data: {
      urlId,
      status: result.status,
      statusCode: result.statusCode ?? null,
      responseTime: result.responseTime ?? null,
      errorMessage: result.errorMessage ?? null,
      errorType: result.errorType ?? null,
      headers: result.headers ? JSON.stringify(result.headers) : null,
      checkAt: new Date(),
    },
  });
}

/**
 * Execute URL check and log the result
 */
export async function executeUrlCheck(
  urlId: string,
  urlString: string
): Promise<UrlCheckResult> {
  try {
    const result = await checkUrl(urlString);
    
    // Log the result to database
    await logCheckResult(urlId, result);

    return result;
  } catch (error) {
    throw error;
  }
}
