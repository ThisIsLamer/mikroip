export class Rest {
  static error(
    method: string,
    message: string,
    statusCode: number
  ) {
    return {
      method, message, statusCode
    }
  }
}