export interface JSONRPCResponse<T> {
  jsonrpc: string;
  result?: T;
  error?: {
    code: number;
    message: string;
    data?: Record<string, string | string[] | number | object>;
  };
}

export class jsonRPC {
  static success<T>(result: T): JSONRPCResponse<T> {
    return {
      jsonrpc: '2.0',
      result,
    };
  }

  static callback(
    event: 'created' | 'updated' | 'deleted' | 'service',
    type: string,
    data: object,
  ) {
    return {
      event,
      objType: type,
      obj: data,
    };
  }

  static error(
    code: number,
    message: string,
    data?: Record<string, string | string[] | number | object>,
  ): JSONRPCResponse<null> {
    return {
      jsonrpc: '2.0',
      error: { code, message, data },
    };
  }
}
