"use client"; 
import React, { useState } from "react";
import axios from "axios";

const AddItemForm: React.FC = () => {
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState<number | string>("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/api/add-items", {
        itemName,
        description,
        quantity: Number(quantity), // Ensure quantity is sent as a number
      });

      setSuccessMessage(response.data.message);
      setErrorMessage(null);

      // Clear the form
      setItemName("");
      setDescription("");
      setQuantity("");
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.error || "An error occurred. Please try again."
      );
      setSuccessMessage(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">Add New Item</h1>

      {successMessage && (
        <div className="mb-4 text-green-600">{successMessage}</div>
      )}
      {errorMessage && <div className="mb-4 text-red-600">{errorMessage}</div>}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-96"
      >
        <div className="mb-4">
          <label className="block text-gray-700">Item Name</label>
          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            className="w-full px-4 py-2 border rounded mt-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border rounded mt-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full px-4 py-2 border rounded mt-2"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Add Item
        </button>
      </form>
    </div>
  );
};

export default AddItemForm;
