/** Cookie and header names shared by the API (which sets them) and the web app (which reads them). */
export const ACCESS_COOKIE = 'sf_access';
export const REFRESH_COOKIE = 'sf_refresh';
/** Readable by JavaScript on purpose: double-submit CSRF token (DESIGN.md §2.5). */
export const CSRF_COOKIE = 'sf_csrf';
export const CSRF_HEADER = 'x-csrf-token';
