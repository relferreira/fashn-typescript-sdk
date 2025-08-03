// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import ScriboFashnAI from 'scribo-fashn-ai';

const client = new ScriboFashnAI({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource run', () => {
  // skipped: tests are disabled for the time being
  test.skip('predict: only required params', async () => {
    const responsePromise = client.run.predict({
      inputs: {
        garment_image: 'http://example.com/path/to/garment.jpg',
        model_image: 'http://example.com/path/to/model.jpg',
      },
      model_name: 'tryon-v1.6',
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // skipped: tests are disabled for the time being
  test.skip('predict: required and optional params', async () => {
    const response = await client.run.predict({
      inputs: {
        garment_image: 'http://example.com/path/to/garment.jpg',
        model_image: 'http://example.com/path/to/model.jpg',
        category: 'auto',
        garment_photo_type: 'auto',
        mode: 'performance',
        moderation_level: 'conservative',
        num_samples: 1,
        output_format: 'png',
        return_base64: true,
        seed: 0,
        segmentation_free: true,
      },
      model_name: 'tryon-v1.6',
    });
  });
});
