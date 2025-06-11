export interface Context {
  environment?: string | null;
  user?: { id: string; name?: string | null; email?: string | null } | null;
}

export interface RootFlagValues {
  exampleFlag: boolean;
  enableDesignV2: boolean;
}

export const vercelFlagDefinitions = {} as const;
export const flagFallbacks = {} as const;
export function createSource() {
  return {} as any;
}
