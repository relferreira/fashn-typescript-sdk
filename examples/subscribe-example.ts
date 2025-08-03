import ScriboFashnAI from 'scribo-fashn-ai';

const client = new ScriboFashnAI({
  apiKey: process.env['SCRIBO_FASHN_AI_API_KEY'],
});

(async () => {
  try {
    const response = await client.run.subscribe({
      inputs: {
        garment_image:
          'https://lojafarm.vteximg.com.br/arquivos/ids/3531233-1416-2124/342595_51521_1-VESTIDO-LONGO-MG-BEATRICE-FLORAL.jpg?v=638739680281430000',
        model_image:
          'https://lojafarm.vteximg.com.br/arquivos/ids/3531756-1416-2124/343131_51624_1-VESTIDO-MIDI-MALU.jpg?v=638739687435000000',
      },
      model_name: 'tryon-v1.6',
      onEnqueued: (requestId) => {
        console.log('Prediction enqueued with ID:', requestId);
      },
      onQueueUpdate: (status) => console.log(status),
    });

    console.log(response.output);
  } catch (error) {
    console.error(error);
  }
})();
