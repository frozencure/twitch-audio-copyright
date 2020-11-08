import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '../../../../client/src/app/login/auth.guard';

describe('KeycloakGuard', () => {
  let guard: AuthGuard;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard
      ]
    }).compile();
    guard = module.get<AuthGuard>(AuthGuard);
  });
  it('should be defined', () => {
    expect(guard).toBeDefined();
  });
});
