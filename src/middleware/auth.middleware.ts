import { Request, Response, NextFunction } from 'express';
import { userExists } from '../services/user.service';

/**
 * Middleware to authenticate user by username in header
 * Expects 'x-username' header
 */
export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get username from header
    const username = req.headers['x-username'] as string;

    // Check if username is provided
    if (!username) {
      res.status(401).json({
        success: false,
        message: 'Authentication required. Please provide username in x-username header.',
        statusCode: 401,
      });
      return;
    }

    // Check if user exists in database
    const exists = await userExists(username);

    if (!exists) {
      res.status(403).json({
        success: false,
        message: 'Invalid username. User not found.',
        statusCode: 403,
      });
      return;
    }

    // Attach username to request object for use in controllers
    (req as any).username = username;

    // User is authenticated, proceed to next middleware
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during authentication',
      statusCode: 500,
    });
  }
};

/**
 * Optional authentication - doesn't fail if no username provided
 * Useful for endpoints that work better with auth but don't require it
 */
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const username = req.headers['x-username'] as string;

    if (username) {
      const exists = await userExists(username);
      if (exists) {
        (req as any).username = username;
      }
    }

    next();
  } catch (error) {
    // Don't fail, just continue without auth
    next();
  }
};
