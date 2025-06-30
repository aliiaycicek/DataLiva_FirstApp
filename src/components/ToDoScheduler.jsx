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
    <div className="todo-scheduler-wrapper">
      <style>{`
        .todo-scheduler-wrapper {
          background: linear-gradient(135deg, #e3f2fd 0%, #f8bbd0 100%);
          border-radius: 18px;
          box-shadow: 0 4px 24px #0002;
          padding: 32px 12px 24px 12px;
          max-width: 900px;
          margin: 32px auto;
        }
        .dx-scheduler-work-space .dx-scheduler-date-table-cell {
          background: #fff;
          border-radius: 10px;
          transition: box-shadow 0.2s, background 0.2s;
        }
        .dx-scheduler-work-space .dx-scheduler-date-table-cell.dx-state-hover {
          box-shadow: 0 0 0 2px #1976d2;
          background: #e3f2fd;
        }
        .dx-scheduler-appointment {
          border-radius: 10px !important;
          font-weight: 500;
          box-shadow: 0 2px 8px #0001;
          padding: 2px 8px;
        }
        .dx-scheduler-appointment-content {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .todo-status-badge {
          display: inline-block;
          min-width: 70px;
          font-size: 12px;
          font-weight: bold;
          border-radius: 8px;
          padding: 2px 8px;
          color: #fff;
          margin-left: 4px;
        }
        @media (max-width: 700px) {
          .todo-scheduler-wrapper {
            padding: 8px 2px;
            max-width: 100vw;
          }
        }
      `}</style>
      <h2 style={{textAlign:'center', color:'#1976d2', marginBottom:24, letterSpacing:1}}>Görev Takvimi</h2>
      {loading ? (
        <div>Yükleniyor...</div>
      ) : (
        <Scheduler
          dataSource={tasks.map(task => ({
            ...task,
            text: (
              <span>
                {task.text}
                <span className="todo-status-badge" style={{background: statusList.find(s=>s.id===task.status)?.color}}>
                  {statusList.find(s=>s.id===task.status)?.text}
                </span>
              </span>
            )
          }))}
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