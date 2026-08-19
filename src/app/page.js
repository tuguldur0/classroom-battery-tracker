"use client";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase/client";

export default function Home() {
  const [name, setName] = useState("");
  const [keyboard, setKeyboard] = useState("");
  const [mouse, setMouse] = useState("");
  const [students, setStudents] = useState([]);
  const date = new Date().toLocaleDateString("en-CA");
  const count = students.filter((student) =>
    student.created_at.includes(date),
  ).length;

  useEffect(() => {
    getDatabase();
  }, []);

  const send = async () => {
    if (name.trim().length > 4 && (/[A-Z]/.test(name) || /[a-z]/.test(name))) {
      const { data, error } = await supabase.from("battery-tracker").insert({
        name: name,
        keyboard_battery: keyboard,
        mouse_battery: mouse,
      });
      toast.success("Sent!");
      setName("");
      setKeyboard("");
      setMouse("");
      getDatabase();
    } else {
      toast.error("Requirements not met");
    }
  };
  const getDatabase = async () => {
    const { data, error } = await supabase.from("battery-tracker").select("*");
    setStudents(data);
  };
  const sortKeyboard = async () => {
    const { data, error } = await supabase
      .from("battery-tracker")
      .select("*")
      .order("keyboard_battery", { ascending: true });
    setStudents(data);
  };
  const sortMouse = async () => {
    const { data, error } = await supabase
      .from("battery-tracker")
      .select("*")
      .order("mouse_battery", { ascending: true });
    setStudents(data);
  };

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center text-[#ffffff] p-4">
      <div className="w-full max-w-4xl bg-[#121212] rounded-md overflow-hidden shadow-md border-2 border-[#262626] flex flex-col sm:flex-row">
        <div className="w-full sm:w-[40%] p-6 text-base flex flex-col gap-4 border-b-2 sm:border-b-0 sm:border-r-2 border-[#262626]">
          {/* title or smth */}
          <div>
            <p className="text-2xl">Battery tracker</p>
          </div>
          {/* inputs */}
          <div className="flex flex-col gap-3">
            <input
              value={name}
              onChange={(event) => {
                setName(event.target.value);
              }}
              className="w-full h-fit border-2 border-[#262626] bg-[#1a1a1a] text-white rounded-md p-2 placeholder:text-[#666] focus:outline-none focus:border-[#4a4a4a] transition-colors"
              placeholder="Your name"
            ></input>
            <input
              min="0"
              max="100"
              value={keyboard}
              onChange={(event) => {
                setKeyboard(event.target.value);
              }}
              className="w-full h-fit border-2 border-[#262626] bg-[#1a1a1a] text-white rounded-md p-2 placeholder:text-[#666] focus:outline-none focus:border-[#4a4a4a] transition-colors"
              type="number"
              placeholder="Keyboard percentage"
            ></input>
            <input
              min="0"
              max="100"
              value={mouse}
              onChange={(event) => {
                setMouse(event.target.value);
              }}
              className="w-full h-fit border-2 border-[#262626] bg-[#1a1a1a] text-white rounded-md p-2 placeholder:text-[#666] focus:outline-none focus:border-[#4a4a4a] transition-colors"
              type="number"
              placeholder="Mouse percentage"
            ></input>
            <button
              onClick={send}
              className="w-fit flex items-center justify-center px-6 py-2 font-bold bg-[#4a4a4a] rounded-md hover:bg-[#FFFFFF] hover:text-[#121212] transition-all duration-300"
            >
              Send
            </button>
          </div>
        </div>
        <div className="w-full sm:w-[60%] p-6 text-base flex flex-col gap-4">
          <p className="text-2xl">Students</p>
          <div className="flex flex-row flex-wrap items-center gap-3">
            <p className="text-gray-400">Sort by:</p>
            <button
              onClick={getDatabase}
              className="flex items-center justify-center px-3 py-1.5 font-bold bg-[#4a4a4a] rounded-md hover:bg-[#FFFFFF] hover:text-[#121212] transition-all duration-300"
            >
              All ({count})
            </button>
            <button
              onClick={sortKeyboard}
              className="flex items-center justify-center px-3 py-1.5 font-bold bg-[#4a4a4a] rounded-md hover:bg-[#FFFFFF] hover:text-[#121212] transition-all duration-300"
            >
              Keyboard battery
            </button>
            <button
              onClick={sortMouse}
              className="flex items-center justify-center px-3 py-1.5 font-bold bg-[#4a4a4a] rounded-md hover:bg-[#FFFFFF] hover:text-[#121212] transition-all duration-300"
            >
              Mouse battery
            </button>
          </div>
          <div className="flex flex-row justify-between border-b-2 border-[#262626] pb-2 text-gray-400">
            <span className="w-1/3">Student:</span>
            <span className="w-1/3 text-center">Keyboard:</span>
            <span className="w-1/3 text-right">Mouse:</span>
          </div>
          {students.map((student) => {
            if (student.created_at.includes(date)) {
              return (
                <div className="flex flex-row justify-between" key={student.id}>
                  <span className="w-1/3">{student.name}</span>
                  <span
                    className={`w-1/3 text-center ${student.keyboard_battery <= 10 ? "text-red-500" : student.keyboard_battery > 10 && student.keyboard_battery <= 20 ? "text-yellow-300" : "text-green-400"}`}
                  >
                    {student.keyboard_battery}
                  </span>
                  <span
                    className={`w-1/3 text-right ${student.mouse_battery <= 10 ? "text-red-500" : student.mouse_battery > 10 && student.mouse_battery <= 20 ? "text-yellow-300" : "text-green-400"}`}
                  >
                    {student.mouse_battery}
                  </span>
                </div>
              );
            }
          })}
        </div>
      </div>
      <Toaster />
    </div>
  );
}
