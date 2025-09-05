"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

const SubscriptionRenewals = () => {
  const [renewals, setRenewals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRenewals = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5000/api/superadmin/renewals",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRenewals(res.data);
      } catch (err) {
        console.error("Error fetching renewals:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRenewals();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Subscription Renewals</h2>
      <table className="w-full border border-gray-300 rounded-lg">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Admin</th>
            <th className="p-2 border">Business</th>
            <th className="p-2 border">Plan</th>
            <th className="p-2 border">Start</th>
            <th className="p-2 border">End</th>
            <th className="p-2 border">Amount</th>
            <th className="p-2 border">Coupon</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Payment</th>
          </tr>
        </thead>
        <tbody>
          {renewals.length > 0 ? (
            renewals.map((r) => (
              <tr key={r.id} className="border">
                <td className="p-2 border">
                  {r.admin.firstName} {r.admin.lastName} <br />
                  <span className="text-sm text-gray-500">{r.admin.email}</span>
                </td>
                <td className="p-2 border">{r.admin.businessName}</td>
                <td className="p-2 border">{r.plan.planName}</td>
                <td className="p-2 border">
                  {new Date(r.startDate).toLocaleDateString()}
                </td>
                <td className="p-2 border">
                  {new Date(r.endDate).toLocaleDateString()}
                </td>
                <td className="p-2 border">${r.amount}</td>
                <td className="p-2 border">{r.couponCode || "—"}</td>
                <td
                  className={`p-2 border font-semibold ${
                    r.status === "Active" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {r.status}
                </td>
                <td className="p-2 border">
                  {r.subscriptionTrack.paymentStatus}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center p-4">
                No renewals found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SubscriptionRenewals;
