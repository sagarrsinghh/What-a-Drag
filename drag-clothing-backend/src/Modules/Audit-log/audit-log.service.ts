import { Injectable, HttpException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as Entity from '../../entities';
import { ApiResponseService } from 'src/common/api-response.service';
import { QueryRunner } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const MONTH_NAMES = [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec',
];

// Mirrors the date forms accepted by @nestjs/common's ParseDatePipe since
// 12.6.3, so filters are validated before the timestamp is handed to MySQL.
const NAMED_MONTH_DATE_PATTERNS = [
  /^\s*(?:[a-z]+,?\s+)?(?<month>[a-z]{3,})\.?[\s,./-]+(?<day>\d{1,2})(?:(?:[\s,./-]+)(?<year>\d{4}|\d{2}(?!:))(?!\d)|(?![\s\S]*\d))/i,
  /^\s*(?:[a-z]+,?\s+)?(?<day>\d{1,2})[\s,./-]+(?<month>[a-z]{3,})\.?(?:(?:[\s,./-]+)(?<year>\d{4}|\d{2}(?!:))(?!\d)|(?![\s\S]*\d))/i,
  /^\s*(?:[a-z]+,?\s+)?(?<year>\d{4})[\s,./-]+(?<month>[a-z]{3,})\.?[\s,./-]+(?<day>\d{1,2})(?!\d)/i,
];
const YEAR_FIRST_DATE_PATTERN =
  /^\s*(?:(?:sun|mon|tue|wed|thu|fri|sat)[a-z]*,?\s+)?([+-]\d{6}|\d{4})[\s,./-]+(\d{1,2})[\s,./-]+(\d{1,2})(?!\d)/i;
const MONTH_FIRST_DATE_PATTERN =
  /^\s*(?:(?:sun|mon|tue|wed|thu|fri|sat)[a-z]*,?\s+)?(\d{1,2})[\s,./-]+(\d{1,2})(?:[\s,./-]+(\d{4}|\d{2}(?!:))(?!\d)|(?![\s\S]*\d))/i;

function toFullYear(year: string): number {
  const value = Number(year);
  if (year.length !== 2) {
    return value;
  }
  return value < 50 ? 2000 + value : 1900 + value;
}

@Injectable()
export class AuditService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly apiResponse: ApiResponseService,
  ) {}

  async createAuditLog(
    _user: any,
    body: {
      action: string;
      entity: string;
      entityId: string;
      clientId?: string;
      oldValue?: any;
      newValue?: any;
      ipAddress?: string;
    },
  ) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(Entity.AuditLog)
        .values({
          id: uuidv4(),
          userId: _user.id,
          clientId: body.clientId ?? _user.clientId ?? null,
          action: body.action,
          entity: body.entity,
          entityId: body.entityId,
          oldValue: body.oldValue ?? null,
          newValue: body.newValue ?? null,
          ipAddress: body.ipAddress,
        })
        .execute();

      await queryRunner.commitTransaction();

      return this.apiResponse.success(
        'Audit log created successfully',
        null,
        201,
      );
    } catch (error: any) {
      await queryRunner.rollbackTransaction();

      let statusCode = 500;
      let message = 'Audit log creation failed';
      let errorType = 'Internal Server Error';

      if (error.response) {
        statusCode = error.response.status ?? statusCode;
        message = error.response.data?.message ?? error.message ?? message;
      } else if (error.statusCode) {
        statusCode = error.statusCode;
        message = error.message ?? message;
        errorType = error.errorType ?? errorType;
      } else {
        message = error.message ?? message;
      }

      throw new HttpException(
        this.apiResponse.error(message, statusCode, errorType),
        statusCode,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async createAuditLogWithQueryRunner(
    queryRunner: QueryRunner,
    _user: any,
    body: {
      action: string;
      entity: string;
      entityId: string;
      clientId?: string;
      oldValue?: any;
      newValue?: any;
      ipAddress?: string;
    },
  ) {
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(Entity.AuditLog)
      .values({
        id: uuidv4(),
        userId: _user.id,
        clientId: body.clientId ?? _user.clientId ?? null,
        action: body.action,
        entity: body.entity,
        entityId: body.entityId,
        oldValue: body.oldValue ?? null,
        newValue: body.newValue ?? null,
        ipAddress: body.ipAddress,
      })
      .execute();
  }

  async getAuditLogs(filters: {
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) {
    this.assertDateWithinMonth(filters.startDate, 'startDate');
    this.assertDateWithinMonth(filters.endDate, 'endDate');

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { startDate, endDate, page = 1, limit = 20 } = filters;

      if (!startDate) {
        throw {
          statusCode: 400,
          message: 'startDate is required',
          errorType: 'Bad Request',
        };
      }

      const skip = (page - 1) * limit;

      const qb = queryRunner.manager
        .createQueryBuilder(Entity.AuditLog, 'log')
        .orderBy('log.createdAt', 'DESC')
        .andWhere('log.createdAt >= :startDate', {
          startDate: new Date(`${startDate}T00:00:00.000`),
        });

      if (endDate) {
        const endDateTime = new Date(`${endDate}T23:59:59.999`);
        qb.andWhere('log.createdAt <= :endDate', {
          endDate: endDateTime,
        });
      }

      const [logs, total] = await qb.skip(skip).take(limit).getManyAndCount();

      await queryRunner.commitTransaction();

      return this.apiResponse.success(
        'Audit logs fetched successfully',
        {
          total,
          page,
          limit,
          data: logs,
        },
        200,
      );
    } catch (error: any) {
      if (queryRunner.isTransactionActive)
        await queryRunner.rollbackTransaction();

      let statusCode = 500;
      let message = 'Failed to fetch audit logs';
      let errorType = 'Internal Server Error';

      if (error?.statusCode) {
        statusCode = error.statusCode;
        message = error.message ?? message;
        errorType = error.errorType ?? errorType;
      } else if (error?.message) {
        message = error.message;
      }

      throw new HttpException(
        this.apiResponse.error(message, statusCode, errorType),
        statusCode,
      );
    } finally {
      await queryRunner.release();
    }
  }

  private assertDateWithinMonth(
    value: string | undefined,
    field: 'startDate' | 'endDate',
  ): void {
    if (!value || !this.hasDayPastMonthEnd(value)) {
      return;
    }

    throw new HttpException(
      this.apiResponse.error(
        `${field} is not a valid date`,
        400,
        'Bad Request',
      ),
      400,
    );
  }

  // `new Date()` rolls a day past the end of its month into the next month
  // ("2024-02-30" becomes March 1), so date strings are checked against the
  // length of their month before they reach the query.
  private hasDayPastMonthEnd(value: string): boolean {
    let year: number;
    let month: number;
    let day: number;

    const isoMatch = YEAR_FIRST_DATE_PATTERN.exec(value);
    if (isoMatch) {
      year = Number(isoMatch[1]);
      month = Number(isoMatch[2]);
      day = Number(isoMatch[3]);
    } else {
      const monthFirstMatch = MONTH_FIRST_DATE_PATTERN.exec(value);
      if (monthFirstMatch) {
        month = Number(monthFirstMatch[1]);
        day = Number(monthFirstMatch[2]);
        // As in `new Date()`, a date without a year is in 2001.
        year =
          monthFirstMatch[3] === undefined
            ? 2001
            : toFullYear(monthFirstMatch[3]);
      } else {
        const namedMatch = this.matchNamedMonthDate(value);
        if (!namedMatch) {
          return false;
        }
        [year, month, day] = namedMatch;
      }
    }

    // `new Date()` doesn't read a number above 31 as a day ("99-Jan-20" is
    // January 20, 1999), so such a reading is left to it.
    if (day > 31) {
      return false;
    }

    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    const daysInMonth =
      month === 2 && isLeapYear ? 29 : DAYS_IN_MONTH[month - 1];

    return daysInMonth !== undefined && day > daysInMonth;
  }

  private matchNamedMonthDate(
    value: string,
  ): [number, number, number] | undefined {
    for (const pattern of NAMED_MONTH_DATE_PATTERNS) {
      const groups = pattern.exec(value)?.groups;
      if (!groups) {
        continue;
      }

      const month =
        MONTH_NAMES.indexOf(groups.month.slice(0, 3).toLowerCase()) + 1;
      if (month > 0) {
        // As in `new Date()`, a date without a year is in 2001.
        return [
          groups.year === undefined ? 2001 : toFullYear(groups.year),
          month,
          Number(groups.day),
        ];
      }
    }

    return undefined;
  }
}
