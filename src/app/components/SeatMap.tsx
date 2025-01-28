"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowDown } from "lucide-react";
import PassengerForm from "./PassengerForm";
import { useNotification } from "./NotificationContext";

interface Seat {
  id: number;
  isOccupied: boolean;
  occupantName?: string;
}

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

const SeatMap: React.FC = () => {
  const { showNotification } = useNotification();
  const [seats] = useState<Seat[]>(
    Array.from({ length: 84 }, (_, i) => ({
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

  const [hoveredSeat, setHoveredSeat] = useState<number | null>(null);

  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setTooltipPosition({ x: e.clientX, y: e.clientY });
  };

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
      showNotification("Bu koltuk dolu.", "error");
      return;
    }
    if (selectedSeats.includes(id)) {
      setSelectedSeats(selectedSeats.filter((seatId) => seatId !== id));
    } else {
      if (selectedSeats.length >= 3) {
        showNotification("En fazla 3 koltuk seçebilirsiniz.", "warning");
        return;
      }
      setSelectedSeats([...selectedSeats, id]);
    }
  };

  const handleCompleteBooking = () => {
    if (selectedSeats.length === 0) {
      showNotification("Lütfen en az bir koltuk seçiniz.", "warning");
      return;
    }

    // Seçili koltuk sayısı kadar form doldurulmuş mu kontrol et
    const filledForms = Object.keys(occupantNames).length;
    if (filledForms < selectedSeats.length) {
      showNotification("Lütfen tüm yolcu bilgilerini doldurunuz.", "warning");
      return;
    }

    showNotification(
      "Rezervasyon işleminiz başarıyla tamamlanmıştır.",
      "success"
    );
  };

  return (
    <div className="container mx-auto p-8 flex justify-between gap-12">
      <div className="flex-1 flex flex-col items-center">
        <div className="relative w-[400px]">
          <Image
            src="/airplane.svg"
            alt="Airplane"
            width={400}
            height={600}
            className="mx-auto"
          />
          <svg viewBox="0 0 400 600" className="absolute top-0 left-0">
            {seats.map((seat, index) => {
              const row = Math.floor(index / 4);
              const col = index % 4;

              let x = 168;

              if (col < 2) {
                x += col * 9;
              } else {
                x += 25 + (col - 2) * 9;
              }

              const y = 60 + row * 12 + (row >= 4 ? 12 : 0);

              return (
                <g key={seat.id}>
                  <rect
                    x={x}
                    y={y}
                    width={7}
                    height={9}
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
                    rx={1}
                    ry={1}
                    onMouseEnter={() => setHoveredSeat(seat.id)}
                    onMouseLeave={() => setHoveredSeat(null)}
                    onMouseMove={handleMouseMove}
                  />
                </g>
              );
            })}
          </svg>

          {hoveredSeat &&
            seats.find((s) => s.id === hoveredSeat)?.isOccupied && (
              <div
                className="absolute z-50 bg-black text-white px-3 py-2 rounded-lg text-sm pointer-events-none"
                style={{
                  left: tooltipPosition.x + 10,
                  top: tooltipPosition.y + 10,
                  transform: "translate(-50%, -100%)",
                }}
              >
                {occupantNames[hoveredSeat]}
              </div>
            )}
        </div>
        <div className="flex gap-6 mt-8">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#e5e5e5] border border-[#d1d1d1]" />
            <span className="text-sm text-black">Dolu</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white border border-[#d1d1d1]" />
            <span className="text-sm text-black">Boş</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#ffc95b] border border-[#d1d1d1]" />
            <span className="text-sm text-black">Seçili</span>
          </div>
        </div>
      </div>

      <div className="w-[320px] space-y-4">
        {selectedSeats.map((seatId, index) => (
          <div key={seatId} className="space-y-2">
            <div
              onClick={() =>
                setShowPassengerForm(
                  showPassengerForm === index + 1 ? null : index + 1
                )
              }
              className="flex items-center justify-between px-4 py-3 bg-[#c6c6c6] cursor-pointer rounded"
            >
              <span className="text-black font-medium">{index + 1}. Yolcu</span>
              <ArrowDown
                className={`text-white transition-transform ${
                  showPassengerForm === index + 1 ? "rotate-180" : ""
                }`}
                size={20}
              />
            </div>
            {showPassengerForm === index + 1 && (
              <PassengerForm
                passengerNumber={index + 1}
                selectedSeat={seatId}
              />
            )}
          </div>
        ))}

        <button
          onClick={handleCompleteBooking}
          className="w-full py-3 bg-[#c6c6c6] rounded text-black font-medium mt-8 hover:bg-[#b6b6b6]"
        >
          İşlemleri Tamamla
        </button>

        <div className="mt-4 p-4 rounded-lg bg-[#c6c6c6]">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex flex-wrap gap-2">
                {selectedSeats.map((seatId) => (
                  <div
                    key={seatId}
                    className="w-8 h-8 flex items-center justify-center text-black bg-[#ffc95b] rounded text-sm font-medium"
                  >
                    {seatId}
                  </div>
                ))}
              </div>
              <span className="text-black font-medium">
                {selectedSeats.length}x
              </span>
            </div>
            <div className="flex justify-end">
              <span className="text-black font-medium">
                {selectedSeats.length * 1000} TL
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatMap;
