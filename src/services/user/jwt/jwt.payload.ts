import { Roles } from '../entities/user.entity';
import { UserEntity } from '../entities/user.entity';

export interface Payload extends Partial<UserEntity> {
  isValidate: boolean;
}
