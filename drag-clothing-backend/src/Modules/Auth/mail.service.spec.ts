import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import * as nodemailer from 'nodemailer';
import { MailService } from './mail.service';

interface PackageJson {
  dependencies?: Record<string, string>;
  engines?: { node?: string };
}

interface SmtpTransportOptions {
  host?: string;
  port?: number;
  secure?: boolean;
  auth?: { user?: string; pass?: string };
}

const backendRoot = path.resolve(__dirname, '../../..');

function readJson(relativePath: string): PackageJson {
  return JSON.parse(
    fs.readFileSync(path.join(backendRoot, relativePath), 'utf8'),
  ) as PackageJson;
}

function minimumMajor(range: string | undefined): number | null {
  if (!range) return null;
  const match = range.match(/(\d+)/);
  return match ? Number(match[1]) : null;
}

function configFor(values: Record<string, string | undefined>): ConfigService {
  return {
    get: (key: string) => values[key],
  } as unknown as ConfigService;
}

const smtpEnv = {
  SMTP_HOST: 'smtp.example.com',
  SMTP_PORT: '587',
  SMTP_USER: 'otp-sender@example.com',
  SMTP_PASS: 'app password',
  SMTP_FROM: 'otp-sender@example.com',
};

describe('MailService nodemailer 7+ transport', () => {
  let createTransport: jest.SpyInstance;
  let sendMail: jest.Mock;
  let close: jest.Mock;

  beforeEach(() => {
    sendMail = jest.fn().mockResolvedValue({ messageId: 'test-message-id' });
    close = jest.fn();
    createTransport = jest
      .spyOn(nodemailer, 'createTransport')
      .mockReturnValue({
        sendMail,
        close,
      } as unknown as nodemailer.Transporter);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('pins nodemailer to a release that includes the v7 transport changes', () => {
    const pkg = readJson('package.json');
    const major = minimumMajor(pkg.dependencies?.nodemailer);

    expect(major).not.toBeNull();
    expect(major as number).toBeGreaterThanOrEqual(7);
  });

  it('declares a Node engine floor that satisfies the installed nodemailer', () => {
    const app = readJson('package.json');
    const installed = readJson('node_modules/nodemailer/package.json');
    const appFloor = minimumMajor(app.engines?.node);
    const nodemailerFloor = minimumMajor(installed.engines?.node);

    expect(nodemailerFloor).not.toBeNull();
    expect(appFloor).not.toBeNull();
    expect(appFloor as number).toBeGreaterThanOrEqual(
      nodemailerFloor as number,
    );
  });

  it('uses the SMTP transport instead of a removed sendmail/direct/stub/ses transport', async () => {
    const service = new MailService(configFor(smtpEnv));

    await service.sendOtp('customer@example.com', '123456');

    expect(createTransport).toHaveBeenCalledTimes(1);
    const calls = createTransport.mock.calls as Array<[SmtpTransportOptions]>;
    const options = calls[0][0];
    expect(typeof options).toBe('object');
    expect(options).toEqual({
      host: 'smtp.example.com',
      port: 587,
      secure: false,
      auth: { user: 'otp-sender@example.com', pass: 'apppassword' },
    });
    expect(sendMail).toHaveBeenCalledTimes(1);
    expect(sendMail).toHaveBeenCalledWith({
      from: 'otp-sender@example.com',
      to: 'customer@example.com',
      subject: 'Your OTP Code',
      text: 'Your OTP is 123456',
    });
  });

  it('uses an implicit TLS connection for port 465', async () => {
    const service = new MailService(
      configFor({ ...smtpEnv, SMTP_PORT: '465' }),
    );

    await service.sendOtp('customer@example.com', '123456');

    const calls = createTransport.mock.calls as Array<[SmtpTransportOptions]>;
    const options = calls[0][0];
    expect(options).toMatchObject({ port: 465, secure: true });
  });

  it('wraps a transport failure in a BadRequestException', async () => {
    sendMail.mockRejectedValue(new Error('SMTP connection refused'));
    const service = new MailService(configFor(smtpEnv));

    await expect(
      service.sendOtp('customer@example.com', '123456'),
    ).rejects.toThrow(BadRequestException);
  });
});
