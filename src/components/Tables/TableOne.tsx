"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Define Item type based on API response
interface Item {
  ItemID: number;
  ItemName: string;
  Description: string;
  Quantity: number;
}

const LOW_QUANTITY_THRESHOLD = 10; // Constant for low stock threshold

const TableOne = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Loader state
  const [error, setError] = useState<string | null>(null); // Error state

  useEffect(() => {
    axios
      .get<Item[]>("http://localhost:3000/api/items")
      .then((response) => {
        if (response.data.length === 0) {
          setError("No inventory items available at the moment.");
        } else {
          setItems(response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
        setError("Failed to fetch inventory items.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const lowStockItems = items.filter(
      (item) => item.Quantity < LOW_QUANTITY_THRESHOLD
    );
    if (lowStockItems.length > 0) {
      lowStockItems.forEach((item) => {
        toast.warn(
          `Low stock: ${item.ItemName} has only ${item.Quantity} left!`
        );
      });
    }
  }, [items]);

  return (
    <div className="rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <ToastContainer /> {/* Toast Container for notifications */}
      <h4 className="mb-5.5 text-body-2xlg font-bold text-dark dark:text-white text-center">
        Top Inventory Items
      </h4>

      {loading ? (
        <div className="flex h-32 items-center justify-center">
          <div className="loader h-10 w-10 rounded-full border-4 border-t-4 border-blue-500 ease-linear"></div>
        </div>
      ) : error ? (
        <div className="flex h-32 items-center justify-center text-red-600">
          {error}
        </div>
      ) : items.length === 0 ? (
        <div className="flex h-32 items-center justify-center text-gray-600">
          No inventory items at the moment.
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="grid grid-cols-3 sm:grid-cols-5">
            <div className="px-2 pb-3.5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Item Name
              </h5>
            </div>
            <div className="px-2 pb-3.5 text-center">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Description
              </h5>
            </div>
            <div className="px-2 pb-3.5 text-center">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Quantity
              </h5>
            </div>
            <div className="hidden px-2 pb-3.5 text-center sm:block">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Status
              </h5>
            </div>
          </div>

          {items.map((item, key) => (
            <div
              className={`grid grid-cols-3 sm:grid-cols-5 ${
                key === items.length - 1
                  ? ""
                  : "border-b border-stroke dark:border-dark-3"
              }`}
              key={item.ItemID}
            >
              <div className="flex items-center gap-3.5 px-2 py-4">
                <p className="font-medium text-dark dark:text-white">
                  {item.ItemName}
                </p>
              </div>

              <div className="flex items-center justify-center px-2 py-4">
                <p className="font-medium text-dark dark:text-white">
                  {item.Description}
                </p>
              </div>

              <div className="flex items-center justify-center px-2 py-4">
                <p
                  className={`font-medium ${
                    item.Quantity < LOW_QUANTITY_THRESHOLD
                      ? "text-red-700"
                      : "text-dark"
                  }`}
                >
                  {item.Quantity}
                </p>
              </div>

              <div className="hidden items-center justify-center px-2 py-4 sm:flex">
                <p
                  className={`font-medium ${
                    item.Quantity < LOW_QUANTITY_THRESHOLD
                      ? "text-red-700"
                      : "text-green-600"
                  }`}
                >
                  {item.Quantity < LOW_QUANTITY_THRESHOLD
                    ? "Low Stock"
                    : "In Stock"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TableOne;
