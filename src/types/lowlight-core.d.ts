declare module "lowlight/lib/core" {
  import { LowlightRoot } from "lowlight";
  import { LanguageFn } from "highlight.js";

  export function createLowlight(): LowlightRoot;

  export interface Lowlight {
    register(language: { [name: string]: LanguageFn }): void;
  }
}
