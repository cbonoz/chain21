import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import Fuse from "fuse.js";

import { STATIONS } from "../util/stations";

import "./Home.css";
import {
  purchaseContract,
  requestPrice,
  getLastPrice,
} from "../util/transportContract";

const options = {
  // isCaseSensitive: false,
  // includeScore: false,
  shouldSort: true,
  // includeMatches: false,
  findAllMatches: false,
  minMatchCharLength: 1,
  // location: 0,
  // threshold: 0.6,
  // distance: 100,
  // useExtendedSearch: false,
  // ignoreLocation: false,
  // ignoreFieldNorm: false,
  keys: ["STNNAME"],
};

const lineOptions = { color: "green" };

const getLatLng = (station) => [station.Y, station.X];
const getStationName = (item) =>
  `${item.ADDRESS1} ${item.STNNAME} ${item.STATE}`;

const fuse = new Fuse(STATIONS, options);

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activePrice, setActivePrice] = useState(undefined);
  const [stations, setStations] = useState([]);
  const [requesting, setRequesting] = useState(false);
  const [error, setError] = useState("");
  const [map, setMap] = useState(null);

  const getPrice = async () => {
    try {
      const data = await getLastPrice();
      console.log("get price", data);
      const price = parseFloat(data);
      if (price > 0) {
        setActivePrice(price / 1000); // Price sent in milliEth.
      } else {
        alert("Price updating...");
      }
    } catch (e) {
      console.error("error getting price", e);
    }
  };

  const addStation = (result) => {
    setResults([]);
    const newStations = [...stations, result];
    setStations(newStations);
    map.flyTo(getLatLng(result), 12);
    if (newStations.length > 1) {
      map.fitBounds(newStations.map(getLatLng));
    }
    setQuery(null);
  };

  const completePurchase = async () => {
    setLoading(true);
    try {
      await purchaseContract(activePrice);
    } catch (e) {
      console.error("error getting price", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (requesting) {
      setRequesting(false);
    }
  }, [stations]);

  const clearStations = () => {
    setActivePrice(undefined);
    setStations([]);
    setQuery("");
  };

  const getPriceForRoute = async () => {
    if (stations.length <= 1) {
      alert("Please select at least 2 stations");
      return;
    }

    const positionList = stations.map(getLatLng).flat();
    console.log("getPriceForRoute", positionList);

    setLoading(true);
    setRequesting(true);
    try {
      await requestPrice(positionList);
    } catch (e) {
      console.error("error getting price", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (query) {
      setResults(fuse.search(query));
    } else {
    }
  }, [query]);

  const station = (stations && stations[stations.length - 1]) || {};

  let inputValue = "";
  if (query !== null || query) {
    inputValue = query;
  } else if (station) {
    inputValue = `${station.ADDRESS1} ${station.STNNAME}`;
  }

  const position = [station.Y || 42.36, station.X || -71.059];

  return (
    <div>
      <div className="columns">
        <div className="column is-one-quarter p-4">
          Search for a station:
          <input
            onChange={(e) => setQuery(e.target.value)}
            value={inputValue}
            className="input is-primary"
          />
          <br />
          {results.slice(0, 5).map((result, i) => {
            const { item } = result;
            return (
              <div
                key={i}
                onClick={() => addStation(item)}
                className="result-box"
              >
                {i + 1}: {getStationName(item)}
              </div>
            );
          })}
          {stations.length > 0 && (
            <div>
              <div>
                <div>
                  <br />
                  <b>Selected Station:</b>
                  <br />
                  {station.X} {station.Y}
                  <p>{station.STNNAME}</p>
                  <p>{station.ADDRESS1}</p>
                </div>
                <hr />
                {stations.length > 1 && (
                  <div>
                    <p>
                      <b>Route:</b>
                    </p>
                    {stations.map((s, i) => {
                      return (
                        <p key={i}>
                          {i + 1}. {getStationName(s)}
                          <br />
                        </p>
                      );
                    })}
                  </div>
                )}
                <hr />
                <div>
                  <b>Purchase Ticket</b>
                </div>
                <button
                  className="btn is-primary"
                  onClick={getPriceForRoute}
                  disabled={loading}
                >
                  Request Price
                </button>
                &nbsp;
                <button
                  className="btn is-primary"
                  onClick={clearStations}
                  disabled={loading}
                >
                  Clear Route
                </button>
              </div>
            </div>
          )}
          {requesting && (
            <button
              className="btn is-primary"
              onClick={getPrice}
              disabled={loading}
            >
              Check price update
            </button>
          )}
          {loading && <p>Transaction in progress...</p>}
          {activePrice && (
            <div>
              <b>Price: {activePrice} eth</b>

              <button
                className="btn is-primary"
                onClick={completePurchase}
                disabled={loading}
              >
                Purchase fare for ${activePrice}
              </button>
            </div>
          )}
        </div>
        <div className="column is-three-quarters p-4">
          <MapContainer
            className="leaflet-container"
            center={position}
            zoom={13}
            scrollWheelZoom={false}
            whenCreated={setMap}
          >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {stations.map((s, i) => (
              <Marker position={getLatLng(s)} key={i}>
                <Popup>
                  <b>STATION (stop {i + 1})</b>
                  <br />
                  {JSON.stringify(getLatLng(s))}
                  <br />
                  {s.STNNAME}
                  <br />
                  {s.ADDRESS1}
                </Popup>
              </Marker>
            ))}
            {stations.map((s, i) => (
              <Polyline
                pathOptions={lineOptions}
                positions={stations.map(getLatLng)}
                key={i}
              />
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
