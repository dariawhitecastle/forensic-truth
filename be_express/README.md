# Express/TypeORM for Forensic Truth app

## Usage

```typescript
import express from 'express'
import { PostRequestHandler, ErrorHandler } from '@mz3/express';

// a service function
// * accepts one object parameter
// * returns a promise resolving with an object
// * the object will be sent in the API response via res.json
const status = {
  checkStatus (params: any): Promise<any> => Promise.resolve({ status: 'okay' })
}

// create express app
const app = express()

// create an express handler
// * passes req.body as parameter to checkStatus
// * calls checkStatus and sends the result via res.json
// * returns a function that can be provided to app.post
app.post(PostRequestHandler(status.checkStatus))

// this package also includes a default error handler that can be provided to app.use
app.use(ErrorHandler)

// start app
const port = 3000
app.listen(port, () => console.log(`app listening on port ${port}`))
```

## Yarn

```bash
yarn test  # run jest tests
yarn build # compiles code from src to dist
```
