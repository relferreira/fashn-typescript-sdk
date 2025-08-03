// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

export class Status extends APIResource {
  /**
   * Receive the status of the prediction by ID. Unless in a queue, it takes up to 40
   * seconds to generate a try-on. Poll this endpoint to monitor the prediction's
   * progress and retrieve the final output once available.
   *
   * @example
   * ```ts
   * const status = await client.status.retrieve(
   *   '123a87r9-4129-4bb3-be18-9c9fb5bd7fc1-u1',
   * );
   * ```
   */
  retrieve(id: string, options?: RequestOptions): APIPromise<StatusRetrieveResponse> {
    return this._client.get(path`/status/${id}`, options);
  }
}

export interface StatusRetrieveResponse {
  /**
   * The prediction ID
   */
  id?: string;

  /**
   * Error message if status is 'failed'
   */
  error?: string | null;

  /**
   * Array of output images (only present when status is 'completed'). Contains URLs
   * when return_base64=false, or base64-encoded strings when return_base64=true.
   */
  output?: Array<string>;

  /**
   * Current status of the prediction
   */
  status?: 'starting' | 'in_queue' | 'processing' | 'completed' | 'failed';
}

export declare namespace Status {
  export { type StatusRetrieveResponse as StatusRetrieveResponse };
}
