import { useState, useEffect } from "react";
import { type CreateLinkRequest } from "~/apis/create-link";
import { type GetLinksResponse } from "~/apis/get-links";
import Loading from "~/components/Loading";
import { type ApiResult, type UrlLink } from "~/types/types";
import { formatDate } from "~/utils/helper";
import { SignOutButton } from "@clerk/nextjs";

export default function Admin() {
  const [inputNewLink, setInputNewLink] = useState("");
  const [links, setLinks] = useState<ApiResult<UrlLink[]>>({
    data: undefined,
    loading: false,
    errorCode: undefined,
  });
  const [currentLink, setCurrentLink] = useState<LinkWithCode | undefined>(
    undefined
  );

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/private-links");
        const data = (await response.json()) as GetLinksResponse;
        setLinks({
          data: data.links,
          loading: false,
          errorCode: undefined,
        });
      } catch (error) {
        console.log("Error in admin fetch: ", error);
        // setLinks({
        //   data: undefined,
        //   loading: false,
        //   errorCode: error.code
        // });
      }
    }

    void fetchData();
  }, []);

  useEffect(() => {
    const current = links.data ? links.data[0] : undefined;
    setCurrentLink(current);
  }, [links.data]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputNewLink(event.target.value);
  };

  const validateUrl = (url: string) => {
    console.log("validating");
    try {
      const parsedUrl = new URL(url);

      if (parsedUrl.protocol !== "https:" && parsedUrl.protocol !== "http:") {
        return false;
      }

      return true;
    } catch (e) {
      return false;
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setLinks({
      data: undefined,
      loading: true,
      errorCode: undefined,
    });

    const isCorrectUrl = validateUrl(inputNewLink);
    if (!isCorrectUrl) {
      setLinks({
        data: undefined,
        loading: false,
        errorCode: 403,
      });
      return;
    }
    void handleAsyncSubmit();
  };

  const handleAsyncSubmit = async (): Promise<void> => {
    const requestData: CreateLinkRequest = { url: inputNewLink };
    try {
      const response = await fetch("/api/private-links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        console.error("Error adding new link:", response.statusText);
        setLinks({
          data: undefined,
          loading: false,
          errorCode: response.status,
        });
        return;
      }

      const data = (await response.json()) as LinkWithCode;
      setLinks((prevLinks) => ({
        data: [data as UrlLink, ...(prevLinks.data ?? [])],
        loading: false,
        errorCode: undefined,
      }));
      setInputNewLink("");
    } catch (error) {
      console.error("Error adding new link:", error);
      // setLinks({
      //   data: undefined,
      //   loading: false,
      //   errorCode: error.code
      // });
    }
  };

  const CurrentLink = () => {
    return (
      <div>
        <p>Current Link 现有链接: {currentLink?.url} </p>
        <p>Access Code 获取代码: {currentLink?.code}</p>
      </div>
    );
  };

  const ErrorMessage = () => {
    if (links.errorCode === 403) {
      return (
        <div>
          <p>链接格式错误。请输入以 https:// 开头的链接。</p>
        </div>
      );
    }

    if (links.errorCode === 404) {
      return (
        <div>
          <p>暂无链接。请添加新链接。</p>
        </div>
      );
    }

    return (
      <div>
        <p>发生错误。请重试。</p>
      </div>
    );
  };

  const HistoryLinks = () => {
    return (
      <div>
        <p>List of history links 历史链接:</p>
        {links.data?.map((link, index) => (
          <p key={index}>
            {link.url} | {formatDate(link.createdAt)}
          </p>
        ))}
      </div>
    );
  };

  return (
    <main id="admin">
      <div>
        <SignOutButton>
          <button className="btn btn-sm btn-danger">Sign out</button>
        </SignOutButton>
        <h1 className="title">管理员 Admin page</h1>
      </div>
      {links.data && <CurrentLink />}
      {links.loading && <Loading />}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter a new link"
          value={inputNewLink}
          onChange={handleInputChange}
        />
        <button className="btn btn-primary m-2" type="submit">
          Update 更新
        </button>
      </form>
      {links.errorCode && <ErrorMessage />}
      <div className="mt-5">{links.data && <HistoryLinks />}</div>
    </main>
  );
}

type LinkWithCode = {
  createdAt: Date;
  url: string;
  code: number;
};
