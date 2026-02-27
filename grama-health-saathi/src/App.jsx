import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Bell, Phone, Users, CalendarDays, AlertTriangle, Home, MessageCircle } from "lucide-react";

export default function GramaHealthSaathiApp() {
  const [page, setPage] = useState("dashboard");
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Namaste 🙏 I am Grama Health Saathi. Ask me about your medicines." },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const sendMessage = () => {
    if (!input) return;
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      let botReply = "Please follow doctor instructions carefully.";
      if (input.toLowerCase().includes("bp")) {
        botReply = "Take BP tablet in the morning after food. Avoid salty food.";
      } else if (input.toLowerCase().includes("missed")) {
        botReply = "If you missed a dose, take it soon unless next dose time is near.";
      } else if (input.toLowerCase().includes("diet")) {
        botReply = "Eat light food. Avoid oily and spicy meals. Drink enough water.";
      }
      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
      setTyping(false);
    }, 1000);
  };

  const SidebarButton = ({ label, icon, value }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setPage(value)}
      className={`flex items-center gap-2 p-2 rounded-xl w-full text-left transition-all ${
        page === value ? "bg-green-100 font-semibold shadow" : "hover:bg-gray-100"
      }`}
    >
      {icon} {label}
    </motion.button>
  );

  const pageVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex">
      {/* Animated Sidebar */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-64 bg-white shadow-xl p-4 space-y-3"
      >
        <h1 className="text-2xl font-bold text-green-700 mb-4">Grama Health Saathi</h1>
        <SidebarButton label="Dashboard" icon={<Home size={18} />} value="dashboard" />
        <SidebarButton label="Family" icon={<Users size={18} />} value="family" />
        <SidebarButton label="Calendar" icon={<CalendarDays size={18} />} value="calendar" />
        <SidebarButton label="Alerts" icon={<AlertTriangle size={18} />} value="alerts" />
        <SidebarButton label="Emergency" icon={<Phone size={18} />} value="emergency" />
        <SidebarButton label="Chatbot" icon={<MessageCircle size={18} />} value="chatbot" />
      </motion.div>

      {/* Main Content with Page Transitions */}
      <div className="flex-1 p-6 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4 }}
          >
            {page === "dashboard" && (
              <div>
                <h2 className="text-3xl font-bold text-green-700 mb-6">Health Overview</h2>
                <Card className="rounded-2xl shadow-lg mb-6">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">Adherence Score</h3>
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "75%" }}
                        transition={{ duration: 1.5 }}
                        className="bg-green-500 h-4 rounded-full"
                      />
                    </div>
                    <p className="text-sm mt-2">75% medicines taken on time</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {page === "family" && (
              <div>
                <h2 className="text-2xl font-bold text-green-700 mb-4">Family Members</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { name: "Ramesh (Father)", age: 58, condition: "Diabetes, BP", phone: "9876543210" },
                    { name: "Lakshmi (Mother)", age: 52, condition: "Anemia", phone: "9876501234" },
                    { name: "Anjali (Grandmother)", age: 72, condition: "Arthritis", phone: "9876512345" },
                    { name: "Kiran (Brother)", age: 25, condition: "Asthma", phone: "9876598765" }
                  ].map((member, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      className="bg-white p-4 rounded-2xl shadow-lg"
                    >
                      <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                      <p className="text-sm">Age: {member.age}</p>
                      <p className="text-sm">Condition: {member.condition}</p>
                      <p className="text-sm">Contact: 📞 {member.phone}</p>
                      <Button className="mt-3 w-full bg-green-600 hover:bg-green-700">
                        View Health Details
                      </Button>
                    </motion.div>
                  ))}
                </div>
                <Button className="mt-6 bg-blue-600 hover:bg-blue-700">
                  + Add New Family Member
                </Button>
              </div>
            )}

            {page === "calendar" && (
              <div>
                <h2 className="text-2xl font-bold text-green-700 mb-4">Medicine Calendar</h2>
                <div className="grid grid-cols-7 gap-2">
                  {[...Array(30)].map((_, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.15, rotate: 3 }}
                      className="bg-green-100 p-4 rounded-xl text-center shadow cursor-pointer"
                    >
                      💊
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {page === "alerts" && (
              <div>
                <h2 className="text-2xl font-bold text-orange-600 mb-4">Health Alerts & Reminders</h2>

                <div className="space-y-4">
                  {[
                    { title: "Morning BP Tablet", time: "8:00 AM", status: "Missed", level: "high" },
                    { title: "Sugar Check", time: "7:30 AM", status: "Completed", level: "low" },
                    { title: "Evening Diabetes Tablet", time: "8:00 PM", status: "Upcoming", level: "medium" },
                    { title: "Doctor Appointment", time: "12 March 2026", status: "Upcoming", level: "medium" }
                  ].map((alert, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      className={`p-4 rounded-2xl shadow-md border-l-4 ${
                        alert.level === "high"
                          ? "bg-red-50 border-red-500"
                          : alert.level === "medium"
                          ? "bg-yellow-50 border-yellow-500"
                          : "bg-green-50 border-green-500"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">{alert.title}</h3>
                          <p className="text-sm text-gray-600">Time: {alert.time}</p>
                        </div>
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-semibold ${
                            alert.level === "high"
                              ? "bg-red-500 text-white"
                              : alert.level === "medium"
                              ? "bg-yellow-500 text-white"
                              : "bg-green-500 text-white"
                          }`}
                        >
                          {alert.status}
                        </span>
                      </div>

                      <div className="mt-3 flex gap-2">
                        <Button className="bg-green-600 hover:bg-green-700 text-white text-xs">
                          Mark as Done
                        </Button>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white text-xs">
                          Snooze 10 mins
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 bg-orange-100 p-4 rounded-xl text-sm shadow">
                  🔔 Alerts help ensure medicines are taken on time and appointments are not missed.
                </div>
              </div>
            )}

            {page === "emergency" && (
              <div>
                <h2 className="text-2xl font-bold text-red-600 mb-4">Emergency Support</h2>

                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <Button className="w-full bg-red-500 hover:bg-red-600 mb-4 text-lg">
                    🚑 Call 108 Ambulance
                  </Button>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { title: "Women Helpline", number: "181" },
                    { title: "Child Helpline", number: "1098" },
                    { title: "Police Emergency", number: "100" },
                    { title: "Fire Emergency", number: "101" },
                    { title: "Family Doctor", number: "9876540000" },
                    { title: "Nearby Hospital", number: "040-12345678" }
                  ].map((contact, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      className="bg-white p-4 rounded-2xl shadow-md"
                    >
                      <h3 className="font-semibold">{contact.title}</h3>
                      <p className="text-lg font-bold mt-1">📞 {contact.number}</p>
                      <Button className="mt-3 w-full bg-red-500 hover:bg-red-600">
                        Call Now
                      </Button>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 bg-yellow-100 p-4 rounded-xl text-sm shadow">
                  ⚠ In case of chest pain, unconsciousness, severe bleeding, or breathing difficulty — call emergency services immediately.
                </div>
              </div>
            )}

            {page === "chatbot" && (
              <div className="max-w-2xl">
                <h2 className="text-2xl font-bold text-green-700 mb-4">AI Health Assistant</h2>
                <div className="bg-white rounded-2xl shadow-lg p-4 h-[400px] overflow-y-auto mb-4">
                  {messages.map((msg, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mb-3 flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`px-4 py-2 rounded-2xl max-w-xs text-sm ${
                          msg.sender === "user"
                            ? "bg-green-500 text-white"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </motion.div>
                  ))}
                  {typing && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm text-gray-500"
                    >
                      Grama Health Saathi is typing...
                    </motion.div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask about medicine, diet, missed dose..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                  <Button onClick={sendMessage}>Send</Button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
