"use client";
import React, { useState, Suspense, useEffect } from 'react';
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, Html, useGLTF, ContactShadows } from "@react-three/drei";

// --- 1. قاعدة بيانات الأعطال الشاملة ---
const faultsData = {
  "usb": { 
    title: "USB Controller Failure", 
    location: "Motherboard Southbridge", 
    risk: "Low", 
    explanation: "Detected electrical surges in USB ports. Could be a short circuit in the port or driver corruption.",
    solutions: ["Clean ports with isopropanol", "Reinstall USB Root Hub drivers", "Check for physical bent pins"], 
    fatigue: "15%", performance: "90%" 
  },
  "screen": { 
    title: "Display Ribbon / EDP Cable", 
    location: "LCD Hinge Area", 
    risk: "Medium", 
    explanation: "Intermittent signal loss between GPU and Panel. Often caused by wear and tear in the hinge.",
    solutions: ["Reseat the EDP cable", "Check for backlight fuse on board", "Replace LCD panel if flickering persists"], 
    fatigue: "45%", performance: "60%" 
  },
  "heat": { 
    title: "Thermal Throttling", 
    location: "CPU / GPU Heatsink", 
    risk: "Critical", 
    explanation: "Temperature exceeded 98°C. Thermal paste is likely dried or fans are clogged with dust.",
    solutions: ["Deep clean fans & vents", "Apply high-quality thermal paste", "Undervolt CPU to reduce heat"], 
    fatigue: "92%", performance: "20%" 
  },
  "battery": { 
    title: "Battery Cell Degradation", 
    location: "Battery Pack", 
    risk: "High", 
    explanation: "Battery health is below 40%. Cells are failing to hold a charge, causing sudden shutdowns.",
    solutions: ["Calibrate battery in BIOS", "Check for battery swelling", "Replace with original battery pack"], 
    fatigue: "80%", performance: "50%" 
  },
  "ram": { 
    title: "Memory Module Error", 
    location: "RAM Slots", 
    risk: "Critical", 
    explanation: "System detected Blue Screen (BSOD) related to Memory Management. One of the RAM sticks is faulty.",
    solutions: ["Clean RAM gold contacts", "Test sticks one by one", "Replace faulty DDR4/DDR5 module"], 
    fatigue: "70%", performance: "30%" 
  },
  "disk": { 
    title: "SSD/HDD SMART Failure", 
    location: "SATA / M.2 Slot", 
    risk: "Critical", 
    explanation: "Storage drive is reporting bad sectors. Data loss is imminent. System backup highly recommended.",
    solutions: ["Backup data immediately", "Check M.2 mounting screw", "Replace with New NVMe SSD"], 
    fatigue: "88%", performance: "10%" 
  },
  "wifi": { 
    title: "Network Card Unstable", 
    location: "Mini-PCIe Slot", 
    risk: "Low", 
    explanation: "Wireless card is dropping connection. Could be loose antenna cables or driver conflict.",
    solutions: ["Update Intel/Realtek drivers", "Check internal antenna wires", "Replace Wi-Fi 6 card"], 
    fatigue: "10%", performance: "85%" 
  }
};

// --- 2. موديل اللابتوب الحقيقي ---
function LaptopModel({ highlight }: { highlight: any }) {
  const { scene } = useGLTF("/laptop.glb"); // ملفك اللي في الـ public

  return (
    <group scale={1.8} position={[0, -1, 0]}>
      <primitive object={scene} />
      {highlight && (
        <pointLight position={[0, 1, 0]} intensity={10} color={highlight === 'heat' ? "red" : "blue"} />
      )}
      <ContactShadows opacity={0.4} scale={10} blur={2} far={4.5} />
    </group>
  );
}

