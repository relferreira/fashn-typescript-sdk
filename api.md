# Run

Types:

- <code><a href="./src/resources/run.ts">RunPredictResponse</a></code>

Methods:

- <code title="post /run">client.run.<a href="./src/resources/run.ts">predict</a>({ ...params }) -> RunPredictResponse</code>
- <code title="post /run">client.run.<a href="./src/resources/run.ts">subscribe</a>({ ...params }) -> Promise&lt;StatusRetrieveResponse&gt;</code>

# Status

Types:

- <code><a href="./src/resources/status.ts">StatusRetrieveResponse</a></code>

Methods:

- <code title="get /status/{id}">client.status.<a href="./src/resources/status.ts">retrieve</a>(id) -> StatusRetrieveResponse</code>

# Credits

Types:

- <code><a href="./src/resources/credits.ts">CreditRetrieveBalanceResponse</a></code>

Methods:

- <code title="get /credits">client.credits.<a href="./src/resources/credits.ts">retrieveBalance</a>() -> CreditRetrieveBalanceResponse</code>
