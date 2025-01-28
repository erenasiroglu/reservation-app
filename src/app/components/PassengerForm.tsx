"use client";

import React, { useState } from "react";

interface PassengerFormProps {
  passengerNumber: number;
  onClose: () => void;
}

const PassengerForm: React.FC<PassengerFormProps> = ({
  passengerNumber,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    phone: "",
    email: "",
    gender: "",
    birthDate: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(formData).some((value) => !value)) {
      alert("Lütfen tüm alanları doldurunuz.");
      return;
    }
    onClose();
  };

  return (
    <div className="mt-2">
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <label className="block text-gray-600 mb-1">İsim</label>
          <input
            className="w-full p-1.5 border rounded"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-gray-600 mb-1">Soyisim</label>
          <input
            className="w-full p-1.5 border rounded"
            value={formData.surname}
            onChange={(e) =>
              setFormData({ ...formData, surname: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-gray-600 mb-1">Telefon</label>
          <input
            className="w-full p-1.5 border rounded"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-gray-600 mb-1">E-posta</label>
          <input
            className="w-full p-1.5 border rounded"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-gray-600 mb-1">Cinsiyet</label>
          <select
            className="w-full p-1.5 border rounded"
            value={formData.gender}
            onChange={(e) =>
              setFormData({ ...formData, gender: e.target.value })
            }
          >
            <option value="">Seçiniz</option>
            <option value="male">Erkek</option>
            <option value="female">Kadın</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-600 mb-1">Doğum Tarihi</label>
          <input
            className="w-full p-1.5 border rounded"
            type="date"
            value={formData.birthDate}
            onChange={(e) =>
              setFormData({ ...formData, birthDate: e.target.value })
            }
          />
        </div>
      </div>
    </div>
  );
};

export default PassengerForm;
