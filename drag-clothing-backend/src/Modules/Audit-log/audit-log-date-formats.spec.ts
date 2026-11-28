import { HttpException } from '@nestjs/common';

jest.mock('../../entities', () => ({ AuditLog: class AuditLog {} }));
jest.mock(
  'src/common/api-response.service',
  () => ({ ApiResponseService: class ApiResponseService {} }),
  { virtual: true },
);

import { AuditService } from './audit-log.service';

describe('AuditService date validation for named and month-first dates', () => {
  const createQueryRunner = jest.fn();
  const apiResponse = {
    success: jest.fn(),
    error: jest.fn(
      (message: string, statusCode: number, errorType: string) => ({
        message,
        statusCode,
        error: errorType,
      }),
    ),
  };
  const service = new AuditService(
    { createQueryRunner } as any,
    apiResponse as any,
  );

  beforeEach(() => {
    createQueryRunner.mockReset();
    createQueryRunner.mockImplementation(() => {
      throw new Error('the database must not be queried for an invalid date');
    });
  });

  it.each(['Feb 30, 2024', '30 Feb 2024', '2024 Feb 30', '02/30/2024'])(
    'rejects startDate %s whose day is past the end of its month',
    async (startDate) => {
      await expect(service.getAuditLogs({ startDate })).rejects.toBeInstanceOf(
        HttpException,
      );
      await expect(service.getAuditLogs({ startDate })).rejects.toMatchObject({
        status: 400,
      });
      expect(createQueryRunner).not.toHaveBeenCalled();
    },
  );

  it('still accepts a valid leap day and proceeds to the query', async () => {
    await expect(
      service.getAuditLogs({ startDate: 'Feb 29, 2024' }),
    ).rejects.toThrow('the database must not be queried');
    expect(createQueryRunner).toHaveBeenCalled();
  });
});
