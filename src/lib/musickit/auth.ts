import jwt from 'jsonwebtoken';

// MusicKit Developer Token generation
// The developer token authenticates your app with Apple Music API
// It's a JWT signed with your MusicKit private key

interface DeveloperTokenOptions {
  teamId: string;      // Your Apple Developer Team ID
  keyId: string;       // Your MusicKit Key ID
  privateKey: string;  // Contents of your .p8 file
}

// Generate a developer token for Apple Music API requests
// Tokens are valid for up to 6 months, but we generate fresh ones
export function generateDeveloperToken(options: DeveloperTokenOptions): string {
  const { teamId, keyId, privateKey } = options;

  const now = Math.floor(Date.now() / 1000);
  const expirationTime = now + (60 * 60 * 24 * 180); // 180 days

  const payload = {
    iss: teamId,
    iat: now,
    exp: expirationTime,
  };

  const token = jwt.sign(payload, privateKey, {
    algorithm: 'ES256',
    header: {
      alg: 'ES256',
      kid: keyId,
    },
  });

  return token;
}

// Cache the token to avoid regenerating on every request
let cachedToken: string | null = null;
let tokenExpiry: number = 0;

export function getDeveloperToken(): string {
  const now = Math.floor(Date.now() / 1000);

  // Regenerate if expired or about to expire (within 1 day)
  if (!cachedToken || now >= tokenExpiry - 86400) {
    const teamId = process.env.APPLE_TEAM_ID;
    const keyId = process.env.APPLE_KEY_ID;
    const privateKey = process.env.APPLE_PRIVATE_KEY;

    if (!teamId || !keyId || !privateKey) {
      throw new Error(
        'Missing MusicKit credentials. Set APPLE_TEAM_ID, APPLE_KEY_ID, and APPLE_PRIVATE_KEY environment variables.'
      );
    }

    // Private key comes as base64 or with escaped newlines from env
    let formattedKey: string;
    if (privateKey.includes('-----BEGIN')) {
      formattedKey = privateKey;
    } else {
      formattedKey = Buffer.from(privateKey, 'base64').toString('utf-8');
    }

    // Handle escaped newlines
    formattedKey = formattedKey.replace(/\\n/g, '\n');

    cachedToken = generateDeveloperToken({
      teamId,
      keyId,
      privateKey: formattedKey,
    });

    // Token valid for 180 days
    tokenExpiry = now + (60 * 60 * 24 * 180);
  }

  return cachedToken;
}

// Apple Music API base URL
export const APPLE_MUSIC_API = 'https://api.music.apple.com/v1';

// Make authenticated request to Apple Music API
export async function musicKitFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getDeveloperToken();

  return fetch(`${APPLE_MUSIC_API}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
}
