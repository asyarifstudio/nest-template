import { AuthGuard } from './auth.guard';

describe('RoleGuard', () => {
  it('should be defined', () => {
    expect(new AuthGuard()).toBeDefined();
  });
});
