**Postman Examples — Sending JWT to the API**

This short snippet shows two common ways to send a JWT to the API when using Postman: via cookie (recommended) and via the `Authorization` header. It also includes curl examples and troubleshooting tips.

- **Base URL:** `http://localhost:3000`
- **Protected endpoint example:** `GET /api/users/3`

**Cookie (recommended)**:
- Why: Many browsers/apps expect authentication to be a cookie; server code also checks cookies first.
- Cookie names supported: `auth_token` or `token`.

Postman steps:
1. Open your request in Postman.
2. Click the `Cookies` button (right side) → select `localhost` → `Add Cookie`.
3. Set `Name` to `auth_token` (or `token`) and `Value` to your JWT.
4. Send the request.

curl example (cookie):

```bash
curl -v "http://localhost:3000/api/users/3" \
  --cookie "auth_token=<YOUR_JWT_HERE>"
```

**Authorization header (alternate)**:
- Header: `Authorization: Bearer <YOUR_JWT_HERE>`

Postman steps:
1. Open the request in Postman.
2. Go to the `Headers` tab.
3. Add a header: `Authorization` = `Bearer <YOUR_JWT_HERE>`.
4. Send the request.

curl example (header):

```bash
curl -v "http://localhost:3000/api/users/3" \
  -H "Authorization: Bearer <YOUR_JWT_HERE>"
```

**Raw Cookie header fallback**:
- If you manually set the `Cookie` header in Postman (not via the Cookies dialog), the server will also parse it.
- Example header: `Cookie: auth_token=<YOUR_JWT_HERE>`

**How to quickly get a JWT**:
- Use the sign-in endpoint: `POST /api/auth/sign-in` with JSON body `{ "email": "<email>", "password": "<password>" }`.
- The response (or Set-Cookie header) typically contains the token you can copy into Postman.

**Debugging tips** (development only):
- The server will log which token source it used (cookie, authorization_header, or raw_cookie_header) and a masked token preview. Look for `Auth token lookup` in logs.
- If you see `No token provided`:
  - Confirm the cookie name is `auth_token` or `token`, or that the `Authorization` header is present and uses `Bearer` scheme.
  - If using Postman, prefer the `Cookies` dialog over manually setting a `Cookie` header.

**Security note**:
- Do not paste real production secrets into shared screenshots or public code. The debug logging prints only a masked preview and is disabled in production.

