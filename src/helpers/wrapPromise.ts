export const wrapPromise = (promise: Promise<unknown>) => {
  let status: string = 'pending';
  let response: unknown | null = null;

  const suspender = promise.then(
    (res: unknown) => {
      status = 'success';
      response = res;
    },
    (err: Error) => {
      status = 'error';
      response = err;
    },
  );

  const handler = {
    pending: () => {
      throw suspender;
    },
    error: () => {
      throw response;
    },
    default: () => response,
  };

  const read = () => {
    const result = handler[status] ? handler[status]() : handler.default();
    return result;
  };

  return { read };
}