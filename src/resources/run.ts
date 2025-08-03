// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';
import { StatusRetrieveResponse } from './status';

const DEFAULT_POOL_INTERVAL = 500;
const DEFAULT_TIMEOUT = 120000;

export class Run extends APIResource {
  /**
   * Initiate a new try-on prediction
   *
   * @example
   * ```ts
   * const response = await client.run.predict({
   *   inputs: {
   *     model_image: 'http://example.com/path/to/model.jpg',
   *     garment_image: 'http://example.com/path/to/garment.jpg',
   *   },
   *   model_name: 'tryon-v1.6',
   * });
   * ```
   */
  predict(body: RunPredictParams, options?: RequestOptions): APIPromise<RunPredictResponse> {
    return this._client.post('/run', { body, ...options });
  }

  /**
   * Subscribe to a prediction status
   *
   * @example
   * ```ts
   * const response = await client.run.subscribe({
   *   inputs: {
   *     model_image: 'http://example.com/path/to/model.jpg',
   *     garment_image: 'http://example.com/path/to/garment.jpg',
   *   },
   *   model_name: 'tryon-v1.6',
   *   onEnqueued: (requestId) => {
   *     console.log('Prediction enqueued with ID:', requestId);
   *   },
   *   onQueueUpdate: (status) => console.log(status),
   * });
   * ```
   */
  async subscribe(body: RunSubscribeParams, options?: RequestOptions): Promise<StatusRetrieveResponse> {
    const response = (await this._client.post('/run', { body, ...options })) as RunPredictResponse;
    if (!response.id) throw new Error('Prediction ID is required');

    if (body.onEnqueued) body.onEnqueued(response.id);

    return this.subscribeToStatus(response.id, body, options);
  }

  private subscribeToStatus(
    id: string,
    body: RunSubscribeParams,
    options?: RequestOptions,
  ): Promise<StatusRetrieveResponse> {
    return new Promise((resolve, reject) => {
      const pollInterval = body.poolInterval ?? DEFAULT_POOL_INTERVAL;
      const timeout = body.timeout ?? DEFAULT_TIMEOUT;

      let pollIntervalId: NodeJS.Timeout;
      let timeoutId: NodeJS.Timeout;

      const clearTimeouts = () => {
        clearTimeout(pollIntervalId);
        clearTimeout(timeoutId);
      };

      if (timeout) {
        timeoutId = setTimeout(() => {
          clearTimeouts();
          // TODO cancel prediction
          reject(new Error('Timeout'));
        }, timeout);
      }

      const pool = async () => {
        try {
          const status = await this._client.status.retrieve(id, options);
          if (body.onQueueUpdate) {
            body.onQueueUpdate(status);
          }
          if (status.status === 'completed') {
            clearTimeouts();
            return resolve(status);
          }
          if (status.status === 'failed') {
            clearTimeouts();
            return reject(new Error(status.error ?? 'Unknown error'));
          }

          pollIntervalId = setTimeout(pool, pollInterval);
        } catch (error) {
          clearTimeouts();
          reject(error);
        }
      };

      pool().catch(reject);
    });
  }
}

export interface RunPredictResponse {
  /**
   * Unique identifier for the prediction
   */
  id?: string;

  /**
   * Error message if any
   */
  error?: string | null;
}

export interface RunPredictParams {
  /**
   * Contains all the input parameters for the selected model
   */
  inputs: RunPredictParams.TryonV16Inputs | RunPredictParams.TryonV15Inputs;

  /**
   * Specifies the model version to use for the virtual try-on prediction.
   *
   * - `tryon-v1.6` - The latest and most advanced model, producing higher-quality
   *   outputs at 864×1296 resolution
   * - `tryon-v1.5` - The previous stable release, generating outputs at 576×864
   *   resolution. Slightly faster than v1.6
   */
  model_name: 'tryon-v1.6' | 'tryon-v1.5';
}

export interface RunSubscribeParams extends RunPredictParams {
  /**
   * The interval in milliseconds to poll the status of the prediction.
   */
  poolInterval?: number;

  /**
   * The timeout in milliseconds to cancel the prediction.
   */
  timeout?: number;

  /**
   * A callback function that is called when the prediction is enqueued.
   */
  onEnqueued?: (requestId: string) => void;

  /**
   * A callback function that is called when the prediction is updated.
   */
  onQueueUpdate?: (status: StatusRetrieveResponse) => void;
}

export namespace RunPredictParams {
  export interface TryonV16Inputs {
    /**
     * Reference image of the clothing item to be tried on the model_image. Can be an
     * image URL or base64 encoded image (must include prefix like
     * data:image/jpg;base64,<YOUR_BASE64>).
     */
    garment_image: string;

    /**
     * Primary image of the person on whom the virtual try-on will be performed. Can be
     * an image URL, base64 encoded image, or saved model reference (saved:<model_name>
     * for Models Studio users).
     */
    model_image: string;

    /**
     * Garment type classification. Use 'auto' to enable automatic classification. For
     * flat-lay/ghost mannequin images, system detects type automatically. For on-model
     * images, full-body shots default to full outfit swap.
     */
    category?: 'auto' | 'tops' | 'bottoms' | 'one-pieces';

