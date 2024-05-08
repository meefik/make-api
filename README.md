# run-as-api

Run heavy JavaScript calculations as a REST API. You can write your own web services as JS functions that will run in a separate process on a first-come, first-served basis.

## How to use

1. Create the script file `echo.js` in the `/path/to/root` directory:

```js
export default async function (data, params) {
  console.log('echo task', params);
  return data;
}
```

The task will be queued for execution when an HTTP request is made to the server with the task name. The body of the request is parsed and passed to the function as the first input parameter. The data returned by the function is sent as a response to the client. The client's connection to the server remains open, waiting for a response until the function is completed.

2. Start the server to run tasks via REST API:

```sh
npx run-as-api --port=8000 --api-key=secret /path/to/root
```

3. Call your code with an HTTP request:

```sh
curl -X POST -H 'X-Api-Key: secret' http://127.0.0.1:8000/echo
```

An example of mapping an HTTP request path to a file in the `/path/to/root` directory:

```
/echo -> /path/to/root/echo.js 
/echo/ -> /path/to/root/echo/index.js
/sub/echo -> /path/to/root/sub/echo.js
```
