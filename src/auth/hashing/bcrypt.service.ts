import { HashingService } from './hashing.service';
import * as bcrypt from 'bcryptjs';
export class BcryptService extends HashingService {
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
