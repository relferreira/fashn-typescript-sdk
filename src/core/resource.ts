// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import type { ScriboFashnAI } from '../client';

export abstract class APIResource {
  protected _client: ScriboFashnAI;

  constructor(client: ScriboFashnAI) {
    this._client = client;
  }
}
