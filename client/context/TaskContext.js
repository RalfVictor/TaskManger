import React, { createContext, useEffect } from "react";
import { useUserContext } from "./UserContext";
import axios from "axios";
import toast from "react-hot-toast";
const TaskContext = createContext();

const serverUrl = "http://localhost:8000/api/v1";

export const TasksProvider = ({ children }) => {
  const userId = useUserContext().user._id;

  const [tasks, setTasks] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [task, setTask] = React.useState({});
  const [isEditing, setIsEditing] = React.useState(false);
  const [priority, setPriority] = React.useState("all");
  const [activeTask, setActiveTask] = React.useState(null);
  const [modalMode, setModalMode] = React.useState("");
  const [profileModal, setProfileModal] = React.useState(false);

  const openModalForAdd = () => {
    setModalMode("add");
    setIsEditing(true);
    setTask({});
  };

  const closeModal = () => {
    setIsEditing(false);
    setProfileModal(false);
    setModalMode("");
    setActiveTask(null);
    setTask({});
  };

  const openModalForEdit = (task) => {
    setModalMode("edit");
    setIsEditing(true);
    setActiveTask(task);
  };

  const openProfileModal = () => {
    setProfileModal(true);
  };

  const getTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${serverUrl}/tasks`);

      setTasks(response.data.tasks);
    } catch (error) {
      console.log("Error getting tasks", error);
    }
    setLoading(false);
  };

  // get task
  const getTask = async (taskId) => {
    setLoading(true);
    try {
      const response = await axios.get(`${serverUrl}/task/${taskId}`);

      setTask(response.data);
    } catch (error) {
      console.log("Error getting task", error);
    }
    setLoading(false);
  };

  const createTask = async (task) => {
    setLoading(true);
    try {
      const res = await axios.post(`${serverUrl}/task/create`, task);

      console.log("Task created", res.data);

      setTasks([...tasks, res.data]);
      toast.success("Task created successfully");
    } catch (error) {
      console.log("Error creating task", error);
    }
    setLoading(false);
  };

  const updateTask = async (task) => {
    setLoading(true);
    try {
      const res = await axios.patch(`${serverUrl}/task/${task._id}`, task);

      // update the task in the tasks array
      const newTasks = tasks.map((tsk) => {
        return tsk._id === res.data._id ? res.data : tsk;
      });

      toast.success("Task updated successfully");

      setTasks(newTasks);
    } catch (error) {
      console.log("Error updating task", error);
    }
  };

  const deleteTask = async (taskId) => {
    setLoading(true);
    try {
      await axios.delete(`${serverUrl}/task/${taskId}`);

      // remove the task from the tasks array
      const newTasks = tasks.filter((tsk) => tsk._id !== taskId);

      setTasks(newTasks);
    } catch (error) {
      console.log("Error deleting task", error);
    }
  };
  const handleInput = (name) => (e) => {
    if (name === "setTask") {
      setTask(e);
    } else {
      setTask({ ...task, [name]: e.target.value });
    }
  };

  useEffect(() => {
    getTasks();
  }, [userId]);

  useEffect(() => {
    getTasks();
  }, [userId]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        task,
        getTask,
        createTask,
        updateTask,
        deleteTask,
        isEditing,
        setIsEditing,
        priority,
        setPriority,
        activeTask,
        setActiveTask,
        modalMode,
        setModalMode,
        profileModal,
        setProfileModal,
        handleInput,
        openModalForAdd,
        openModalForEdit,
        openProfileModal,
        closeModal,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  return React.useContext(TaskContext);
};
