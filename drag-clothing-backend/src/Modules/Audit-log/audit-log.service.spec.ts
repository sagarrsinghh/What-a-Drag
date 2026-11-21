import { HttpException } from '@nestjs/common';

jest.mock('../../entities', () => ({ AuditLog: class AuditLog {} }));
jest.mock(
  'src/common/api-response.service',
  () => ({ ApiResponseService: class ApiResponseService {} }),
  { virtual: true },
);

import { AuditService } from './audit-log.service';

describe('AuditService.getAuditLogs date validation', () => {
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

  it('rejects a startDate whose day is past the end of its month', async () => {
    const promise = service.getAuditLogs({ startDate: '2024-02-30' });

    await expect(promise).rejects.toBeInstanceOf(HttpException);
    await expect(
      service.getAuditLogs({ startDate: '2024-02-30' }),
    ).rejects.toMatchObject({ status: 400 });
    expect(createQueryRunner).not.toHaveBeenCalled();
  });

  it('rejects an endDate whose day is past the end of its month', async () => {
    const promise = service.getAuditLogs({
      startDate: '2024-02-01',
      endDate: '2024-04-31',
    });

    await expect(promise).rejects.toBeInstanceOf(HttpException);
    await expect(
      service.getAuditLogs({
        startDate: '2024-02-01',
        endDate: '2024-04-31',
      }),
    ).rejects.toMatchObject({ status: 400 });
    expect(createQueryRunner).not.toHaveBeenCalled();
  });
});
