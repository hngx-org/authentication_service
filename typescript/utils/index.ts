export function success(message: string, args: unknown = {} || null, statusCode?: number) {
  return {
    status: 'success',
    statusCode: statusCode || 200,
    message: message,
    data: args,
  }
}
