import React, { useEffect, useState, useCallback } from "react";
import Scheduler, { Resource } from "devextreme-react/scheduler";
import "devextreme/dist/css/dx.light.css";

const currentDate = new Date();
const views = ["day", "week", "month"];
const apiUrl = "http://localhost:3001/api/todos";

const statusList = [
  { text: "Bekliyor", id: 1, color: "#FFA500" },
  { text: "Tamamlandı", id: 2, color: "#008000" },
];

export default function ToDoScheduler() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Görevleri API'den çek
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(apiUrl);
      const data = await res.json();
      setTasks(
        data.map((item) => ({
          ...item,
          startDate: new Date(item.startDate),
          endDate: new Date(item.endDate),
        }))
      );
    } catch (err) {
      alert("Görevler alınamadı!");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Görev ekle
  const onAppointmentAdd = async (e) => {
    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(e.appointmentData),
      });
      if (!res.ok) throw new Error();
      await fetchTasks();
    } catch {
      alert("Görev eklenemedi!");
    }
  };

  // Görev güncelle
  const onAppointmentUpdate = async (e) => {
    try {
      const res = await fetch(`${apiUrl}/${e.appointmentData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(e.appointmentData),
      });
      if (!res.ok) throw new Error();
      await fetchTasks();
    } catch {
      alert("Görev güncellenemedi!");
    }
  };

  // Görev sil
  const onAppointmentDelete = async (e) => {
    try {
      const res = await fetch(`${apiUrl}/${e.appointmentData.id}`, {
        method: "DELETE" });
      if (!res.ok) throw new Error();
      await fetchTasks();
    } catch {
      alert("Görev silinemedi!");
    }
  };

  return (
    <div style={{ height: "600px", background: "#f8f9fa", borderRadius: 12, boxShadow: "0 2px 12px #0001", padding: 16 }}>
      {loading ? (
        <div>Yükleniyor...</div>
      ) : (
        <Scheduler
          dataSource={tasks}
          views={views}
          defaultCurrentView="week"
          currentDate={currentDate}
          startDayHour={8}
          endDayHour={20}
          height={560}
          editing={{
            allowAdding: true,
            allowDeleting: true,
            allowUpdating: true,
            allowDragging: true,
            allowResizing: true,
          }}
          onAppointmentAdded={onAppointmentAdd}
          onAppointmentUpdated={onAppointmentUpdate}
          onAppointmentDeleted={onAppointmentDelete}
        >
          <Resource
            dataSource={statusList}
            fieldExpr="status"
            label="Durum"
          />
        </Scheduler>
      )}
    </div>
  );
} 