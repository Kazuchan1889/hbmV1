import React, { useState } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import ip from "../ip";

const AddFile = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [message, setMessage] = useState('');

  // Tambahkan konstanta atau gunakan state untuk IP server
 // Ganti dengan alamat server Anda

  const handleFileUpload = async (acceptedFiles) => {
    const maxSizeInBytes = 5000000; // 5 MB
    const oversizedFiles = acceptedFiles.filter((file) => file.size > maxSizeInBytes);

    if (oversizedFiles.length > 0) {
      await Swal.fire({
        icon: 'error',
        title: 'File Too Big',
        text: 'File size exceeds the limit of 5 MB',
      });
      return;
    }

    setUploadedFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/png': ['.png'],
      'image/jpg': ['.jpg'],
      'image/jpeg': ['.jpeg'],
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    onDrop: (acceptedFiles) => {
      const allowedExtensions = ['pdf', 'docx', 'png', 'jpg', 'jpeg'];
      const filteredFiles = acceptedFiles.filter((file) => {
        const fileExtension = file.name.split('.').pop().toLowerCase();
        return allowedExtensions.includes(fileExtension);
      });

      if (filteredFiles.length === 1) {
        handleFileUpload(filteredFiles);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Invalid File',
          text: 'Please upload a single file with pdf, docx, png, jpg, or jpeg extension.',
        });
      }
    },
    multiple: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!uploadedFile) {
      setMessage('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', uploadedFile);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: localStorage.getItem('accessToken'),
      },
    };

    try {
      const accessToken = localStorage.getItem('accessToken');
      const id = getIdFromToken(accessToken); // Extract ID from accessToken
       await axios.post(
        `${ip}/api/CompanyFile/upload/${id}`,
        formData,
        config
      );
    
      setMessage('File uploaded successfully');
    } catch (error) {
      setMessage(error.response ? error.response.data.error : 'Error uploading file');
    }
  };

  // Function to extract ID from accessToken (dummy implementation, replace with actual logic)
  const getIdFromToken = (token) => {
    // Assuming the token is a JWT and the ID is stored in the payload
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.id;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-700">Upload File</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div {...getRootProps()} className="border-dashed border-2 border-gray-300 p-4 rounded cursor-pointer text-center">
            <input {...getInputProps()} />
            <p>Drag & drop your file here, or click to select one</p>
            <p className="text-xs text-gray-500">Accepted file types: .png, .jpg, .jpeg, .pdf, .docx</p>
          </div>
          {uploadedFile && <p className="text-center text-gray-700">{uploadedFile.name}</p>}
          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Upload
          </button>
        </form>
        {message && <p className="mt-4 text-center text-red-500">{message}</p>}
      </div>
    </div>
  );
};

export default AddFile;
