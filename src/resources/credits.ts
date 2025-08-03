// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

export class Credits extends APIResource {
  /**
   * Retrieve your current FASHN API credits balance. The response includes your
   * total credits, API subscription credits (if you have an active subscription),
   * and any additional on-demand credits you've purchased.
   */
  retrieveBalance(options?: RequestOptions): APIPromise<CreditRetrieveBalanceResponse> {
    return this._client.get('/credits', options);
  }
}

export interface CreditRetrieveBalanceResponse {
  credits?: CreditRetrieveBalanceResponse.Credits;
}

export namespace CreditRetrieveBalanceResponse {
  export interface Credits {
    /**
     * On-demand credits purchased separately
     */
    on_demand: number;

    /**
     * Credits from active subscription
     */
    subscription: number;

    /**
     * Total available credits
     */
    total: number;
  }
}

export declare namespace Credits {
  export { type CreditRetrieveBalanceResponse as CreditRetrieveBalanceResponse };
}
