import { Handler, HandlerEvent } from "@netlify/functions";

const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      body: JSON.stringify({ success: false, message: 'Method Not Allowed' })
    };
  }

  try {
    const { password } = JSON.parse(event.body || '{}');
    
    // CRITICAL SECURITY NOTE:
    // The 'process.env.ADMIN_PASSWORD' is your secret key.
    // You MUST set this environment variable in your Netlify deployment settings.
    // The fallback password "password123" is INSECURE and for local testing only.
    const adminPassword = process.env.ADMIN_PASSWORD || "password123";

    if (!password) {
        return {
            statusCode: 400,
            body: JSON.stringify({ success: false, message: 'Password is required.' }),
        };
    }

    if (password === adminPassword) {
      // For a real application, you should generate and return a secure token (e.g., JWT).
      // For this example, a simple success message is sufficient.
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, message: 'Login successful' }),
      };
    } else {
      return {
        statusCode: 401,
        body: JSON.stringify({ success: false, message: 'Invalid password.' }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: 'Internal Server Error' }),
    };
  }
};

export { handler };