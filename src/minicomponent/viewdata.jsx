import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import ip from "../ip";

function ViewData() {
  const [cutiMandiri, setCutiMandiri] = useState(null);
  const [sisaJatah, setsisaJatah] = useState(null);

  useEffect(() => {
    fetchTableData();
    fetchSisaJatah();
  }, []); // useEffect akan dijalankan sekali saat komponen dimuat

  const fetchTableData = () => {
    const apiUrl = `${ip}/api/pengajuan/get/cuti/self`; // Ganti ip dengan process.env.REACT_APP_API_URL
    const headers = {
      Authorization: localStorage.getItem("accessToken"),
    };
    axios
      .get(apiUrl, { headers })
      .then((response) => {
        const data = response.data;
        const sisaCuti = localStorage.getItem("cutimandiri");
        setCutiMandiri(sisaCuti);
      })
      .catch((error) => {
        console.error(error);
      }); 
  };
 

const fetchSisaJatah = () => {
  const apiUrl = `${ip}/api/pengajuan/get/sisa`; // Assuming REACT_APP_API_URL is set correctly in your environment
  const accessToken = localStorage.getItem("accessToken");
  const headers = {
    Authorization: accessToken,
  };

  axios
  .get(apiUrl, { headers })
  .then((response) => {
    const sisaJatah = response.data.sisa; // Mengakses data "sisa" dari respons
    setsisaJatah(sisaJatah);
  })
  .catch((error) => {
    console.error(error);
  });
};


  return (
    <div className="flex flex-col items-start w-full">
      <div className="flex flex-col items-start text-left">
        <div className="text-xl">
          Cuti Tahunan Balance
        </div>
        <div className="text-2xl font-semibold ">
          {cutiMandiri !== null ? `${cutiMandiri} Days` : 'Loading...'}
        </div>
        <a className="flex flex-row mt-2 font-semibold border-b-2 border-indigo-500" href="/cuti">
          Form Cuti
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            height="1.5em"
            width="1em"
          >
            <path d="M18.59 13H3a1 1 0 010-2h15.59l-5.3-5.3a1 1 0 111.42-1.4l7 7a1 1 0 010 1.4l-7 7a1 1 0 01-1.42-1.4l5.3-5.3z" />
          </svg>
        </a>
      </div>
      <div className="flex flex-col items-start text-left mt-3">
        <div className="text-xl">
          Jumlah Izin Digunakan 
        </div>
        <div className="text-2xl font-semibold ">
        {sisaJatah !== null ? (
        <pre>{JSON.stringify(sisaJatah, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )} Days
        </div>
        <a className="flex flex-row mt-2 font-semibold border-b-2 border-indigo-500 " href="/izin">
          Form izin
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            height="1.5em"
            width="1em"
          >
            <path d="M18.59 13H3a1 1 0 010-2h15.59l-5.3-5.3a1 1 0 111.42-1.4l7 7a1 1 0 010 1.4l-7 7a1 1 0 01-1.42-1.4l5.3-5.3z" />
          </svg>
        </a>
      </div>
      <div className="flex flex-col items-start text-left mt-3">
        <div className="text-xl">
          Who's Off 
        </div>
        <div className="text-2xl font-semibold ">
          0 
        </div>
        <a className="flex flex-row mb-5 font-semibold border-b-2 border-indigo-500 " href="">
          Lihat
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            height="1.5em"
            width="1em"
          >
            <path d="M18.59 13H3a1 1 0 010-2h15.59l-5.3-5.3a1 1 0 111.42-1.4l7 7a1 1 0 010 1.4l-7 7a1 1 0 01-1.42-1.4l5.3-5.3z" />
          </svg>
        </a>
      </div>
    </div>
  );
}

export default ViewData;
