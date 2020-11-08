import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserDbService } from '../../database/service/user-db.service';
import { UserDbServiceMock } from '../../database/service/user-db.service.mock';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Credentials } from '../../dto/user.dto';
import fetch from 'node-fetch';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { ConfigServiceMock } from '../../config/config.service.mock';

jest.mock('node-fetch');

const mockedPromise = Promise.resolve({
  json: () => Promise.resolve({ status: 200 })
});
const mockedPromiseActive = Promise.resolve({
  json: () => Promise.resolve({ status: 200, active: true })
});
const mockedPromiseStatusError = Promise.resolve({
  json: () => Promise.resolve({ status: 404 })
});
const mockedPromiseError = Promise.reject('error');

const accessToken = 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJCeGtyRDlNZXJMMWptRkc3UGROaUltSFV2c250UlNLanFicXp3MldHYXU4In0.eyJleHAiOjE1OTU0MjUxOTEsImlhdCI6MTU5NTQyNDg5MSwianRpIjoiMmZjNjlkMWEtODYxYS00ZmU0LWI5NjgtMTJlMzM0ZDE4NmQ5IiwiaXNzIjoiaHR0cHM6Ly9rZXljbG9hay50b29sLmRldi5saWJyYS5iYXdhZy5jb20vYXV0aC9yZWFsbXMvZGV2b3BzIiwiYXVkIjoiYWNjb3VudCIsInN1YiI6IjFjMmY0MTU1LTY0MGEtNDI1OS1iZjE2LTI1ZjBiYmE3NTI1NyIsInR5cCI6IkJlYXJlciIsImF6cCI6ImF0b21pYy1kZXNpZ24tYXBwIiwic2Vzc2lvbl9zdGF0ZSI6IjAzMDgzNWVmLWEzYzQtNDk0NS1hNTJiLWY3ZDdlZmVjNjc3ZCIsImFjciI6IjEiLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoiYmF3YWctZ3JvdXBzIGVtYWlsIHByb2ZpbGUiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6IlNlY3JldCBFbWFpbCIsImdyb3VwcyI6WyIvc2VjdXJpdHkiXSwicHJlZmVycmVkX3VzZXJuYW1lIjoicDAwMDAwMSIsImdpdmVuX25hbWUiOiJTZWNyZXQiLCJmYW1pbHlfbmFtZSI6IkVtYWlsIiwiZW1haWwiOiJzZWNyZXRAZW1haWwuY29tIn0.Nec9FOJF063Xi8dLFEB_bmY_b0H0t-d-KF3QrpPAImINXpFMXweyF2wup3pn9opUsD2AmtgNaFET4ewJDuvwFodvys6eD9RDZpYR1_uSETPT8_CyD6BAihyCH0w8kaJnG54RbmqtzUs91fDBkkVktN98kafpfjjQp4KsGEFBi1k0RwOeae34Ub7karIIASb7Vnt1HM0_mFsg7FlC6uK5MoSaglJhpuNa6L5Nj6DjFSSgvLZAUPrXCrQ0ask1U6YDKoQ1iHpqe6bLd3RKeVAvrd2a5n7UPB4hQ-S_pSgC8clheCFqT0lct_m6nu0M_wALVwODmElQTF5r_-X0sUo4Gw'

describe('AuthService', () => {
  let service: AuthService;

  const userMock: Credentials = { pNumber: 'p000001', password: 'password' };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ ConfigModule.forRoot() ],
      providers: [
        AuthService,
        { provide: UserDbService, useClass: UserDbServiceMock },
        { provide: ConfigService, useClass: ConfigServiceMock }
      ]
    }).compile();
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('token validation', () => {
    it('should verify to true', async () => {
      (fetch as any).mockReturnValue(mockedPromiseActive);

      const res = await service.validateToken(accessToken);
      expect(res).toEqual(true);
    });
    it('should verify to false', async () => {
      (fetch as any).mockReturnValue(mockedPromiseStatusError);

      await expect(service.validateToken(accessToken)).rejects.toThrow(UnauthorizedException);
    });
    it('should not be able to connect', async () => {
      (fetch as any).mockReturnValue(mockedPromiseError);

      await expect(service.validateToken(accessToken)).rejects.toThrow(ForbiddenException);
    });
  })
});
