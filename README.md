# Chainlink External Adapter for AlphaVantage

Use this adapter for connecting to AlphaVantage's API from a Chainlink node.

## Input params

- `function`: (Optional) The function to call (defaults to CURRENCY_EXCHANGE_RATE)
- `base`, `from`, or `coin`: The asset to query
- `quote`, `to`, or `market`: The currency to convert to

## Output

```json
{
 "jobRunID": "1",
 "data": {
  "Realtime Currency Exchange Rate": {
   "1. From_Currency Code": "ETH",
   "2. From_Currency Name": "Ethereum",
   "3. To_Currency Code": "USD",
   "4. To_Currency Name": "United States Dollar",
   "5. Exchange Rate": "170.88000000",
   "6. Last Refreshed": "2020-04-16 19:15:01",
   "7. Time Zone": "UTC",
   "8. Bid Price": "170.84000000",
   "9. Ask Price": "170.88000000"
  },
  "result": 170.88
 },
 "result": 170.88,
 "statusCode": 200
}
```

## Install

```bash
yarn
```

## Test

```bash
yarn test
```

## Create the zip

```bash
zip -r cl-alphavantage.zip .
```

## Docker

If you wish to use Docker to run the adapter, you can build the image by running the following command:

```bash
docker build . -t alphavantage-adapter
```

Then run it with:

```bash
docker run -p 8080:8080 -e API_KEY='YOUR_API_KEY' -it alphavantage-adapter:latest
```

## Install to AWS Lambda

- In Lambda Functions, create function
- On the Create function page:
  - Give the function a name
  - Use Node.js 12.x for the runtime
  - Choose an existing role or create a new one
  - Click Create Function
- Under Function code, select "Upload a .zip file" from the Code entry type drop-down
- Click Upload and select the `cl-alphavantage.zip` file
- Handler should remain index.handler
- Add the environment variable (repeat for all environment variables):
  - Key: API_KEY
  - Value: Your_API_key
- Save


## Install to GCP

- In Functions, create a new function, choose to ZIP upload
- Click Browse and select the `cl-alphavantage.zip` file
- Select a Storage Bucket to keep the zip in
- Function to execute: gcpservice
- Click More, Add variable (repeat for all environment variables)
  - NAME: API_KEY
  - VALUE: Your_API_key
