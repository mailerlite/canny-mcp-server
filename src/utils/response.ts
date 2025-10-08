export interface SuccessEnvelope<T> {
  success: true;
  data: T;
}

export interface ErrorEnvelope {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export const buildSuccess = <T>(payload: T) =>
  JSON.stringify({
    success: true,
    data: payload,
  } satisfies SuccessEnvelope<T>);

export const buildError = (code: string, message: string) =>
  JSON.stringify({
    success: false,
    error: {
      code,
      message,
    },
  } satisfies ErrorEnvelope);

