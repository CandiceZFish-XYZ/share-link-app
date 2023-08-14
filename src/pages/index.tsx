import { type Facetime } from "@prisma/client";
import { useState } from "react";
import { formatDate, fetchLinkWithCode } from "~/utils/helper";

export default function Home() {
  const [link, setLink] = useState<Facetime[]>([]);
  const [inputCodeString, setInputCodeString] = useState<string>("");
  const [isWrongCode, setIsWrongCode] = useState<boolean>(false);
  const [isVerifiedCode, setIsVerifiedCode] = useState<boolean>(false);

  const DisplayInput = () => {
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
  };
  const DisplayLink = () => {
    return (
      <div>
        <p className="lead">
          <a
            className="btn btn-primary btn-lg fw-bold"
            href={link[0]?.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            加入
          </a>
        </p>
        <p className="lead">或复制这个网址并粘贴到浏览器： {link[0]?.link}</p>
        <p>更新时间： {link[0] && formatDate(link[0])}</p>
      </div>
    );
  };

  const Loading = () => {
    return (
      <div>
        <p>暂无链接。请重试。</p>
      </div>
    );
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault(); // Prevent the default form submission behavior
    const verifyResult = await verifyCode(inputCodeString);
    // console.log("verifyResult: ", verifyResult);
    if (verifyResult) {
      setIsWrongCode(false);
      setIsVerifiedCode(true);
      setInputCodeString("");
    } else {
      setIsWrongCode(true);
      setIsVerifiedCode(false);
      setInputCodeString("");
    }
  };

  const verifyCode = async (inputCodeString: string): Promise<boolean> => {
    const code = parseInt(inputCodeString);
    if (!code || isNaN(code) || code < 1000 || code > 9999) {
      return false;
    }
    //query to check

    try {
      const data = await fetchLinkWithCode(inputCodeString);
      // console.log("Verified code, data: ");
      // console.log(data);
      setLink(data);
      return true;
    } catch (error) {
      console.log("Error in fetching link with code: ", error);
      return false;
    }
  };

  const WrongCode = () => {
    return (
      <div>
        <p>链接代码错误。链接代码应为4位数, 请核对后重试。</p>
      </div>
    );
  };

  return (
    <main id="home">
      <div className="mb-5">
        <h1 className="title">一起视频！</h1>
      </div>
      {(!isVerifiedCode || link.length < 1) && <DisplayInput />}

      {isWrongCode && <WrongCode />}
      {isVerifiedCode && (link.length > 0 ? <DisplayLink /> : <Loading />)}
    </main>
  );
}
