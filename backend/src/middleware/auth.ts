import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../utils/jwt.js';
import { prisma } from '../utils/prisma.js';

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload & { name?: string; email?: string };
}

export const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authentication token missing or invalid format' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    // Verify user exists and status is ACTIVE
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, role: true, status: true, email: true, name: true }
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'User account not found' });
    }

    if (user.status === 'SUSPENDED') {
      return res.status(403).json({ success: false, message: 'Account is suspended. Please contact platform admin.' });
    }

    req.user = {
      userId: user.id,
      role: user.role,
      email: user.email,
      name: user.name
    };

    next();
  } catch (error: any) {
    return res.status(401).json({ success: false, message: 'Invalid or expired access token', error: error.message });
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthenticated access attempt' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: `Access denied. Requires one of roles: [${roles.join(', ')}]` });
    }
    next();
  };
};
