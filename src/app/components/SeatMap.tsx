"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import PassengerForm from "./PassengerForm";

interface Seat {
  id: number;
  isOccupied: boolean;
  occupantName?: string;
}

interface User {
  id: number;
  name: string;
}

const SeatMap: React.FC = () => {
  const [seats, setSeats] = useState<Seat[]>(
    Array.from({ length: 38 }, (_, i) => ({
      id: i + 1,
      isOccupied: i < 10,
    }))
  );

  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [showPassengerForm, setShowPassengerForm] = useState<number | null>(
    null
  );
  const [inactivityTimer, setInactivityTimer] = useState<NodeJS.Timeout | null>(
    null
  );
  const [occupantNames, setOccupantNames] = useState<Record<number, string>>(
    {}
  );

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((users: User[]) => {
        const names = users.slice(0, 10).reduce(
          (acc, user, index) => {
            acc[index + 1] = user.name;
            return acc;
          },
          {} as Record<number, string>
        );
        setOccupantNames(names);
      });

    const savedSeats = localStorage.getItem("selectedSeats");
    if (savedSeats) {
      setSelectedSeats(JSON.parse(savedSeats));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedSeats", JSON.stringify(selectedSeats));

    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
    }

    if (selectedSeats.length > 0) {
      const timer = setTimeout(() => {
        if (window.confirm("İşleme devam etmek istiyor musunuz?")) {
          // Continue
        } else {
          window.location.reload();
        }
      }, 30000);
      setInactivityTimer(timer);
    }

    return () => {
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }
    };
  }, [selectedSeats]);

  const handleSeatClick = (id: number) => {
    const seat = seats.find((s) => s.id === id);
    if (seat?.isOccupied) {
      alert("Bu koltuk dolu.");
      return;
    }
    if (selectedSeats.includes(id)) {
      setSelectedSeats(selectedSeats.filter((seatId) => seatId !== id));
    } else {
      if (selectedSeats.length >= 3) {
        alert("En fazla 3 koltuk seçebilirsiniz.");
        return;
      }
      setSelectedSeats([...selectedSeats, id]);
    }
  };

  return (
    <div className="container mx-auto p-8 flex justify-between gap-12">
      <div className="flex-1 flex flex-col items-center">
        <div className="relative w-[600px]">
          <Image
            src="/airplane.svg"
            alt="Airplane"
            width={450}
            height={400}
            className="mx-auto"
          />
          <svg viewBox="0 0 500 400" className="absolute top-0 left-0">
            {seats.map((seat, index) => {
              const row = Math.floor(index / 4);
              const col = index % 4;
              const x = col < 2 ? 180 + col * 20 : 380 + (col - 2) * 20;
              const y = 200 + row * 25;

              return (
                <g key={seat.id}>
                  <rect
                    x={x}
                    y={y}
                    width={8}
                    height={12}
                    fill={
                      seat.isOccupied
                        ? "#e5e5e5"
                        : selectedSeats.includes(seat.id)
                        ? "#ffc95b"
                        : "#ffffff"
                    }
                    stroke="#d1d1d1"
                    strokeWidth={1}
                    onClick={() => handleSeatClick(seat.id)}
                    cursor={seat.isOccupied ? "not-allowed" : "pointer"}
                  />
                  {seat.isOccupied && (
                    <title>{occupantNames[seat.id] || "Dolu"}</title>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
        <div className="flex gap-6 mt-8">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#e5e5e5] border border-[#d1d1d1]" />
            <span className="text-sm">Dolu</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white border border-[#d1d1d1]" />
            <span className="text-sm">Boş</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#ffc95b] border border-[#d1d1d1]" />
            <span className="text-sm">Seçili</span>
          </div>
        </div>
      </div>

      <div className="w-[320px] space-y-4">
        {[1, 2, 3].map((num) => (
          <div key={num} className="space-y-2">
            <div
              onClick={() => setShowPassengerForm(num)}
              className="flex items-center justify-between px-4 py-3 bg-[#c6c6c6] cursor-pointer rounded"
            >
              <span className="text-black font-medium">{num}. Yolcu</span>
              <ArrowRight className="text-white" size={20} />
            </div>
            {showPassengerForm === num && (
              <PassengerForm
                passengerNumber={num}
                onClose={() => setShowPassengerForm(null)}
              />
            )}
          </div>
        ))}

        <button className="w-full py-3 bg-[#c6c6c6] rounded font-medium mt-8">
          İşlemleri Tamamla
        </button>

        <div className="mt-4">
          <p className="text-sm text-gray-600">
            Seçilen Koltuklar: {selectedSeats.join(", ")}
          </p>
          <p className="text-lg font-medium mt-2">
            Toplam Tutar: {selectedSeats.length * 1000} TL
          </p>
        </div>
      </div>
    </div>
  );
};

export default SeatMap;
