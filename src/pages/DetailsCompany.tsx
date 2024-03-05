import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function DetailsCompany() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [company, setCompany] = useState<Company | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedCompany, setEditedCompany] = useState<Partial<Company> | null>(
    null
  );
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          // "https://fzfuwanscuihuambjbcz.supabase.co/rest/v1/Company?id=eq." +
          //   id +
          //   "&select=*",
          `https://fzfuwanscuihuambjbcz.supabase.co/rest/v1/Company?id=eq.${id}&select=*`,

          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              apikey: process.env.REACT_APP_API_KEY || "",
            },
          }
        );
        console.log("Response status code:", response.status);

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        console.log(data);
        setCompany(data[0]);
        console.log(company);
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchData();
  }, [id]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!company) {
    return <div>Loading...</div>;
  }

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setEditedCompany(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditedCompany((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editedCompany) return;

    try {
      const response = await fetch(
        `https://fzfuwanscuihuambjbcz.supabase.co/rest/v1/Company?id=eq.${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            apikey: process.env.REACT_APP_API_KEY || "",
          },
          body: JSON.stringify(editedCompany),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update company");
      }

      setCompany((prevCompany) => ({
        ...prevCompany!,
        ...editedCompany,
      }));
      toggleModal();
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="container mt-4">
      <div>
        <img
          src={company.logo}
          className="card-img-top"
          alt={`${company.name} Logo`}
          style={{ height: "180px", objectFit: "cover" }}
        />
        <h2>{company.name} Details</h2>
        <p>Email: {company.email}</p>
        <p>
          Website:{" "}
          <a href={company.website} target="_blank" rel="noopener noreferrer">
            {company.website}
          </a>
        </p>
        <p>Type: {company.type}</p>
        <button onClick={toggleModal} className="btn btn-primary me-2">
          Edit
        </button>
        <button onClick={() => navigate(-1)} className="btn btn-secondary">
          Go Back
        </button>
      </div>
      <div
        className={`modal ${isModalOpen ? "show" : ""}`}
        style={{ display: isModalOpen ? "block" : "none" }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Company</h5>
              <button
                type="button"
                className="btn-close"
                onClick={toggleModal}
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Name:</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={editedCompany?.name || company.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email:</label>
                  <input
                    type="text"
                    className="form-control"
                    name="email"
                    value={editedCompany?.email || company.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Website:</label>
                  <input
                    type="text"
                    className="form-control"
                    name="website"
                    value={editedCompany?.website || company.website}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Type:</label>
                  <select
                    className="form-select"
                    name="type"
                    value={editedCompany?.type || company.type}
                    onChange={handleInputChange}
                  >
                    <option value="Government">Government</option>
                    <option value="Private">Private</option>
                    <option value="Foreign">Foreign</option>
                  </select>
                </div>
                <div className="text-end">
                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    onClick={toggleModal}
                  >
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && <div className="modal-backdrop fade show"></div>}
    </div>
  );
}
