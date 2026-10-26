import http from 'http';
import { Duplex } from 'stream';
import type { Application } from 'express';

class MockSocket extends Duplex {
  public remoteAddress = '127.0.0.1';
  public remotePort = 54321;
  public encrypted = false;
  publicchunks: Buffer[] = [];

  _read(_size: number) {}

  _write(chunk: any, encoding: BufferEncoding, callback: (error?: Error | null) => void) {
    this.publicchunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, encoding));
    callback(null);
  }

  setTimeout() {
    return this;
  }
  setNoDelay() {
    return this;
  }
  setKeepAlive() {
    return this;
  }
  destroy() {
    return this;
  }
}

export interface TestResponse {
  status: number;
  statusCode: number;
  headers: Record<string, any>;
  body: any;
  text: string;
}

class InProcessRequest implements PromiseLike<TestResponse> {
  private app: Application;
  private method: string;
  private urlPath: string;
  private reqHeaders: Record<string, string> = {
    host: '127.0.0.1',
    'user-agent': 'astro-test-client/1.0',
  };
  private payload: any = undefined;

  constructor(app: Application, method: string, urlPath: string) {
    this.app = app;
    this.method = method.toUpperCase();
    this.urlPath = urlPath;
  }

  set(field: string, val: string): this {
    this.reqHeaders[field.toLowerCase()] = val;
    return this;
  }

  send(data: any): this {
    this.payload = data;
    if (typeof data === 'object' && data !== null && !this.reqHeaders['content-type']) {
      this.reqHeaders['content-type'] = 'application/json';
    }
    return this;
  }

  private async execute(): Promise<TestResponse> {
    return new Promise<TestResponse>((resolve, reject) => {
      const socket = new MockSocket();
      const req = new http.IncomingMessage(socket as any);
      req.method = this.method;
      req.url = this.urlPath;

      const bodyString =
        this.payload !== undefined
          ? typeof this.payload === 'string'
            ? this.payload
            : JSON.stringify(this.payload)
          : '';
      const bodyBuffer = Buffer.from(bodyString, 'utf8');

      if (this.payload !== undefined) {
        this.reqHeaders['content-length'] = String(bodyBuffer.length);
      }

      req.headers = { ...this.reqHeaders };
      (req as any).connection = socket;
      (req as any).socket = socket;

      const res = new http.ServerResponse(req);
      res.assignSocket(socket as any);

      const resBodyChunks: Buffer[] = [];
      const origWrite = res.write.bind(res);
      const origEnd = res.end.bind(res);

      (res as any).write = (chunk: any, encoding?: any, cb?: any) => {
        if (chunk) {
          resBodyChunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, typeof encoding === 'string' ? encoding : 'utf8'));
        }
        return origWrite(chunk, encoding, cb);
      };

      (res as any).end = (chunk?: any, encoding?: any, cb?: any) => {
        if (chunk && typeof chunk !== 'function') {
          resBodyChunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, typeof encoding === 'string' ? encoding : 'utf8'));
        }
        origEnd(chunk, encoding, cb);

        const rawText = Buffer.concat(resBodyChunks).toString('utf8');
        let parsedBody: any = {};
        if (rawText) {
          try {
            parsedBody = JSON.parse(rawText);
          } catch {
            parsedBody = rawText;
          }
        }

        const headers = res.getHeaders() as Record<string, any>;
        resolve({
          status: res.statusCode,
          statusCode: res.statusCode,
          headers,
          body: parsedBody,
          text: rawText,
        });
        return res;
      };

      try {
        (this.app as any)(req, res);
        process.nextTick(() => {
          if (bodyBuffer.length > 0) {
            req.push(bodyBuffer);
          }
          req.push(null);
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  then<TResult1 = TestResponse, TResult2 = never>(
    onfulfilled?: ((value: TestResponse) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected);
  }
}

export function request(app: Application) {
  return {
    get: (url: string) => new InProcessRequest(app, 'GET', url),
    post: (url: string) => new InProcessRequest(app, 'POST', url),
    put: (url: string) => new InProcessRequest(app, 'PUT', url),
    patch: (url: string) => new InProcessRequest(app, 'PATCH', url),
    delete: (url: string) => new InProcessRequest(app, 'DELETE', url),
  };
}

export default request;
