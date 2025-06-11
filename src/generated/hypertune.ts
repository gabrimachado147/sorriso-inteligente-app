export type Context = {
  environment?: string;
  user?: { id: string; name: string; email: string };
};

export type RootFlagValues = {
  exampleFlag: boolean;
  enableDesignV2: boolean;
};

export const flagFallbacks: RootFlagValues = {
  exampleFlag: false,
  enableDesignV2: false,
};

export const vercelFlagDefinitions = {
  exampleFlag: { key: 'exampleFlag' },
  enableDesignV2: { key: 'enableDesignV2' },
};

export const createSource = () => ({
  async get() { return flagFallbacks; }
});

export const declarations = {
  exampleFlag: { key: 'exampleFlag' },
  enableDesignV2: { key: 'enableDesignV2' },
};
