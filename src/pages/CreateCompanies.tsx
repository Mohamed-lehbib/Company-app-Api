import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export default function CreateCompanies() {
  const form = useForm<Company>({ mode: "all" });
  const { register, handleSubmit, formState, reset, getValues } = form;
  const { errors } = formState;

  const navigate = useNavigate();

  const onSubmit = async (data: Company) => {
    try {
      const submissionData = {
        ...data,
        creation_date: new Date().toISOString().split("T")[0],
      };
      console.log(submissionData);
      const response = await fetch(
        "https://fzfuwanscuihuambjbcz.supabase.co/rest/v1/Company",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6ZnV3YW5zY3VpaHVhbWJqYmN6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwOTYzMDAwMCwiZXhwIjoyMDI1MjA2MDAwfQ.mmxqvMvQZv3uNh9YoInnmpyJDsQDV_c7qLz-RKWV5wg",
          },
          body: JSON.stringify(submissionData),
        }
      );
      console.log(response.status);
      if (!response.ok) {
        throw new Error("Failed to add company");
      }

      reset(); // Reset form fields after successful submission
      navigate("/"); // Navigate to the home page or any desired route
    } catch (error: any) {
      console.error("Error adding company:", error.message);
    }
  };

  const onCancel = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Add New Company</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            {...register("name", {
              required: { value: true, message: "Name is required" },
            })}
          />
          <p className="text-danger">{errors.name?.message}</p>
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            {...register("description", {
              required: { value: true, message: "Description is required" },
            })}
          />
          <p className="text-danger">{errors.description?.message}</p>
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="text"
            className="form-control"
            {...register("email", {
              required: { value: true, message: "Email is required" },
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid Email format example: example@example.com",
              },
            })}
          />
          <p className="text-danger">{errors.email?.message}</p>
        </div>
        <div className="mb-3">
          <label className="form-label">WebSite</label>
          <input
            type="text"
            className="form-control"
            {...register("website", {
              // required: { value: true, message: "WebSite is required" },
              pattern: {
                value: /^(ftp|http|https):\/\/[^ "]+$/,
                message:
                  "Invalid website URL format example: http://example.com",
              },
            })}
          />
          <p className="text-danger">{errors.website?.message}</p>
        </div>
        <div className="mb-3">
          <label className="form-label">Logo</label>
          <input
            type="text"
            className="form-control"
            {...register("logo", {
              // required: { value: true, message: "Logo is required" },
              pattern: {
                value: /^(ftp|http|https):\/\/[^ "]+$/,
                message: "Invalid logo URL format example: http://example.com",
              },
            })}
          />
          <p className="text-danger">{errors.logo?.message}</p>
        </div>
        {/* Display preview of the logo */}
        <div className="mb-3">
          {form.getValues().logo && (
            <img
              src={form.getValues().logo}
              alt="Logo Preview"
              className="img-thumbnail"
              style={{ width: "150px", height: "150px" }}
            />
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">Type</label>
          <select {...register("type")} className="form-select">
            <option value="Government">Government</option>
            <option value="Private">Private</option>
            <option value="Foreign">Foreign</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Creation Date</label>
          <input
            type="date" // Using input type 'date' for creation date
            className="form-control"
            {...register("creation_date", {
              required: { value: true, message: "Creation Date is required" },
            })}
          />
          <p className="text-danger">{errors.creation_date?.message}</p>
        </div>
        <div className="text-start">
          <button
            type="button"
            className="btn btn-secondary me-2"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
