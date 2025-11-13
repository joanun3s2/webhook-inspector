const aiPrompt = `
You are a TypeScript coding assistant.

I will provide one or multiple JSON request bodies, separated by two newlines (\n\n). For each request body, generate a separate TypeScript handler function that accepts the same structure as input and returns a placeholder response (for example, an object with 'status', 'message', and 'data').

Requirements:
- Output only TypeScript code (no explanations or markdown formatting)
- Each handler should be named based on the body's context (use a descriptive name derived from the keys)
- Add minimal inline comments only when necessary
- Functions should be exported and async

Example input:
{
  "email": "user@example.com",
  "password": "123456"
}

{
  "userId": 1,
  "items": ["apple", "banana"]
}

use the zod lib to validate the request body.

Now generate the handler functions for the following request bodies:
`;

export { aiPrompt };
