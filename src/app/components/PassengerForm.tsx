"use client";

import React, { useState } from "react";

interface PassengerFormProps {
  passengerNumber: number;
  selectedSeat: number;
}

interface PassengerData {
  name: string;
  surname: string;
  phone: string;
  email: string;
  gender: string;
  birthDate: string;
  seatNumber?: number;
}

const PassengerForm: React.FC<PassengerFormProps> = ({
  passengerNumber,
  selectedSeat,
}) => {
  const [formData, setFormData] = useState<PassengerData>(() => {
    const savedData = localStorage.getItem(`passenger_${passengerNumber}`);
    return savedData
      ? JSON.parse(savedData)
      : {
          name: "",
          surname: "",
          phone: "",
          email: "",
          gender: "",
          birthDate: "",
          seatNumber: selectedSeat,
        };
  });

  const handleChange = (field: keyof PassengerData, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    localStorage.setItem(
      `passenger_${passengerNumber}`,
      JSON.stringify(newData)
    );
  };

  return (
    <form className="mt-2">
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <label className="block text-gray-600 mb-1">İsim</label>
          <input
            className="w-full p-1.5 border rounded text-black"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-gray-600 mb-1">Soyisim</label>
          <input
            className="w-full p-1.5 border rounded text-black"
            value={formData.surname}
            onChange={(e) => handleChange("surname", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-gray-600 mb-1">Telefon</label>
          <input
            className="w-full p-1.5 border rounded text-black"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-gray-600 mb-1">E-posta</label>
          <input
            className="w-full p-1.5 border rounded text-black"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-gray-600 mb-1">Cinsiyet</label>
          <select
            className="w-full p-1.5 border rounded text-black"
            value={formData.gender}
            onChange={(e) => handleChange("gender", e.target.value)}
          >
            <option value="">Seçiniz</option>
            <option value="male">Erkek</option>
            <option value="female">Kadın</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-600 mb-1">Doğum Tarihi</label>
          <input
            type="date"
            className="w-full p-1.5 border rounded text-black"
            value={formData.birthDate}
            onChange={(e) => handleChange("birthDate", e.target.value)}
          />
        </div>
      </div>
    </form>
  );
};

export default PassengerForm;
