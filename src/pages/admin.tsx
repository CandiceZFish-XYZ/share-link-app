import React from "react";

export default function admin() {
  return (
    <main id="admin">
      <div>
        <h1 className="title">管理员 Admin page</h1>
      </div>
      <div>
        <p>Current Link 现有链接: ... </p>
        <p> Created time 创建时间: ...</p>
      </div>
      <div>
        <input type="text" placeholder="Enter a new link" />
        <button className="btn btn-primary m-2">Update 更新</button>
      </div>
      <div className="mt-5">
        <p>List of history links 历史链接:</p>
        <p>... | 创建时间 | 失效时间</p>
      </div>
    </main>
  );
}
