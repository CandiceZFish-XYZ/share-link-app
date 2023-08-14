import { type Facetime } from "@prisma/client";
import { useState, useEffect } from "react";
import { type CreateLinkRequest, type ApiResponse } from "~/types/types";
import { formatDate, fetchLinks } from "~/utils/helper";

export default function Admin() {
  const [newLink, setNewLink] = useState("");
  const [links, setLinks] = useState<Facetime[]>([]);
  const [currentLink, setCurrentLink] = useState<Facetime | null>(links[0]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchLinks();
        setLinks(data);
      } catch (error) {
        console.log("Error in admin fetch: ", error);
      }
    }

    void fetchData();
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewLink(event.target.value);
  };

  // const handleSubmit = () => {
  //   const requestData: CreateLinkRequest = { link: newLink };

  //   fetch("/api/links", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(requestData),
  //   })
  //     .then((res) => res.json())
  //     .then((data: ApiResponse<Facetime>) => {
  //       // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  //       setLinks((prev) => [...prev, data.data[0]]);
  //       setNewLink("");
  //     })
  //     .catch((error) => {
  //       console.error("Error adding new link:", error);
  //     });
  // };

  const handleSubmit = async () => {
    const requestData: CreateLinkRequest = { link: newLink };

    try {
      const response = await fetch("/api/links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const responseData: ApiResponse<Facetime> = await response.json();

        setLinks((prevLinks) => {
          return [...prevLinks, responseData.data[0]];
        });
        setNewLink(""); // Clear the input field after successful submission
      } else {
        console.error("Error adding new link:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding new link:", error);
    }
  };

  useEffect(() => {
    if (links.length > 0) {
      setCurrentLink(links[0]);
    } else {
      setCurrentLink(null);
    }
  }, [links]);

  const CurrentLink = () => {
    return (
      <div>
        <p>Current Link 现有链接: {currentLink?.link} </p>
        <p>Access Code 获取代码: {currentLink?.code}</p>
        <p> Created time 创建时间: {currentLink && formatDate(currentLink)}</p>
      </div>
    );
  };

  const Loading = () => {
    return (
      <div>
        <p>暂无链接。请添加新链接。</p>
      </div>
    );
  };

  const HistoryLinks = () => {
    return (
      <div>
        {links.map((link) => (
          <p key={link.id}>
            {link.link} | {formatDate(link)}
          </p>
        ))}
      </div>
    );
  };

  return (
    <main id="admin">
      <div>
        <h1 className="title">管理员 Admin page</h1>
      </div>
      {links[0] ? <CurrentLink /> : <Loading />}
      <div>
        <input
          type="text"
          placeholder="Enter a new link"
          value={newLink}
          onChange={handleInputChange}
        />
        <button className="btn btn-primary m-2" onClick={handleSubmit}>
          Update 更新
        </button>
      </div>
      <div className="mt-5">
        <p>List of history links 历史链接:</p>
        {links ? <HistoryLinks /> : <Loading />}
      </div>
    </main>
  );
}
