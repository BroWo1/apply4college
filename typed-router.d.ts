/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
// Generated by unplugin-vue-router. ‼️ DO NOT MODIFY THIS FILE ‼️
// It's recommended to commit this file.
// Make sure to add this file to your tsconfig.json file as an "includes" or "files" entry.

declare module 'vue-router/auto-routes' {
  import type {
    RouteRecordInfo,
    ParamValue,
    ParamValueOneOrMore,
    ParamValueZeroOrMore,
    ParamValueZeroOrOne,
  } from 'vue-router'

  /**
   * Route name map generated by unplugin-vue-router
   */
  export interface RouteNamedMap {
    '/': RouteRecordInfo<'/', '/', Record<never, never>, Record<never, never>>,
    '/college/[collegeIdentifier]': RouteRecordInfo<'/college/[collegeIdentifier]', '/college/:collegeIdentifier', { collegeIdentifier: ParamValue<true> }, { collegeIdentifier: ParamValue<false> }>,
    '/essay': RouteRecordInfo<'/essay', '/essay', Record<never, never>, Record<never, never>>,
    '/essays': RouteRecordInfo<'/essays', '/essays', Record<never, never>, Record<never, never>>,
    '/explore': RouteRecordInfo<'/explore', '/explore', Record<never, never>, Record<never, never>>,
    '/home': RouteRecordInfo<'/home', '/home', Record<never, never>, Record<never, never>>,
    '/map': RouteRecordInfo<'/map', '/map', Record<never, never>, Record<never, never>>,
    '/profile': RouteRecordInfo<'/profile', '/profile', Record<never, never>, Record<never, never>>,
    '/settings': RouteRecordInfo<'/settings', '/settings', Record<never, never>, Record<never, never>>,
  }
}
