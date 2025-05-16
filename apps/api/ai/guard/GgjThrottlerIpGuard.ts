import {ThrottlerGuard, ThrottlerModuleOptions} from '@nestjs/throttler'
import { Inject} from '@nestjs/common'
export class GgjThrottlerIpGuard extends ThrottlerGuard{
  constructor(
      @Inject('THROTTLER:MODULE_OPTIONS') options: ThrottlerModuleOptions,
      @Inject('ThrottlerStorage') storage: any,
        reflector: any,
  ) {
    super(options, storage, reflector)
  }
  protected getTracker(req: Record<string, any>): Promise<string> {
    // Assuming you are returning an IP address or some other string, wrap it in a Promise
    return Promise.resolve(req.ip);  // Or whichever logic you are using
  }
}
