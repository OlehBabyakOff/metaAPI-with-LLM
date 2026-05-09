import { Injectable, Logger } from '@nestjs/common';
import { HttpException } from '@nestjs/common';

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
}

export interface HttpResponse<T> {
  data: T;
  status: number;
}

@Injectable()
export class HttpService {
  private readonly logger = new Logger(HttpService.name);

  async request<T>(url: string, options: RequestOptions = {}): Promise<HttpResponse<T>> {
    const { method = 'GET', headers = {}, body, params } = options;

    const fullUrl = params ? this.buildUrl(url, params) : url;

    this.logger.debug(`[${method}]: [${fullUrl}]`);

    const response = await fetch(fullUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
      this.logger.error(`HTTP Error ${response.status}: ${JSON.stringify(data)}`);

      throw new HttpException(data, response.status);
    }

    return data;
  }

  async get<T>(
    url: string,
    options?: Omit<RequestOptions, 'method' | 'body'>,
  ): Promise<HttpResponse<T>> {
    const data = await this.request<T>(url, { ...options, method: 'GET' });

    return data;
  }

  async post<T>(
    url: string,
    body: unknown,
    options?: Omit<RequestOptions, 'method' | 'body'>,
  ): Promise<HttpResponse<T>> {
    const data = await this.request<T>(url, { ...options, method: 'POST', body });

    return data;
  }

  private buildUrl(
    base: string,
    params: Record<string, string | number | boolean | undefined>,
  ): string {
    const url = new URL(base);

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, value.toString());
      }
    });

    return url.toString();
  }
}
