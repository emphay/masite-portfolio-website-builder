import React from "react";
export default function AddPresentation()
{
  return (
    <form method="post" action="/api/add-presentation">
      <label>Title: <input name="presentationTitle" type="text"></input></label>
      <label>Link: <input name="presentationLink" type="text"></input></label>
      <label>Date of Presentation: <input name="dateOfPresentation" type="date"></input></label>
      <button type="submit">Add Presentation</button>
    </form>
  );
}
