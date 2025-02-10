import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class BasicAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Basic ')) {
      throw new UnauthorizedException(
        'Missing or invalid Authorization header',
      );
    }

    try {
      // Decode and extract credentials
      const base64Credentials = authHeader.split(' ')[1];
      const decodedCredentials = Buffer.from(
        base64Credentials,
        'base64',
      ).toString('ascii');
      const [username, password] = decodedCredentials.split(':');

      // Check hardcoded credentials (replace with actual validation logic if needed)
      if (username === 'root' && password === '*Root!@#123$%') {
        return true; // Allow access if credentials are valid
      } else {
        throw new UnauthorizedException('Invalid username or password');
      }
    } catch (error) {
      throw new UnauthorizedException('Invalid Authorization header format');
    }
  }
}
