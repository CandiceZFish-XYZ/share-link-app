import { type Facetime } from "@prisma/client";
import { useState, useEffect } from "react";
import { type ApiResponse } from "~/types/types";
import { formatDate } from "~/utils/helper";

export default function Home() {
  const [link, setLink] = useState<Facetime[]>([]);
  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await fetch("/api/links");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = (await response.json()) as ApiResponse<Facetime[]>;
        setLink(data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    void fetchLinks();
  }, []);

  return (
    <main id="home">
      <div>
        <h1 className="title">一起视频！</h1>
      </div>
      {link[0] && (
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
          <p className="lead">或复制这个网址并粘贴到浏览器： {link[0].link}</p>
          <p>更新时间： {formatDate(link[0])}</p>
        </div>
      )}
    </main>
  );
}

// // ====================

// import { type Facetime } from "@prisma/client";
// import { useState, useEffect } from "react";
// import { type CreateLinkRequest, type ApiResponse } from "~/types/types";
// import { formatDate } from "~/utils/helper";

// export default function Admin() {
//   const [newLink, setNewLink] = useState("");
//   const [links, setLinks] = useState<Facetime[]>([]);

//   const fetchLinks = async () => {
//     try {
//       const response = await fetch("/api/links");
//       if (!response.ok) {
//         throw new Error("Failed to fetch data");
//       }

//       const data = (await response.json()) as ApiResponse<Facetime[]>;
//       setLinks(data.data);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   useEffect(() => {
//     console.log("fetchin...");
//     void fetchLinks();
//   }, []);

//   const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setNewLink(event.target.value);
//   };

//   const handleSubmit = () => {
//     console.log("submitting...");
//     const requestData: CreateLinkRequest = { link: newLink };

//     fetch("/api/links", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(requestData),
//     })
//       .then((res) => res.json())
//       .then((data: ApiResponse<Facetime>) => {
//         void fetchLinks();
//         console.log("New link added:", data.data);
//       })
//       .catch((error) => {
//         console.error("Error adding new link:", error);
//       });
//   };

//   return (
//     <main id="admin">
//       <div>
//         <h1 className="title">管理员 Admin page</h1>
//       </div>
//       {links[0] && (
//         <div>
//           <p>Current Link 现有链接: {links[0].link} </p>
//           <p> Created time 创建时间: {formatDate(links[0])}</p>
//         </div>
//       )}
//       <div>
//         <input
//           type="text"
//           placeholder="Enter a new link"
//           value={newLink}
//           onChange={handleInputChange}
//         />
//         <button className="btn btn-primary m-2" onClick={handleSubmit}>
//           Update 更新
//         </button>
//       </div>
//       <div className="mt-5">
//         <p>List of history links 历史链接:</p>
//         <div>
//           {links.map((link) => (
//             <p key={link.id}>
//               {link.link} | {formatDate(link)}
//             </p>
//           ))}
//         </div>
//       </div>
//     </main>
//   );
// }
