import React, { useState } from "react";

export default function AddProjects() {
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectLink, setProjectLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/add-project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectTitle,
          projectDescription: projectDescription || null,  // Allow empty string to be null
          projectLink,
        }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || "Failed to add project");
      }

      setSuccess("Project added successfully");
      setProjectTitle("");
      setProjectDescription("");
      setProjectLink("");
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Title:
          <input
            name="projectTitle"
            type="text"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Description:
          <input
            name="projectDescription"
            type="text"
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Link:
          <input
            name="projectLink"
            type="text"
            value={projectLink}
            onChange={(e) => setProjectLink(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Project"}
        </button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </form>
  );
}
