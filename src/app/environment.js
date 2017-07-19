import { enableDebugTools, disableDebugTools } from '@angular/platform-browser';
import { ApplicationRef, enableProdMode } from '@angular/core';
/**
 * Environment Providers
 */
let PROVIDERS: any[] = [
  /**
   * Common env directives
   */
];

/**
 * Angular debug tools in the dev console
 * https://github.com/angular/angular/blob/86405345b781a9dc2438c0fbe3e9409245647019/TOOLS_JS.md
 */
/* eslint-disable no-underscore-dangle */
let _decorateModuleRef = value => value;

if (ENV === 'production') {
  enableProdMode();

  /**
   * Production
   */
  _decorateModuleRef = (modRef: any) => {
    disableDebugTools();

    return modRef;
  };

  PROVIDERS = [
    ...PROVIDERS,
    /**
     * Custom providers in production.
     */
  ];
} else {
  _decorateModuleRef = (modRef) => {
    const appRef = modRef.injector.get(ApplicationRef);
    const cmpRef = appRef.components[0];

    const ng = window.ng;
    enableDebugTools(cmpRef);
    window.ng.probe = ng.probe;
    window.ng.coreTokens = ng.coreTokens;
    return modRef;
  };

  /**
   * Development
   */
  PROVIDERS = [
    ...PROVIDERS,
    /**
     * Custom providers in development.
     */
  ];
}

export const decorateModuleRef = _decorateModuleRef;

export const ENV_PROVIDERS = [...PROVIDERS];
