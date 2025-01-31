import React, { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import Modal from "react-modal";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import NavbarUser from "../feature/NavbarUser";
import ip from "../ip";

Modal.setAppElement("#root");

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    padding: '0',
    borderRadius: '12px',
    border: 'none',
    width: '500px',
    height: '700px',
  },
};

const apiURL = `${ip}/api/schedjul`;

const CalendarComponent = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    judul: "",
    deskripsi: "",
    mulai: "",
    selesai: "",
    karyawan: [],
  });
  const [selectedKaryawan, setSelectedKaryawan] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    fetchEventsByKaryawanId();
    fetchEmployees();
  }, []);

  const fetchEventsByKaryawanId = async () => {
    try {
      const response = await axios.get(`${apiURL}/scheduler/assigned/karyawan/${39}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("accessToken"),
        },
      });
      setEvents(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${ip}/api/karyawan/nama&id`, {
        headers: {
          Authorization: localStorage.getItem("accessToken"),
        },
      });
      setEmployees(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedKaryawan([]);
    } else {
      setSelectedKaryawan(employees.map((employee) => ({ value: employee.id, label: employee.nama })));
    }
    setSelectAll(!selectAll);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        tgl_mulai: selectedDate.toLocaleDateString('en-CA'),
        tgl_selesai: selectedDate.toLocaleDateString('en-CA'),
        karyawan: selectedKaryawan.map((k) => k.value),
      };
      await axios.post(`${apiURL}/scheduler/post`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("accessToken"),
        },
      });
      fetchEventsByKaryawanId();
      setFormData({
        id: null,
        judul: "",
        deskripsi: "",
        mulai: "",
        selesai: "",
        karyawan: [],
      });
      setSelectedKaryawan([]);
      setSelectAll(false);
      setModalIsOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiURL}/scheduler/delete/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("accessToken"),
        },
      });
      fetchEventsByKaryawanId();  // Refresh the list after deletion
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (schedule) => {
    const selectedKaryawanOptions = schedule.karyawan ? schedule.karyawan.map((k) => ({ value: k.id, label: k.nama })) : [];
    setFormData({
      id: schedule.schedule_id,
      judul: schedule.judul,
      deskripsi: schedule.deskripsi,
      mulai: schedule.mulai,
      selesai: schedule.selesai,
      karyawan: selectedKaryawanOptions,
    });
    setSelectedDate(new Date(schedule.tanggal_mulai));
    setSelectedKaryawan(selectedKaryawanOptions);
    setSelectAll(selectedKaryawanOptions.length === employees.length);
    setModalIsOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        tanggal_mulai: selectedDate.toLocaleDateString('en-CA'),
        tanggal_selesai: selectedDate.toLocaleDateString('en-CA'),
        karyawan: selectedKaryawan.map((k) => k.value),
      };
      await axios.patch(`${apiURL}/scheduler/patch/${formData.id}`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("accessToken"),
        },
      });
      fetchEventsByKaryawanId();
      setFormData({
        id: null,
        judul: "",
        deskripsi: "",
        mulai: "",
        selesai: "",
        karyawan: [],
      });
      setSelectedKaryawan([]);
      setSelectAll(false);
      setModalIsOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);  
  };

  const selectedDateSchedules = events.filter(
    (event) => new Date(event.tanggal_mulai).toDateString() === selectedDate.toDateString()
  );

  const isDateHasEvents = (date) => {
    return events.some((event) => new Date(event.tanggal_mulai).toDateString() === date.toDateString());
  };

  return (
    <section>
      <NavbarUser />
      <div className="mx-20 text-left my-2">
        <h1 className="text-3xl font-bold">Calendar</h1>
      </div>
      <div className="max-w-6xl mx-auto flex mt-6 border border-gray-200 rounded-lg shadow-lg">
        <div className="w-2/3 p-4 bg-white">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Schedule</h2>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full shadow"
              onClick={() => {
                setFormData({
                  id: null,
                  judul: "",
                  deskripsi: "",
                  mulai: "",
                  selesai: "",
                  karyawan: [],
                });
                setSelectedKaryawan([]);
                setSelectAll(false);
                setModalIsOpen(true);
              }}
            >
              Add
            </button>
          </div>
          <div className="space-y-4 overflow-y-auto h-96">
            {selectedDateSchedules.map((schedule, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4 pr-4 py-3 bg-gray-50 rounded-lg shadow-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{schedule.judul}</h3>
                    <p className="text-gray-600">{schedule.deskripsi}</p>
                    <p className="text-gray-500">{new Date(schedule.tanggal_mulai).toLocaleDateString()}</p>
                    <p className="text-gray-500">{schedule.mulai} - {schedule.selesai}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => handleEdit(schedule)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleDelete(schedule.schedule_id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-1/3 bg-gray-100 p-4">
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            inline
            highlightDates={events.map((event) => new Date(event.tanggal_mulai))}
            dayClassName={(date) => (isDateHasEvents(date) ? "bg-blue-200 rounded-full" : undefined)}
          />
        </div>
      </div>

      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} style={customStyles}>
        <div className="bg-white p-6 rounded-lg shadow-lg h-full">
          <h2 className="text-xl font-bold mb-4">{formData.id ? "Edit Schedule" : "Add Schedule"}</h2>
          <form onSubmit={formData.id ? handleUpdate : handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={formData.judul}
                onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                className="block w-full border border-gray-300 rounded-lg py-2 px-3"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.deskripsi}
                onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                className="block w-full border border-gray-300 rounded-lg py-2 px-3"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Start Time</label>
                <input
                  type="time"
                  value={formData.mulai}
                  onChange={(e) => setFormData({ ...formData, mulai: e.target.value })}
                  className="block w-full border border-gray-300 rounded-lg py-2 px-3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">End Time</label>
                <input
                  type="time"
                  value={formData.selesai}
                  onChange={(e) => setFormData({ ...formData, selesai: e.target.value })}
                  className="block w-full border border-gray-300 rounded-lg py-2 px-3"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Employees</label>
              <Select
                isMulti
                options={employees.map((employee) => ({ value: employee.id, label: employee.nama }))}
                value={selectedKaryawan}
                onChange={setSelectedKaryawan}
                className="w-full"
              />
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="mr-2"
                />
                <label className="text-sm font-semibold text-gray-700">Select All Employees</label>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full shadow"
              >
                {formData.id ? "Update" : "Save"}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </section>
  );
};

export default CalendarComponent;
