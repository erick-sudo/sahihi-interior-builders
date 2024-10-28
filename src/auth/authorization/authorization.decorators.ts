import { SetMetadata } from '@nestjs/common';

export class ViolationOptions {
  message?: string;
}

export class AuthorizationOptions<T extends any> {
  readonly tokens?: T[];
  readonly violationOptions?: ViolationOptions;

  constructor(tokens?: T[], violationOptions?: ViolationOptions) {
    this.tokens = tokens;
    this.violationOptions = violationOptions;
  }
}

export const PRE_AUTHORIZE_KEY = 'pre_authorize';

export function PreAuthorize<T>(spec: {
  tokens: T[];
  violationOptions?: ViolationOptions;
}) {
  return SetMetadata(
    PRE_AUTHORIZE_KEY,
    new AuthorizationOptions(spec.tokens, spec.violationOptions),
  );
}