// --- 3. الواجهة الرئيسية ---
export default function ComputerDoctor() {
  const [activeFault, setActiveFault] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

const handleSelect = (id: any) => {
        setIsScanning(true);
    setActiveFault(null);
    setTimeout(() => {
      setActiveFault(id);
      setIsScanning(false);
    }, 1500); // محاكاة فحص لمدة ثانية ونص
  };

  const currentData = activeFault ? faultsData[activeFault] : {
    title: "System Standby",
    location: "---",
    risk: "Safe",
    explanation: "Select a component to start deep hardware diagnostic.",
    solutions: ["Connect Power Adapter", "Run Full Scan"],
    fatigue: "0%", performance: "100%"
  };

  return (
    <main className="min-h-screen bg-[#020202] text-white p-6 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b border-zinc-900 pb-4">
        <h1 className="text-xl font-black tracking-tighter text-blue-500">COMPUTER DOCTOR <span className="text-zinc-700">| PRO DIAGNOSTICS</span></h1>
        <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Status: {isScanning ? 'Scanning...' : 'Idle'}</div>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-grow">
        {/* Left: Component List */}
        <div className="col-span-3 space-y-3 bg-[#080808] p-4 rounded-2xl border border-zinc-900 overflow-y-auto max-h-[80vh]">
          <h2 className="text-[10px] font-bold text-zinc-500 uppercase mb-4 tracking-widest">Select Component</h2>
          {Object.keys(faultsData).map((key) => (
            <button 
              key={key}
              onClick={() => handleSelect(key)}
              className={`w-full text-left p-3 rounded-xl text-xs transition-all border ${activeFault === key ? 'bg-blue-600 border-blue-400' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'}`}
            >
              {key.toUpperCase()} Diagnostic
            </button>
          ))}
        </div>

        {/* Center: 3D Visualizer */}
        <div className="col-span-6 relative">
          <div className="h-full bg-[#050505] rounded-3xl border border-zinc-900 relative">
            {isScanning && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-3xl">
                <div className="text-blue-500 font-mono animate-pulse">ANALYZING HARDWARE...</div>
              </div>
            )}
            <Canvas camera={{ position: [0, 2, 5], fov: 45 }}>
              <ambientLight intensity={0.4} />
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
              <Suspense fallback={null}>
                <LaptopModel highlight={activeFault} />
              </Suspense>
              <OrbitControls autoRotate={!activeFault} enableZoom={true} />
            </Canvas>
          </div>
        </div>

        {/* Right: Diagnosis Details */}
        <div className="col-span-3 space-y-4">
          <div className="bg-[#080808] border border-zinc-900 p-5 rounded-2xl">
            <h2 className="text-blue-500 text-[10px] font-bold uppercase mb-4 tracking-widest">Diagnostic Report</h2>
            <div className="space-y-4">
              <div>
                <span className="text-[9px] text-zinc-600 uppercase block">Issue Detected</span>
                <p className="text-sm font-bold text-zinc-200">{currentData.title}</p>
              </div>
              <div>
                <span className="text-[9px] text-zinc-600 uppercase block">Risk Level</span>
                <p className={`text-[10px] font-bold uppercase ${currentData.risk === 'Critical' ? 'text-red-500' : 'text-blue-400'}`}>{currentData.risk}</p>
              </div>
              <div>
                <span className="text-[9px] text-zinc-600 uppercase block">Technical Explanation</span>
                <p className="text-[11px] text-zinc-500 italic leading-relaxed">"{currentData.explanation}"</p>
              </div>
            </div>
          </div>

          <div className="bg-[#080808] border border-zinc-900 p-5 rounded-2xl">
            <h2 className="text-green-500 text-[10px] font-bold uppercase mb-4 tracking-widest">Recovery Steps</h2>
            <ul className="space-y-2">
              {currentData.solutions.map((s, i) => (
                <li key={i} className="text-[11px] text-zinc-400 flex gap-2">
                  <span className="text-green-500">✓</span> {s}
                </li>
              ))}
            </ul>
          </div>

          <button 
            onClick={() => window.print()}
            className="w-full bg-white text-black font-bold py-3 rounded-xl text-[10px] uppercase tracking-widest hover:bg-zinc-200 transition-colors"
          >
            Export PDF Report
          </button>
        </div>
      </div>
    </main>
  );
}