export const shouldGeoRestrict = (error: any) =>
  error.status === 403 || error.originalError?.code === 'ERR_NETWORK';