    /**
     * Specifies garment photo type to optimize internal parameters:
     *
     * - 'model': Photos of garments on a model
     * - 'flat-lay': Flat-lay or ghost mannequin images
     * - 'auto': Automatically detect photo type
     */
    garment_photo_type?: 'auto' | 'flat-lay' | 'model';

    /**
     * Operation mode:
     *
     * - 'performance': Faster but may compromise quality
     * - 'balanced': Perfect middle ground between speed and quality
     * - 'quality': Slower but delivers highest quality results
     */
    mode?: 'performance' | 'balanced' | 'quality';

    /**
     * Sets content moderation level for garment images:
     *
     * - 'conservative': Stricter modesty standards, blocks
     *   underwear/swimwear/revealing outfits
     * - 'permissive': Allows swimwear/underwear/revealing garments, blocks explicit
     *   nudity
     * - 'none': Disables all content moderation (users remain responsible for ethical
     *   use)
     */
    moderation_level?: 'conservative' | 'permissive' | 'none';

    /**
     * Number of images to generate in a single run. Multiple images increase chances
     * of getting a good result due to the random element in image generation.
     */
    num_samples?: number;

    /**
     * Desired output image format:
     *
     * - 'png': Highest quality, ideal for content creation
     * - 'jpeg': Faster response with slight compression, suitable for real-time
     *   applications
     */
    output_format?: 'png' | 'jpeg';

    /**
     * When true, returns generated image as base64-encoded string instead of CDN URL.
     * Enhances privacy as outputs are not stored on servers when enabled. Base64
     * string includes format prefix (e.g., data:image/png;base64,...)
     */
    return_base64?: boolean;

    /**
     * Sets random operations to a fixed state. Use same seed to reproduce results with
     * same inputs, or different seed to force different results.
     */
    seed?: number;

    /**
     * Direct garment fitting without clothing segmentation, enabling bulkier garment
     * try-ons with improved preservation of body shape and skin texture. Set to false
     * if original garments are not removed properly.
     */
    segmentation_free?: boolean;
  }

  export interface TryonV15Inputs {
    /**
     * Reference image of the clothing item to be tried on the model_image. Can be an
     * image URL or base64 encoded image (must include prefix like
     * data:image/jpg;base64,<YOUR_BASE64>).
     */
    garment_image: string;

    /**
     * Primary image of the person on whom the virtual try-on will be performed. Can be
     * an image URL, base64 encoded image, or saved model reference (saved:<model_name>
     * for Models Studio users).
     */
    model_image: string;

    /**
     * Garment type classification. Use 'auto' to enable automatic classification. For
     * flat-lay/ghost mannequin images, system detects type automatically. For on-model
     * images, full-body shots default to full outfit swap.
     */
    category?: 'auto' | 'tops' | 'bottoms' | 'one-pieces';

    /**
     * Specifies garment photo type to optimize internal parameters:
     *
     * - 'model': Photos of garments on a model
     * - 'flat-lay': Flat-lay or ghost mannequin images
     * - 'auto': Automatically detect photo type
     */
    garment_photo_type?: 'auto' | 'flat-lay' | 'model';

    /**
     * Operation mode:
     *
     * - 'performance': Faster but may compromise quality
     * - 'balanced': Perfect middle ground between speed and quality
     * - 'quality': Slower but delivers highest quality results
     */
    mode?: 'performance' | 'balanced' | 'quality';

    /**
     * Sets content moderation level for garment images:
     *
     * - 'conservative': Stricter modesty standards, blocks
     *   underwear/swimwear/revealing outfits
     * - 'permissive': Allows swimwear/underwear/revealing garments, blocks explicit
     *   nudity
     * - 'none': Disables all content moderation (users remain responsible for ethical
     *   use)
     */
    moderation_level?: 'conservative' | 'permissive' | 'none';

    /**
     * Number of images to generate in a single run. Multiple images increase chances
     * of getting a good result due to the random element in image generation.
     */
    num_samples?: number;

    /**
     * Desired output image format:
     *
     * - 'png': Highest quality, ideal for content creation
     * - 'jpeg': Faster response with slight compression, suitable for real-time
     *   applications
     */
    output_format?: 'png' | 'jpeg';

    /**
     * When true, returns generated image as base64-encoded string instead of CDN URL.
     * Enhances privacy as outputs are not stored on servers when enabled. Base64
     * string includes format prefix (e.g., data:image/png;base64,...)
     */
    return_base64?: boolean;

    /**
     * Sets random operations to a fixed state. Use same seed to reproduce results with
     * same inputs, or different seed to force different results.
     */
    seed?: number;

    /**
     * Direct garment fitting without clothing segmentation, enabling bulkier garment
     * try-ons with improved preservation of body shape and skin texture. Set to false
     * if original garments are not removed properly.
     */
    segmentation_free?: boolean;
  }
}

export declare namespace Run {
  export { type RunPredictResponse as RunPredictResponse, type RunPredictParams as RunPredictParams };
}
