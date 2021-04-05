import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import Fuse from "fuse.js";

import { STATIONS } from "../util/stations";

import "./Home.css";
import { getPrice } from "../util/transportContract";

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

const fuse = new Fuse(STATIONS, options);

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [station, setStation] = useState({});
  const [loading, setLoading] = useState(false);
  const [map, setMap] = useState(null);

  const updateStation = (result) => {
    setResults([]);
    setStation(result);
    map.flyTo([result.Y, result.X], 12);
    setQuery(null);
  };

  const getPriceForStation = async () => {
    // const { X, Y } = station;
    // if (!X || !Y) {
    //   alert("Please reselect a station");
    //   return;
    // }
    // const end = new Date();
    // const start = end;
    // setLoading(true);
    // try {
    //   await getPrice(X, Y, start, end);
    // } catch (e) {
    //   console.error("error getting price", e);
    // }
    // setLoading(false);
  };

  useEffect(() => {
    if (query) {
      setResults(fuse.search(query));
    } else {
    }
  }, [query]);

  const position = [station.Y || 51.505, station.X || -0.09];

  let inputValue = "";
  if (query !== null || query) {
    inputValue = query;
  } else if (station) {
    inputValue = `${station.ADDRESS1} ${station.STNNAME}`;
  }

  console.log("position", position, inputValue);

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
                onClick={() => updateStation(item)}
                className="result-box"
              >
                {i + 1}: {item.ADDRESS1} {item.STNNAME} {item.STATE}
              </div>
            );
          })}
          {station.X && (
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
              <div>Purchase Ticket</div>

              <button
                className="btn is-primary"
                onClick={getPriceForStation}
                disabled={loading}
              >
                Request
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
            <Marker position={position}>
              <Popup>
                <b>STATION:</b>
                <br />
                {JSON.stringify(position)}
                <br />
                {station.STNNAME}
                <br />
                {station.ADDRESS1}
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
