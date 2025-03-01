export const httpResponse = (
  statusCode: number,
  message: string,
  data?: any
) => {
  return {
    statusCode,
    message,
    data,
  };
};
