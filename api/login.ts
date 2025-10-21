// This is a Vercel Serverless Function.
// It runs securely on the server, not in the user's browser.

// We can't import Vercel's types in this environment, but we can define simple interfaces.
interface VercelRequest {
  method?: string;
  body: {
    password?: string;
  };
}

interface VercelResponse {
  status: (statusCode: number) => {
    json: (body: any) => void;
  };
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const { password } = req.body;
    
    // CRITICAL SECURITY NOTE:
    // The 'process.env.ADMIN_PASSWORD' is your secret key.
    // You MUST set this environment variable in your Vercel deployment settings.
    // The fallback password "password123" is INSECURE and for local testing only.
    const adminPassword = process.env.ADMIN_PASSWORD || "password123";

    if (!password) {
        return res.status(400).json({ success: false, message: 'Password is required.' });
    }

    if (password === adminPassword) {
      return res.status(200).json({ success: true, message: 'Login successful' });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid password.' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}
