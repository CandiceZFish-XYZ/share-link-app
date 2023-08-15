import { useState } from "react";
import { formatDate } from "~/utils/helper";
import { type UrlLink, type ApiResult } from "~/types/types";
import Loading from "~/components/Loading";

export default function Home() {
  const [linkResult, setLinkResult] = useState<ApiResult<UrlLink>>({
    data: undefined,
    loading: false,
    errorCode: undefined,
  });
  const [inputCodeString, setInputCodeString] = useState<string>("");

  const DisplayLink = () => {
    return (
      <div>
        <p className="lead">
          <a
            className="btn btn-primary btn-lg fw-bold"
            href={linkResult.data?.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            加入
          </a>
        </p>
        <p className="lead">
          或复制这个网址并粘贴到浏览器： {linkResult.data?.url}
        </p>
        <p>
          更新时间： {linkResult.data && formatDate(linkResult.data.createdAt)}
        </p>
      </div>
    );
  };

  const ErrorMessage = () => {
    if (linkResult.errorCode === 404) {
      return (
        <div>
          <p>链接未找到。请重试。</p>
        </div>
      );
    }

    if (linkResult.errorCode === 403) {
      return (
        <div>
          <p>链接代码错误。链接代码应为4位数, 请核对后重试。</p>
        </div>
      );
    }

    return (
      <div>
        <p>发生错误。请重试。</p>
      </div>
    );
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setLinkResult({
      data: undefined,
      loading: true,
      errorCode: undefined,
    });
    void verifyCode(inputCodeString);
  };

  const verifyCode = async (inputCodeString: string): Promise<void> => {
    const code = parseInt(inputCodeString);
    if (!code || isNaN(code) || code < 1000 || code > 9999) {
      setLinkResult({
        data: undefined,
        loading: false,
        errorCode: 403,
      });
      return;
    }

    try {
      const response = await fetch(`/api/links?code=${code}`);
      if (!response.ok) {
        setLinkResult({
          data: undefined,
          loading: false,
          errorCode: response.status,
        });
        return;
      }

      const data = (await response.json()) as UrlLink;
      setLinkResult({
        data: data,
        loading: false,
        errorCode: undefined,
      });
    } catch (error) {
      console.error("Error fetching link with code:");
      console.error(error);
      // setLinkResult({
      //   data: undefined,
      //   loading: false,
      //   errorCode: error.code,
      // });
    }
  };

  return (
    <main id="home">
      <div className="mb-5">
        <h1 className="title">一起视频！</h1>
      </div>
      {linkResult.data ? (
        <DisplayLink />
      ) : (
        <DisplayInput
          handleSubmit={handleSubmit}
          inputCodeString={inputCodeString}
          setInputCodeString={setInputCodeString}
        />
      )}
      {linkResult.loading && <Loading />}
      {linkResult.errorCode && <ErrorMessage />}
    </main>
  );
}

function DisplayInput({
  handleSubmit,
  inputCodeString,
  setInputCodeString,
}: {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  inputCodeString: string;
  setInputCodeString: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div className="mb-5">
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group col-md-2 mx-auto">
            <label htmlFor="codeForLink">请输入链接代码：</label>
            <input
              type="number"
              className="form-control form-control-lg my-4 col-md-4"
              id="codeForLink"
              aria-describedby="codeForLlink"
              placeholder="4位数代码"
              step="1"
              value={inputCodeString}
              onChange={(e) => setInputCodeString(e.target.value)}
            />
            <button type="submit" className="btn btn-lg btn-primary">
              获取链接
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
