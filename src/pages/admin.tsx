import React from "react";

export default function admin() {
  return (
    <div className="container">
      <div>
        <h1>Admin page</h1>
      </div>
      <div>
        <p>Current Link: ... </p>
        <p> Created time: ...</p>
      </div>
      <div>
        <input type="text" placeholder="Enter a new link" />
        <button className="btn btn-primary m-2">Update</button>
      </div>
    </div>
  );
}
