export interface ErrorResponse {
  error: string;
}

export type UrlLink = {
  createdAt: Date;
  url: string;
  code: number;
};

export type UrlLinkWithCode = {
  createdAt: Date;
  url: string;
  code: number;
};

export type ApiResult<T> = {
  // data & loading for next section!
  data: T | undefined;
  loading: boolean;
  errorCode: number | undefined;
};
