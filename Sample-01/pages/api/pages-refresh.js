import { auth0 } from '../../lib/auth0';

export default auth0.withApiAuthRequired(async function handler(req, res) {
  try {
    const session = await auth0.getSession(req);
    if (!session) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { token, expiresAt } = await auth0.getAccessToken(req, res, {
      refresh: true
    });

    console.log('Token ends with:', token.slice(-20));

    return res.status(200).json({
      success: true,
      message: 'Token refreshed',
      expires_at: expiresAt
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
