import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function ListCompanies() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://fzfuwanscuihuambjbcz.supabase.co/rest/v1/Company?select=*",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              apikey: process.env.REACT_APP_API_KEY || "",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        setCompanies(data);
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (companyId: number) => {
    try {
      const response = await fetch(
        `https://fzfuwanscuihuambjbcz.supabase.co/rest/v1/Company?id=eq.${companyId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            apikey: process.env.REACT_APP_API_KEY || "",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete company");
      }

      // Update companies state after successful deletion
      setCompanies((prevCompanies) =>
        prevCompanies.filter((company) => company.id !== companyId)
      );
    } catch (error: any) {
      setError(error.message);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div className="container mt-4">
      <h2 className="mb-4">List of Companies</h2>
      <button
        onClick={() => {
          navigate("/add-company");
        }}
        className="btn btn-primary mb-3"
      >
        Add New Company
      </button>
      <div className="row">
        {companies.map((company, index) => (
          <div className="col-md-4 mb-3" key={index}>
            <div className="card">
              <img
                src={company.logo}
                className="card-img-top"
                alt={`${company.name} Logo`}
                style={{ height: "180px", objectFit: "cover" }}
              />
              <div className="card-body">
                <Link
                  to={`/company/${company.id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <h5 className="card-title">{company.name}</h5>
                </Link>
                <p className="card-text">Type: {company.type}</p>
                <button
                  onClick={() => handleDelete(company.id)}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
