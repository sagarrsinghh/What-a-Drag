import { BadRequestException } from '@nestjs/common';
import { transformException } from '@nestjs/platform-express/multer/multer/multer.utils';

describe('Multer upload error mapping', () => {
  it('turns an invalid multipart field name into a 400 response', () => {
    const multerError = Object.assign(new Error('Invalid field name'), {
      code: 'INVALID_FIELD_NAME',
    });

    const mapped = transformException(multerError);

    expect(mapped).toBeInstanceOf(BadRequestException);
    expect((mapped as BadRequestException).getStatus()).toBe(400);
  });
});
