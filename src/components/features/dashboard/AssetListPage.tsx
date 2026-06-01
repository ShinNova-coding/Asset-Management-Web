// src/pages/Dashboard/AssetListPage.tsx

import { useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import { laptops } from "@/data/laptops";
import { phones } from "@/data/phones";
import { monitors } from "@/data/monitors";
import { chairs } from "@/data/chairs";
import { software } from "@/data/software";

const dataMap: Record<string, any[]> = {
  laptop: laptops,
  phone: phones,
  monitor: monitors,
  chair: chairs,
  software,
};

const AssetListPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const type = params.get("type") || "";

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  const assets = dataMap[type] || [];

  const filteredAssets = useMemo(() => {
    return assets.filter((a) => {
      const matchSearch = a.name.toLowerCase().includes(search.toLowerCase());

      const matchStatus = status === "ALL" ? true : a.status === status;

      return matchSearch && matchStatus;
    });
  }, [assets, search, status]);

  if (!type) {
    return (
      <div className="p-6">
        No asset type selected.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold capitalize">
          {type} Assets
        </h1>

        <button
          onClick={() => navigate(-1)}
          className="text-sm text-blue-600 font-semibold"
        >
          ← Back
        </button>
      </div>

      {/* SEARCH + FILTERS */}
      <div className="flex flex-col md:flex-row gap-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search assets..."
          className="px-4 py-2 border rounded-lg w-full md:w-1/3"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-4 py-2 border rounded-lg w-full md:w-1/4"
        >
          <option value="ALL">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="REPAIR">Repair</option>
          <option value="AVAILABLE">Available</option>
        </select>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredAssets.map((asset) => (
          <div
            key={asset.id}
            className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition overflow-hidden cursor-pointer"
          >
            <img
              src={asset.image}
              className="h-48 w-full object-cover"
            />

            <div className="p-4 space-y-2">
              <h2 className="font-bold text-lg">{asset.name}</h2>

              <p className="text-sm text-slate-500">
                SN: {asset.serial}
              </p>

              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  asset.status === "ACTIVE"
                    ? "bg-blue-100 text-blue-700"
                    : asset.status === "REPAIR"
                    ? "bg-orange-100 text-orange-700"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                {asset.status}
              </span>

              <div className="text-sm text-slate-600 pt-2">
                {asset.processor && <div>{asset.processor}</div>}
                {asset.ram && <div>{asset.ram}</div>}
                {asset.owner && <div>{asset.owner}</div>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAssets.length === 0 && (
        <div className="text-center text-slate-500 mt-10">
          No assets found
        </div>
      )}
    </div>
  );
};

export default AssetListPage;