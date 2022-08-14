import { UserEntity } from 'src/services/user/entities/user.entity';
import { Payload } from 'src/services/user/jwt/jwt.payload';

/**
 * Payload 반환 함수
 * @param { UserEntity } user academy_id 를 Join 해야함
 * @returns { Payload }
 */
export const setPayload = (user: UserEntity): Payload => {
  const payload: Payload =
    user.academy_id !== null
      ? {
          ...user,
          academy_id: user.academy_id.academy_id,
          class_id: user.class_id,
          academy_info: user.academy_id,
          isValidate: true,
        }
      : {
          ...user,
          academy_id: null,
          class_id: user.class_id,
          academy_info: null,
          isValidate: true,
        };

  return payload;
};
