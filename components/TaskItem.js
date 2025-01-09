import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const TaskItem = ({ task, onDelete, onToggleComplete, onEdit, onSchedule, theme }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(task.text);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleEdit = (e) => {
    if (editedText.trim().length > 0) {
      onEdit(editedText.trim(), e);
      setIsEditing(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 15,
      borderRadius: 10,
      marginVertical: 5,
    },
    checkbox: {
      width: 24,
      height: 24,
      marginRight: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    text: {
      fontSize: 16,
      color: theme.text,
    },
    date: {
      fontSize: 12,
      color: theme.textSecondary,
      marginTop: 4,
    },
    completedText: {
      textDecorationLine: 'line-through',
      color: theme.textSecondary,
    },
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    actionButton: {
      padding: 5,
      marginLeft: 10,
      borderRadius: 5,
    },
    input: {
      flex: 1,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 5,
      padding: 8,
      fontSize: 16,
      color: theme.text,
      backgroundColor: theme.inputBackground,
    },
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <TouchableOpacity 
        style={styles.checkbox}
        onPress={onToggleComplete}
      >
        <MaterialIcons
          name={task.completed ? 'check-box' : 'check-box-outline-blank'}
          size={24}
          color={task.completed ? theme.primary : theme.textSecondary}
        />
      </TouchableOpacity>

      <View style={styles.content}>
        {isEditing ? (
          <TextInput
            style={[styles.input, { color: theme.text, borderColor: theme.border }]}
            value={editedText}
            onChangeText={setEditedText}
            onBlur={handleEdit}
            onSubmitEditing={handleEdit}
            autoFocus
          />
        ) : (
          <Text style={[
            styles.text,
            { color: theme.text },
            task.completed && styles.completedText
          ]}>
            {task.text}
          </Text>
        )}
        {task.scheduledDate && (
          <Text style={[styles.date, { color: theme.textSecondary }]}>
            {new Date(task.scheduledDate).toLocaleDateString()}
          </Text>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: theme.calendar }]}
          onPress={() => setShowDatePicker(true)}
        >
          <MaterialIcons name="event" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: theme.edit }]}
          onPress={() => {
            setIsEditing(true);
            onEdit(task.text);
          }}
        >
          <MaterialIcons name="edit" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: theme.danger }]}
          onPress={onDelete}
        >
          <MaterialIcons name="delete" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <DateTimePickerModal
        isVisible={showDatePicker}
        mode="datetime"
        onConfirm={(date) => {
          onSchedule(date);
          setShowDatePicker(false);
        }}
        onCancel={() => setShowDatePicker(false)}
      />
    </View>
  );
};

export default TaskItem; 