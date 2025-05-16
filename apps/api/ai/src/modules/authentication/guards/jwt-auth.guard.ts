import { 
  CanActivate, 
  ExecutionContext, 
  Injectable, 
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = this.getRequest(context);
    const user = request.user;
    
    if (!user) {
      throw new UnauthorizedException('Authentication failed');
    }
    
    return true;
  }

  private getRequest(context: ExecutionContext): any {
    return context.switchToHttp().getRequest();
  }
} 