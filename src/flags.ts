import { Identify } from "flags";
import { dedupe, flag } from "flags/next";
import { createHypertuneAdapter } from "@flags-sdk/hypertune";
import {
  createSource,
  flagFallbacks,
  vercelFlagDefinitions as flagDefinitions,
  Context,
  RootFlagValues,
  declarations,
} from "./generated/hypertune";

const identify: Identify<Context> = dedupe(async ({ headers, cookies }) => {
  return {
    environment: process.env.NODE_ENV,
    user: { id: "1", name: "Test User", email: "hi@test.com" },
  };
});

const hypertuneAdapter = createHypertuneAdapter<RootFlagValues, Context>({
  createSource,
  flagFallbacks,
  flagDefinitions,
  identify,
});

export const exampleFlagFlag = flag(hypertuneAdapter.declarations.exampleFlag);

export const enableDesignV2Flag = flag(
  hypertuneAdapter.declarations.enableDesignV2,
);
