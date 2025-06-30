import React, { useEffect, useState, useCallback } from "react";
import Scheduler, { Resource } from "devextreme-react/scheduler";
import "devextreme/dist/css/dx.light.css";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

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
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700&display=swap');
        .todo-scheduler-wrapper {
          background: linear-gradient(135deg, #e3f2fd 0%, #f8bbd0 100%);
          border-radius: 18px;
          box-shadow: 0 4px 24px #0002;
          padding: 32px 12px 24px 12px;
          max-width: 950px;
          margin: 32px auto;
          font-family: 'Montserrat', Arial, sans-serif;
        }
        .todo-header {
          text-align: center;
          color: #1976d2;
          margin-bottom: 8px;
          letter-spacing: 1px;
          font-size: 2.2rem;
          font-weight: 700;
        }
        .todo-sub {
          text-align: center;
          color: #333;
          margin-bottom: 24px;
          font-size: 1.1rem;
          font-weight: 600;
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
        .todo-list {
          margin: 32px auto 0 auto;
          background: #fff;
          border-radius: 14px;
          box-shadow: 0 2px 12px #0001;
          padding: 18px 20px 10px 20px;
          max-width: 600px;
        }
        .todo-list-title {
          font-size: 1.3rem;
          color: #1976d2;
          font-weight: 700;
          margin-bottom: 12px;
        }
        .todo-list-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #eee;
        }
        .todo-list-item:last-child {
          border-bottom: none;
        }
        .todo-list-task {
          font-size: 1.08rem;
          font-weight: 600;
          color: #333;
        }
        .todo-list-time {
          font-size: 0.98rem;
          color: #888;
          margin-left: 12px;
        }
        @media (max-width: 700px) {
          .todo-scheduler-wrapper {
            padding: 8px 2px;
            max-width: 100vw;
          }
          .todo-list {
            padding: 10px 4px 6px 4px;
            max-width: 98vw;
          }
        }
      `}</style>
      <div className="todo-header">Data Liva ToDo App</div>
      <div className="todo-sub">Takvimden görev ekleyin, görevlerinizi aşağıda kolayca takip edin.</div>
      {loading ? (
        <div>Yükleniyor...</div>
      ) : (
        <Scheduler
          dataSource={tasks.map(task => ({
            ...task,
            text: typeof task.text === 'string' ? task.text : (task.subject || ''),
            startDate: new Date(task.startDate),
            endDate: new Date(task.endDate),
            status: task.status || 1,
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
      <div className="todo-list">
        <div className="todo-list-title">Tüm Görevler</div>
        {tasks.length === 0 && <div>Henüz görev yok.</div>}
        {tasks.map(task => (
          <Card key={task.id} sx={{ mb: 2, borderRadius: 2, boxShadow: 2 }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
              <div style={{minWidth: 0, flex: 1}}>
                <Typography variant="h6" component="div" noWrap>{task.text}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {task.startDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {task.endDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </Typography>
              </div>
              <span style={{background: statusList.find(s=>s.id===task.status)?.color, color:'#fff', borderRadius:8, padding:'2px 8px', fontWeight:600, fontSize:13, minWidth:70, textAlign:'center'}}>
                {statusList.find(s=>s.id===task.status)?.text}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 