import { useState } from "react";
import { formatDate } from "~/utils/helper";
import { type UrlLink, type ApiResult } from "~/types/types";
import Loading from "~/components/Loading";
import Link from "next/link";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";

export default function Home() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
    setLinkResult((prev) => ({
      data: prev.data,
      loading: true,
      errorCode: undefined,
    }));
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
      <Row className="mb-5 justify-content-center">
        <Col xs="auto" as="h1">
          一起视频！
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col xs="auto">
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
        </Col>
      </Row>
      <div className="mt-5 p-2 text-secondary">
        <Row className="mb-2">不知道从哪里开始？</Row>
        <Row className="justify-content-center">
          <Col>
            <Button variant="primary" size="sm" onClick={handleShow}>
              查看帮助
            </Button>
            <div className="d-inline p-2">或者</div>

            <Link className="btn btn-sm btn-warning" href="/admin">
              创建链接
            </Link>
          </Col>
        </Row>
      </div>
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
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="codeForLlink">
          <Form.Label>请输入链接代码：</Form.Label>
          <Form.Control
            type="number"
            className="form-control form-control-lg my-4 col-md-4"
            aria-describedby="codeForLlink"
            placeholder="4位数代码"
            step="1"
            value={inputCodeString}
            onChange={(e) => setInputCodeString(e.target.value)}
          />
          <Button type="submit" variant="primary">
            获取链接
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
}
