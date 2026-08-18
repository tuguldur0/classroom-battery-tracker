"use client"
import toast, {Toaster} from 'react-hot-toast'
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase/client";

export default function Home() {
  const [name, setName] = useState('');
  const [keyboard, setKeyboard] = useState('')
  const [mouse, setMouse] = useState('')
  const [students, setStudents] = useState([])
  const date = new Date().toLocaleDateString('en-CA');
  const count = students.filter(student => student.created_at.includes(date)).length

  useEffect(() => {
    getDatabase()
  }, [])

  const send =  async () => {
    if(name.trim().length > 4 && (/[A-Z]/.test(name) || /[a-z]/.test(name))){
      const {data, error} = await supabase.from('battery-tracker').insert({name: name, keyboard_battery: keyboard, mouse_battery: mouse})
      toast.success("Sent!")
      setName("")
      setKeyboard("")
      setMouse("")
      getDatabase()
    } else {
      toast.error("Requirements not met")
    }
    }
  const getDatabase = async () => {
    const {data, error} = await supabase.from('battery-tracker').select('*')
    setStudents(data);
  }
  const sortKeyboard = async () => {
    const {data, error} = await supabase.from('battery-tracker').select('*').order('keyboard_battery', {ascending: true})
    setStudents(data);
  }
  const sortMouse = async () => {
    const {data, error} = await supabase.from('battery-tracker').select('*').order('mouse_battery', {ascending: true})
    setStudents(data);
  }


  return (
    <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center text-[#ffffff]">
      <div className="w-full max-w-4xl bg-[#121212] rounded-md overflow-hidden shadow-2xl border-2 border-[#262626] flex flex-row">
        <div className=" w-[40%] p-5 text-base flex flex-col gap-4">
            {/* title or smth */}
            <div> 
              <p className="text-2xl ">Battery tracker</p>
            </div>
            {/* inputs */}
            <div className="flex flex-col gap-3">
              <input value={name} onChange={(event) => {setName(event.target.value)}} className="w-[90%] h-fit border-2 border-[#262626] rounded-md p-1" placeholder="Your name"></input>
              <input min="0" max="100" value={keyboard} onChange={(event) => {setKeyboard(event.target.value)}} className="w-[90%] h-fit border-2 border-[#262626] rounded-md p-1" type="number" placeholder="Keyboard percentage"></input>
              <input min="0" max="100" value={mouse} onChange={(event) => {setMouse(event.target.value)}} className="w-[90%] h-fit border-2 border-[#262626] rounded-md p-1" type="number" placeholder="Mouse percentage"></input>
              <button onClick={send} className="w-[40%] flex items-center justify-center py-2 font-bold bg-[#4a4a4a] rounded-sm hover:bg-[#FFFFFF] hover:text-[#121212] transition-all duration-300">Send</button>
            </div>

        </div>
        <div className=" w-[60%] p-5 text-base flex flex-col gap-3">
          <p className="text-2xl">Students</p>
          <div className='flex flex-row gap-4'>
            <p>Sort by:</p>
            <button onClick={getDatabase} className='flex items-center justify-center px-2 py-1 font-bold bg-[#4a4a4a] rounded-sm hover:bg-[#FFFFFF] hover:text-[#121212] transition-all duration-300'>All ({count})</button>
            <button onClick={sortKeyboard} className='flex items-center justify-center px-2 py-1 font-bold bg-[#4a4a4a] rounded-sm hover:bg-[#FFFFFF] hover:text-[#121212] transition-all duration-300'>Keyboard battery</button>
            <button onClick={sortMouse} className='flex items-center justify-center px-2 py-1 font-bold bg-[#4a4a4a] rounded-sm hover:bg-[#FFFFFF] hover:text-[#121212] transition-all duration-300'>Mouse battery</button>
          </div>
          <div className='flex flex-row justify-between'>
            <span>Student:</span>
            <span>Keyboard:</span>
            <span>Mouse:</span>
          </div>
            {students.map((student) => {
              if(student.created_at.includes(date)){
                return (
                  <div className="flex flex-row justify-between" key={student.id}>
                    <span>{student.name}</span>
                    <span className={` ${student.keyboard_battery < 10 ? "text-red-500" : (student.keyboard_battery > 10 && student.keyboard_battery < 20) ? "text-yellow-300" : "text-green-400"}`}>{student.keyboard_battery}</span>
                    <span className={` ${student.keyboard_battery < 10 ? "text-red-500" : (student.mouse_battery > 10 && student.mouse_battery < 20) ? "text-yellow-300" : "text-green-400"}`}>{student.mouse_battery}</span>
                  </div>
                )

              }
            })}


        </div>
      </div>
      <Toaster />
    </div>
  )

}