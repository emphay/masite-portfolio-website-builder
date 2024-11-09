import React from "react";
export default function AddLinks()
{
  return (
    <form method="post" action="/api/add-link">
      <label>Title: <input name="title" type="text"></input></label>
      <label>Link: <input name="url" type="text"></input></label>
      <label>Icon: <input name="icon" type="text"></input></label>
      <button type="submit">Add Link</button>
    </form>
  );
}
