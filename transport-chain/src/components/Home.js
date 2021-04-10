import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import Fuse from "fuse.js";

import { STATIONS } from "../util/stations";

import "./Home.css";

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

const lineOptions = { color: 'green' }

const getLatLng = (station) => [station.Y, station.X]
const getStationName = (item) => `${item.ADDRESS1} ${item.STNNAME} ${item.STATE}`


const fuse = new Fuse(STATIONS, options);

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stations, setStations] = useState([])
  const [map, setMap] = useState(null);

  const addStation = (result) => {
    setResults([]);
    const newStations = [...stations, result]
    setStations(newStations)
    map.flyTo(getLatLng(result), 12);
    if (newStations.length > 1) {
      map.fitBounds(newStations.map(getLatLng))
    }
    setQuery(null);
  };

  const clearStations = () => {
    setStations([])
    setQuery("")
  }

  const getPriceForRoute = async () => {
    if (!stations.length) {
      
    }
    const positionList = stations.map()

    const { X, Y } = station;
    if (!X || !Y) {
      alert("Please reselect a station");
      return;
    }
    const end = new Date();
    const start = end;
    setLoading(true);
    try {
      await getPrice(X, Y, start, end);
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

  const station = stations && stations[stations.length - 1] || {}

  let inputValue = "";
  if (query !== null || query) {
    inputValue = query;
  } else if (station) {
    inputValue = `${station.ADDRESS1} ${station.STNNAME}`;
  }

  const position = [station.Y || 51.505, station.X || -0.09];

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
                onClick={() => addStation(item)}
                className="result-box"
              >
                {i + 1}: {getStationName(item)}
              </div>
            );
          })}
          {stations.length >0 &&<div>
         
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
              {stations.length > 1 && <div><p><b>Route:</b></p>
          {stations.map((s, i) => {
            return <p>{i+1}. {getStationName(s)}<br/></p>
          })}
          </div>}
          <hr/>
              <div>Purchase Ticket</div>

              <button
                className="btn is-primary"
                onClick={getPriceForRoute}
                disabled={loading}
              >
                Request
              </button>

              <button
                className="btn is-primary"
                onClick={clearStations}
                disabled={loading}
              >
                Clear route
              </button>
            </div>
            </div>
          }

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
            {stations.map((s, i) => (<Marker position={getLatLng(s)} key={i}>
              <Popup>
                <b>STATION (stop {i+1})</b>
                <br />
                {JSON.stringify(getLatLng(s))}
                <br />
                {s.STNNAME}
                <br />
                {s.ADDRESS1}
              </Popup>
            </Marker>))}
            {stations.map((s, i) => (<Polyline pathOptions={lineOptions} positions={stations.map(getLatLng)} key={i}/>))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
