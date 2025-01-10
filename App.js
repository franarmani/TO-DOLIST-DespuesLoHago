import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  AppState,
  StatusBar,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import TaskItem from './components/TaskItem';
import SocialScreen from './components/SocialScreen';
import ParticleEffect from './components/ParticleEffect';
import SplashScreen from './screens/SplashScreen';
import { updateNotification, cancelNotification, initializeNotifications } from './utils/notifications';
import { ThemeProvider, useTheme } from './context/ThemeContext';

initializeNotifications();

const STORAGE_KEY = '@tasks';

function AppContent() {
  const { theme, toggleTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [showCompleted, setShowCompleted] = useState(false);
  const [showSocial, setShowSocial] = useState(false);
  const [particleEffect, setParticleEffect] = useState(null);
  const [particlePosition, setParticlePosition] = useState({ x: 0, y: 0 });

  // Cargar tareas al iniciar
  useEffect(() => {
    const initialize = async () => {
      await loadTasks();
      // Mantenemos el splash screen visible por la duración completa de la animación
      // incluso si las tareas cargan antes
    };
    initialize();
  }, []);

  // Guardar tareas cuando cambien
  useEffect(() => {
    saveTasks();
  }, [tasks]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        initializeNotifications();
        loadTasks(); // Recargar tareas cuando la app vuelve a estar activa
        
        tasks.forEach(task => {
          if (task.scheduledDate && !task.completed) {
            try {
              updateNotification(task.id, task.text, task.scheduledDate);
            } catch (error) {
              console.log('Error al actualizar notificación:', error);
            }
          }
        });
      }
    });

    return () => {
      subscription.remove();
    };
  }, [tasks]);

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.log('Error al cargar tareas:', error);
    }
  };

  const saveTasks = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.log('Error al guardar tareas:', error);
    }
  };

  const showParticles = (type, event) => {
    if (event && event.nativeEvent) {
      setParticlePosition({
        x: event.nativeEvent.pageX,
        y: event.nativeEvent.pageY,
      });
    }
    setParticleEffect(type);
    setTimeout(() => setParticleEffect(null), 2000);
  };

  const addTask = () => {
    if (newTask.trim().length > 0) {
      const newTaskItem = {
        id: Date.now().toString(),
        text: newTask,
        completed: false,
        scheduledDate: null,
      };
      setTasks([...tasks, newTaskItem]);
      setNewTask('');
      showParticles('add');
    }
  };

  const deleteTask = (taskId) => {
    try {
      cancelNotification(taskId);
      setTasks(tasks.filter((task) => task.id !== taskId));
      showParticles('delete');
    } catch (error) {
      console.log('Error al eliminar tarea:', error);
      setTasks(tasks.filter((task) => task.id !== taskId));
    }
  };

  const toggleComplete = (taskId) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          const newStatus = !task.completed;
          try {
            if (newStatus) {
              cancelNotification(taskId);
              showParticles('complete');
            } else if (task.scheduledDate) {
              updateNotification(task.id, task.text, task.scheduledDate);
            }
          } catch (error) {
            console.log('Error al actualizar estado de la tarea:', error);
          }
          return { ...task, completed: newStatus };
        }
        return task;
      })
    );
  };

  const editTask = (taskId, newText) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          try {
            if (task.scheduledDate && !task.completed) {
              updateNotification(taskId, newText, task.scheduledDate);
            }
            showParticles('edit');
          } catch (error) {
            console.log('Error al editar tarea:', error);
          }
          return { ...task, text: newText };
        }
        return task;
      })
    );
  };

  const scheduleTask = (taskId, date) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          try {
            if (!task.completed) {
              updateNotification(taskId, task.text, date);
            }
          } catch (error) {
            console.log('Error al programar tarea:', error);
          }
          return { ...task, scheduledDate: date };
        }
        return task;
      })
    );
  };

  const filteredTasks = tasks.filter((task) =>
    showCompleted ? task.completed : !task.completed
  ).sort((a, b) => {
    if (!a.scheduledDate && !b.scheduledDate) return 0;
    if (!a.scheduledDate) return 1;
    if (!b.scheduledDate) return -1;
    return new Date(a.scheduledDate) - new Date(b.scheduledDate);
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      flex: 1,
      paddingTop: 50,
      paddingHorizontal: 20,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
    },
    inputContainer: {
      flexDirection: 'row',
      marginBottom: 20,
    },
    input: {
      flex: 1,
      backgroundColor: theme.inputBackground,
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderRadius: 10,
      marginRight: 10,
      fontSize: 16,
      color: theme.text,
      borderColor: theme.border,
      borderWidth: 1,
    },
    addButton: {
      backgroundColor: theme.primary,
      paddingHorizontal: 20,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
    },
    addButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    tabs: {
      flexDirection: 'row',
      marginBottom: 20,
    },
    tab: {
      flex: 1,
      paddingVertical: 10,
      alignItems: 'center',
      backgroundColor: theme.tabBackground,
      marginHorizontal: 5,
      borderRadius: 10,
      borderColor: theme.border,
      borderWidth: 1,
    },
    activeTab: {
      backgroundColor: theme.activeTab,
    },
    tabText: {
      fontSize: 16,
      color: theme.textSecondary,
    },
    activeTabText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    list: {
      flex: 1,
    },
    themeButton: {
      padding: 10,
    },
    headerButtons: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconButton: {
      padding: 8,
    },
  });

  if (isLoading) {
    return <SplashScreen onFinish={() => setIsLoading(false)} />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar
        barStyle={theme.name === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>DespuésLoHago</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity 
              onPress={() => setShowSocial(true)} 
              style={[styles.iconButton, { marginRight: 8 }]}
            >
              <MaterialIcons name="star" size={24} color={theme.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleTheme} style={styles.iconButton}>
              <MaterialIcons
                name={theme.name === 'dark' ? 'wb-sunny' : 'nightlight-round'}
                size={24}
                color={theme.text}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nueva tarea..."
            placeholderTextColor={theme.textSecondary}
            value={newTask}
            onChangeText={setNewTask}
            onSubmitEditing={addTask}
          />
          <TouchableOpacity style={styles.addButton} onPress={addTask}>
            <Text style={styles.addButtonText}>Agregar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, !showCompleted && styles.activeTab]}
            onPress={(e) => {
              setShowCompleted(false);
              showParticles('add', e);
            }}
          >
            <Text style={[styles.tabText, !showCompleted && styles.activeTabText]}>
              Pendientes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, showCompleted && styles.activeTab]}
            onPress={(e) => {
              setShowCompleted(true);
              showParticles('complete', e);
            }}
          >
            <Text style={[styles.tabText, showCompleted && styles.activeTabText]}>
              Completadas
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={filteredTasks}
          renderItem={({ item }) => (
            <TaskItem
              task={item}
              onDelete={(e) => deleteTask(item.id, e)}
              onToggleComplete={(e) => toggleComplete(item.id, e)}
              onEdit={(text, e) => editTask(item.id, text, e)}
              onSchedule={scheduleTask}
              theme={theme}
            />
          )}
          keyExtractor={(item) => item.id}
          style={styles.list}
        />

        {particleEffect && (
          <ParticleEffect 
            type={particleEffect}
            position={particlePosition}
            onComplete={() => setParticleEffect(null)} 
          />
        )}
      </View>

      <Modal
        visible={showSocial}
        animationType="slide"
        onRequestClose={() => setShowSocial(false)}
      >
        <SocialScreen onClose={() => setShowSocial(false)} theme={theme} />
      </Modal>
    </KeyboardAvoidingView>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
